#include "httplib.h"
#include "libpq-fe.h"
#include <nlohmann/json.hpp>
#include <iostream>
#include <openssl/evp.h>
#include <openssl/rand.h>
#include <vector>
#include <sstream>
#include <iomanip>

using json = nlohmann::json;
using namespace httplib;

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

int main() {
    Server svr;

    const char* conninfo = "dbname=rendezvous user=zimka password=12345 hostaddr=127.0.0.1 port=5432";
    PGconn* conn = PQconnectdb(conninfo);

    if (PQstatus(conn) != CONNECTION_OK) {
        std::cerr << "DB connection failed: " << PQerrorMessage(conn) << std::endl;
        PQfinish(conn);
        return 1;
    }

    // === /register ===
    svr.Post("/register", [conn](const Request& req, Response& res) {
        try {
            json data = json::parse(req.body);

            std::string name     = data["name"];
            std::string email    = data["email"];
            std::string nickname = data["nickname"];
            std::string sex      = data["sex"];
            std::string birthday = data["birthday"];
            std::string password = data["password"];
            std::string gender = data.value("gender", "");
            const char* genderParam = gender.empty() ? nullptr : gender.c_str();
            std::string preference = data["preference"];

            auto [salt_hex, hash_hex] = hash_password(password);

            const char* insertSQL = R"(
                INSERT INTO users (name, email, nickname, sex, birthday, password_salt, password_hash, gender, preference)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            )";

            const char* params[9] = {
                    name.c_str(),
                    email.c_str(),
                    nickname.c_str(),
                    sex.c_str(),
                    birthday.c_str(),
                    salt_hex.c_str(),
                    hash_hex.c_str(),
                    genderParam,
                    preference.c_str(),
            };

            PGresult* result = PQexecParams(conn, insertSQL, 9, nullptr, params, nullptr, nullptr, 0);

            if (PQresultStatus(result) != PGRES_COMMAND_OK) {
                res.status = 500;
                res.set_content("DB error: " + std::string(PQerrorMessage(conn)), "text/plain");
                PQclear(result);
                return;
            }

            PQclear(result);
            res.set_content("Registered", "text/plain");

        } catch (const std::exception& e) {
            res.status = 400;
            res.set_content("JSON error: " + std::string(e.what()), "text/plain");
        }
    });

    // === /login ===
    svr.Post("/login", [conn](const Request& req, Response& res) {
        try {
            json data = json::parse(req.body);

            std::string email = data["email"];
            std::string password = data["password"];

            const char* query = "SELECT password_salt, password_hash FROM users WHERE email = $1";
            const char* params[1] = { email.c_str() };

            PGresult* result = PQexecParams(conn, query, 1, nullptr, params, nullptr, nullptr, 0);

            if (PQresultStatus(result) != PGRES_TUPLES_OK || PQntuples(result) == 0) {
                res.status = 401;
                res.set_content("Invalid email or password", "text/plain");
                PQclear(result);
                return;
            }

            std::string salt_hex = PQgetvalue(result, 0, 0);
            std::string hash_hex = PQgetvalue(result, 0, 1);
            PQclear(result);

            if (!verify_password(password, salt_hex, hash_hex)) {
                res.status = 401;
                res.set_content("Invalid email or password", "text/plain");
                return;
            }

            res.set_content("Login successful", "text/plain");

        } catch (const std::exception& e) {
            res.status = 400;
            res.set_content("JSON error: " + std::string(e.what()), "text/plain");
        }
    });

    std::cout << "🔐 Server with PBKDF2 running at http://localhost:8080\n";
    svr.listen("0.0.0.0", 8080);

    PQfinish(conn);
    return 0;
}
