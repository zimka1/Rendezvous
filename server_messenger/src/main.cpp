#include "../include/websocket.h"
#include "../include/globals.h"
#include <openssl/evp.h>
#include <openssl/rand.h>

using json = nlohmann::json;

std::string toHex(const std::string& input) {
    std::stringstream ss;
    for (unsigned char c : input) {
        ss << std::hex << std::setw(2) << std::setfill('0') << (int)c;
    }
    return ss.str();
}

std::string fromHex(const std::string& hex) {
    std::string result;
    for (size_t i = 0; i < hex.length(); i += 2) {
        std::string byteString = hex.substr(i, 2);
        char byte = (char) strtol(byteString.c_str(), nullptr, 16);
        result.push_back(byte);
    }
    return result;
}

std::string pbkdf2_hash(const std::string& password, const std::string& salt) {
    const int iterations = 100000;
    const int key_len = 64;

    std::vector<unsigned char> hash(key_len);

    PKCS5_PBKDF2_HMAC(password.c_str(), password.length(),
                      (const unsigned char*)salt.data(), salt.size(),
                      iterations, EVP_sha256(),
                      key_len, hash.data());

    return std::string((char*)hash.data(), key_len);
}

std::pair<std::string, std::string> hash_password(const std::string& password) {
    unsigned char salt_bytes[16];
    RAND_bytes(salt_bytes, sizeof(salt_bytes));
    std::string salt(reinterpret_cast<char*>(salt_bytes), sizeof(salt_bytes));
    std::string hash = pbkdf2_hash(password, salt);

    return {toHex(salt), toHex(hash)};
}

bool verify_password(const std::string& password, const std::string& salt_hex, const std::string& hash_hex) {
    std::string salt = fromHex(salt_hex);
    std::string expected_hash = fromHex(hash_hex);
    std::string actual_hash = pbkdf2_hash(password, salt);
    return actual_hash == expected_hash;
}

// === Command map ===
const std::unordered_map<std::string, int> COMMAND_MAP = {
        {"private_msg", 1},       // Command for sending a private message
        {"register", 2},          // Command for user registration
        {"login", 3},             // Command for user login
        {"logout", 4},            // Command for user logout
        {"user_list_db", 5},      // Command for fetching the list of users from the database
        {"get_messages", 6},      // Command for retrieving messages between users
        {"get_last_message", 7},  // Command for fetching the last message between users
        {"save_read_private_msg", 8}, // Command for saving a private message and marking it as read
        {"get_unread_messages_count", 9} // Command for getting the count of unread messages
};

// === Main ===
int main() {
    const char* conninfo = "dbname=rendezvous user=zimka password=12345 hostaddr=127.0.0.1 port=5432";
    PGconn* conn = PQconnectdb(conninfo);
    if (PQstatus(conn) != CONNECTION_OK) {
        std::cerr << "DB connection failed: " << PQerrorMessage(conn) << std::endl;
        PQfinish(conn);
        return 1;
    }

    db = conn;

    // Initialize the database (create tables if they don't exist and establish a connection)
    initDatabase();

    // Get the latest user ID from the database and increment it by 1 for the next user
    latest_user_id = getLastUserId(db) + 1;

    uWS::App()

            // === HTTP /register ===
            .post("/register", [conn](auto* res, auto* /*req*/) {
                std::shared_ptr<std::string> body = std::make_shared<std::string>();

                res->onData([res, conn, body](std::string_view data, bool last) mutable {
                    body->append(data);
                    if (!last) return;

                    try {
                        json parsed = json::parse(*body);

                        std::string name       = parsed["name"];
                        std::string email      = parsed["email"];
                        std::string password   = parsed["password"];
                        std::string nickname   = parsed["nickname"];
                        std::string sex        = parsed["sex"];
                        std::string birthday   = parsed["birthday"];
                        std::string gender     = parsed.value("gender", "");
                        std::string preference = parsed["preference"];

                        const char* genderParam = gender.empty() ? nullptr : gender.c_str();

                        auto [salt, hash] = hash_password(password);

                        const char* insertSQL = R"(
                INSERT INTO users (name, email, nickname, sex, birthday, password_salt, password_hash, gender, preference)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            )";

                        const char* params[9] = {
                                name.c_str(), email.c_str(), nickname.c_str(), sex.c_str(), birthday.c_str(),
                                salt.c_str(), hash.c_str(), genderParam, preference.c_str()
                        };

                        PGresult* result = PQexecParams(conn, insertSQL, 9, nullptr, params, nullptr, nullptr, 0);

                        if (PQresultStatus(result) != PGRES_COMMAND_OK) {
                            std::string err = PQerrorMessage(conn);
                            PQclear(result);
                            res->writeStatus("500 Internal Server Error")
                                    ->writeHeader("Content-Type", "text/plain")
                                    ->end("DB Error: " + err);
                            return;
                        }

                        PQclear(result);
                        res->writeStatus("200 OK")
                                ->writeHeader("Content-Type", "text/plain")
                                ->end("Registered");

                    } catch (const std::exception& e) {
                        if (!res->hasResponded()) {
                            res->writeStatus("400 Bad Request")
                                    ->writeHeader("Content-Type", "text/plain")
                                    ->end("JSON Error: " + std::string(e.what()));
                        }
                    }
                });

                res->onAborted([]() {
                    std::cout << "⚠️ /register aborted by client" << std::endl;
                });
            })


                    // === HTTP /login ===
            .post("/login", [conn](auto* res, auto* /*req*/) {
                std::shared_ptr<std::string> body = std::make_shared<std::string>();

                res->onData([res, conn, body](std::string_view data, bool last) mutable {
                    body->append(data);
                    if (!last) return;

                    try {
                        json parsed = json::parse(*body);
                        std::string email = parsed["email"];
                        std::string password = parsed["password"];

                        // ⬅️ ВЫБИРАЕМ ТЕПЕРЬ ТАКЖЕ `id`
                        const char* query = "SELECT id, password_salt, password_hash FROM users WHERE email = $1";
                        const char* params[1] = { email.c_str() };

                        PGresult* result = PQexecParams(conn, query, 1, nullptr, params, nullptr, nullptr, 0);

                        if (PQresultStatus(result) != PGRES_TUPLES_OK || PQntuples(result) == 0) {
                            PQclear(result);
                            res->writeStatus("401 Unauthorized")
                                    ->writeHeader("Content-Type", "text/plain")
                                    ->end("Invalid email or password");
                            return;
                        }

                        // ⬅️ ДОСТАЁМ ID и пароли
                        int user_id = std::stoi(PQgetvalue(result, 0, 0));
                        std::string salt_hex = PQgetvalue(result, 0, 1);
                        std::string hash_hex = PQgetvalue(result, 0, 2);
                        PQclear(result);

                        if (!verify_password(password, salt_hex, hash_hex)) {
                            res->writeStatus("401 Unauthorized")
                                    ->writeHeader("Content-Type", "text/plain")
                                    ->end("Invalid email or password");
                            return;
                        }

                        // ⬅️ ОТПРАВЛЯЕМ JSON с user_id
                        json response = {
                                {"user_id", user_id}
                        };
                        res->writeStatus("200 OK")
                                ->writeHeader("Content-Type", "application/json")
                                ->end(response.dump());



                    } catch (const std::exception& e) {
                        if (!res->hasResponded()) {
                            res->writeStatus("400 Bad Request")
                                    ->writeHeader("Content-Type", "text/plain")
                                    ->end("JSON Error: " + std::string(e.what()));
                        }
                    }
                });

                res->onAborted([]() {
                    std::cout << "⚠️ /login aborted by client" << std::endl;
                });
            })




                    // === WebSocket ===
            .ws<UserData>("/*", {
                    .idleTimeout = 30,
                    .open = [](auto* ws) {
                        ws->send("Welcome to Rendezvous");
                        std::cout << "Welcome to Rendezvous";
                        printUsersTable(db);
                    },
                    .message = [](auto* ws, std::string_view message, uWS::OpCode opCode) {
                        try {
                            json parsed = json::parse(message);
                            std::string command = parsed["command"];

                            auto it = COMMAND_MAP.find(command);
                            if (it == COMMAND_MAP.end()) return;

                            switch (it->second) {
                                case 1: process_private_msg(parsed, ws); break;
                                case 2: process_registration(parsed, ws); break;
                                case 3: process_login(parsed, ws); break;
                                case 4: process_logout(ws); break;
                                case 5: process_user_list_from_db(ws); break;
                                case 6: process_get_messages(parsed, ws); break;
                                case 7: process_get_last_message(parsed, ws); break;
                                case 8: saveMessage(parsed, ws); break;
                                case 9: process_get_unreadMessagesCount(parsed, ws); break;
                            }
                        } catch (...) {
                            ws->send("Invalid JSON", uWS::OpCode::TEXT);
                        }
                    },
                    .close = [](auto* ws, int, std::string_view) {
                        auto* data = ws->getUserData();
                        connectedUsers.erase(data->id);
                        std::cout << "Disconnected: " << data->id << std::endl;
                    }
            })

            .listen(8080, [](auto* token) {
                if (token) std::cout << "🟢 Unified server on http://localhost:8080\n";
            })

            .run();

    PQfinish(conn);
    return 0;
}
