cmake_minimum_required(VERSION 3.10)
project(MTAA)

set(CMAKE_CXX_STANDARD 17)

# PostgreSQL
find_package(PostgreSQL REQUIRED)
include_directories(/opt/homebrew/include /opt/homebrew/opt/libpq/include)
link_directories(/opt/homebrew/lib /opt/homebrew/opt/libpq/lib)

# OpenSSL
set(OPENSSL_ROOT_DIR /opt/homebrew/opt/openssl@3)
find_package(OpenSSL REQUIRED)

include_directories(${OPENSSL_INCLUDE_DIR})
link_directories(${OPENSSL_LIBRARIES})

add_executable(MTAA main.cpp)

target_link_libraries(MTAA
        pq
        OpenSSL::SSL
        OpenSSL::Crypto
)
