#include "httplib.h"
#include "libpq-fe.h"
#include <nlohmann/json.hpp>
#include <iostream>

using json = nlohmann::json;
using namespace httplib;

int main() {
    Server svr;

    const char* conninfo = "dbname=rendezvous user=zimka password=12345 hostaddr=127.0.0.1 port=5432";
    PGconn* conn = PQconnectdb(conninfo);

    if (PQstatus(conn) != CONNECTION_OK) {
        std::cerr << "DB connection failed: " << PQerrorMessage(conn) << std::endl;
        PQfinish(conn);
        return 1;
    }

    const char* insertUserSQL = R"(
        INSERT INTO users (name, email, nickname, sex, birthday, password, gender, preference)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    )";

    svr.Post("/register", [conn, insertUserSQL](const Request& req, Response& res) {
        try {
            json data = json::parse(req.body);

            std::string name     = data["name"];
            std::string email    = data["email"];
            std::string nickname = data["nickname"];
            std::string sex      = data["sex"];
            std::string birthday = data["birthday"];
            std::string password = data["password"];
            std::string gender   = data["gender"];
            std::string preference   = data["preference"];

            const char* params[8] = {
                    name.c_str(),
                    email.c_str(),
                    nickname.c_str(),
                    sex.c_str(),
                    birthday.c_str(),
                    password.c_str(),
                    gender.c_str(),
                    preference.c_str(),
            };

            PGresult* result = PQexecParams(
                    conn,
                    insertUserSQL,
                    8,
                    nullptr,
                    params,
                    nullptr,
                    nullptr,
                    0
            );

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

    svr.Post("/login", [conn](const Request& req, Response& res) {
        try {
            json data = json::parse(req.body);
            std::string email = data["email"];
            std::string password = data["password"];

            std::string query = "SELECT id FROM users WHERE email = $1 AND password = $2";
            const char* params[2] = { email.c_str(), password.c_str() };

            PGresult* result = PQexecParams(
                    conn,
                    query.c_str(),
                    2,
                    nullptr,
                    params,
                    nullptr,
                    nullptr,
                    0
            );

            if (PQresultStatus(result) != PGRES_TUPLES_OK) {
                res.status = 500;
                res.set_content("DB error: " + std::string(PQerrorMessage(conn)), "text/plain");
                PQclear(result);
                return;
            }

            if (PQntuples(result) == 0) {
                res.status = 401;
                res.set_content("Invalid credentials", "text/plain");
            } else {
                res.status = 200;
                res.set_content("Login successful", "text/plain");
            }

            PQclear(result);
        } catch (const std::exception& e) {
            res.status = 400;
            res.set_content("JSON error: " + std::string(e.what()), "text/plain");
        }
    });


    std::cout << "Server running at http://localhost:8080\n";
    svr.listen("0.0.0.0", 8080);

    PQfinish(conn);
    return 0;
}
