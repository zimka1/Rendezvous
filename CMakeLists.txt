cmake_minimum_required(VERSION 3.10)
project(MTAA)

set(CMAKE_CXX_STANDARD 17)

find_package(PostgreSQL REQUIRED)
include_directories(/opt/homebrew/include /opt/homebrew/opt/libpq/include)
link_directories(/opt/homebrew/lib /opt/homebrew/opt/libpq/lib)

include_directories(${PQXX_INCLUDE_DIRS})
link_directories(${PQXX_LIBRARY_DIRS})

add_executable(MTAA main.cpp)
target_link_libraries(MTAA pq)

