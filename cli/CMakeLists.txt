cmake_minimum_required(VERSION 2.8.3)
project(pointcloud_labeler_cli)

set(CMAKE_CXX_FLAGS "-std=c++11")

find_package(ingredient)
include_directories(${ingredient_INCLUDE_DIRS})

add_executable(temp_pointcloud_extractor temp_pointcloud_extractor.cpp)
target_link_libraries(temp_pointcloud_extractor
    ${ingredient_LIBRARIES})
