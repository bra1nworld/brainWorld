cmake_minimum_required(VERSION 3.0)
project(ingredient_backend)


message(STATUS "${CMAKE_JS_INC}")
include_directories(${CMAKE_JS_INC})

find_package(ingredient REQUIRED)
include_directories(${ingredient_INCLUDE_DIRS})

find_package(PCL REQUIRED)
include_directories(${PCL_INCLUDE_DIRS})
link_directories(${PCL_LIBRARY_DIRS})

find_package(OpenCV REQUIRED)
include_directories(${OpenCV_INCLUDE_DIRS})


add_library(ingredient_backend SHARED
    src/ingredient_backend.cpp
    src/dataset_wrap.cpp
    #src/data_holder_wrap.cpp
    src/index_wrap.cpp)
set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")
target_link_libraries(ingredient_backend ${ingredient_LIBRARIES})
