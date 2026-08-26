cmake_minimum_required(VERSION 3.16)
project(CampusXOS LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 23)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Configure Qt6 Autogen options
set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)
set(CMAKE_AUTOUIC ON)

find_package(Qt6 COMPONENTS Widgets Network Sql WebSockets Svg Pdf REQUIRED)

# Enable compiler warnings and processor optimizations
if(MSVC)
    add_compile_options(/W4)
else()
    add_compile_options(-Wall -Wextra -Wpedantic -Wno-unused-parameter)
    if(APPLE AND CMAKE_SYSTEM_PROCESSOR STREQUAL "arm64")
        add_compile_options(-mcpu=apple-m4 -O3)
        message(STATUS "Configuring build with Apple Silicon M4 optimizations (-mcpu=apple-m4 -O3)")
    endif()
endif()

# Header Include paths
include_directories(
    ${CMAKE_CURRENT_SOURCE_DIR}/core
    ${CMAKE_CURRENT_SOURCE_DIR}/themes
    ${CMAKE_CURRENT_SOURCE_DIR}/animations
    ${CMAKE_CURRENT_SOURCE_DIR}/ui
    ${CMAKE_CURRENT_SOURCE_DIR}/ui/modules
)

# Target 1: Core Systems Library
add_library(CampusXCoreLib STATIC
    core/CampusXCore.cpp
    core/ApiClient.cpp
)
target_link_libraries(CampusXCoreLib PRIVATE Qt6::Network Qt6::Sql Qt6::WebSockets)

# Target 2: Custom UI, Theme & Animation Engine Library
add_library(CampusXUiLib STATIC
    themes/ThemeEngine.cpp
    animations/AnimationEngine.cpp
    ui/LoginWindow.cpp
    ui/DashboardWindow.cpp
    ui/SettingsPanel.cpp
    ui/modules/ErpModule.cpp
    ui/modules/SportsModule.cpp
    ui/modules/MarketModule.cpp
    ui/modules/ConnectModule.cpp
    ui/modules/ChainModule.cpp
    ui/modules/AiModule.cpp
    ui/modules/SocModule.cpp
    ui/modules/ResearchModule.cpp
    ui/modules/LibraryModule.cpp
    ui/modules/HostelModule.cpp
    ui/modules/TransportModule.cpp
    ui/modules/HealthModule.cpp
    ui/modules/EventsModule.cpp
    ui/modules/PlacementModule.cpp
    ui/modules/Web3Module.cpp
    ui/modules/AcademicModule.cpp
    ui/modules/FinanceModule.cpp
    ui/modules/AdminModule.cpp
    ui/modules/RoleDashboards.cpp
)
target_link_libraries(CampusXUiLib PRIVATE CampusXCoreLib Qt6::Widgets Qt6::WebSockets Qt6::Sql Qt6::Network Qt6::Svg Qt6::Pdf)

# Target 3: Main Native Launcher Executable
add_executable(CampusXOS MACOSX_BUNDLE main.cpp)
target_link_libraries(CampusXOS PRIVATE CampusXUiLib Qt6::Widgets Qt6::Svg Qt6::Pdf)

# Target 4: Unit Test Executable
add_executable(CampusXTest tests/test_core.cpp)
target_link_libraries(CampusXTest PRIVATE CampusXUiLib Qt6::Widgets)

# Enable CTest integration
enable_testing()
add_test(NAME CampusXUnitTest COMMAND CampusXTest)
