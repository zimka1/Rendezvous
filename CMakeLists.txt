cmake_minimum_required(VERSION 3.10)
project(MTAA)

set(CMAKE_CXX_STANDARD 17)

set(CMAKE_TOOLCHAIN_FILE "$ENV{HOME}/vcpkg/scripts/buildsystems/vcpkg.cmake")
include_directories("$ENV{HOME}/vcpkg/installed/arm64-osx/include")
link_directories("$ENV{HOME}/vcpkg/installed/arm64-osx/lib")

find_package(PostgreSQL REQUIRED)

set(OPENSSL_ROOT_DIR /opt/homebrew/opt/openssl@3)
find_package(OpenSSL REQUIRED)

include_directories(${OPENSSL_INCLUDE_DIR})
link_directories(${OPENSSL_LIBRARIES})

# Добавьте исполняемый файл
add_executable(MTAA
        server_messenger/src/main.cpp
        server_messenger/src/globals.cpp
        server_messenger/src/database.cpp
        server_messenger/src/websocket.cpp
        server_messenger/src/message.cpp
)

# Свяжите с libpq (PostgreSQL)
target_link_libraries(MTAA PRIVATE PostgreSQL::PostgreSQL uv z usockets OpenSSL::SSL
        OpenSSL::Crypto)