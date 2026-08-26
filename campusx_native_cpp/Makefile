# =====================================================================
# CAMPUSX OS C++ Client Makefile - Native Compiler Build System Override
# =====================================================================

CXX = clang++
CXXFLAGS = -std=c++20 -Wall -Wextra -fPIC

# Include directories
INCLUDES = -Icore -Ithemes -Ianimations -Iui -Iui/modules

# Auto-detect Qt6 installation directory
QT_PATHS = /opt/homebrew/opt/qt /usr/local/opt/qt /usr/include/qt6 /usr/lib/qt6
QT_DIR = $(firstword $(wildcard $(QT_PATHS)))

ifeq ($(QT_DIR),)
    # Fallback to standard system compile flags if QT_DIR cannot be found
    QT_INCLUDES = 
    QT_LIBS = -lQt6Widgets -lQt6Gui -lQt6Core -lQt6Network -lQt6Sql -lQt6WebSockets
else
    QT_INCLUDES = -I$(QT_DIR)/include -I$(QT_DIR)/include/QtWidgets -I$(QT_DIR)/include/QtGui -I$(QT_DIR)/include/QtCore -I$(QT_DIR)/include/QtNetwork -I$(QT_DIR)/include/QtSql -I$(QT_DIR)/include/QtWebSockets
    QT_LIBS = -L$(QT_DIR)/lib -lQt6Widgets -lQt6Gui -lQt6Core -lQt6Network -lQt6Sql -lQt6WebSockets
endif

# Source files
SRCS = main.cpp \
       core/CampusXCore.cpp \
       core/ApiClient.cpp \
       themes/ThemeEngine.cpp \
       animations/AnimationEngine.cpp \
       ui/LoginWindow.cpp \
       ui/DashboardWindow.cpp \
       ui/SettingsPanel.cpp \
       ui/modules/ErpModule.cpp \
       ui/modules/SportsModule.cpp \
       ui/modules/MarketModule.cpp \
       ui/modules/ConnectModule.cpp \
       ui/modules/ChainModule.cpp \
       ui/modules/AiModule.cpp \
       ui/modules/SocModule.cpp

OBJS = $(SRCS:.cpp=.o)
TARGET = CampusXOS

all: $(TARGET)

$(TARGET): $(OBJS)
	@echo "Linking binary target $(TARGET)..."
	$(CXX) $(OBJS) -o $(TARGET) $(QT_LIBS)

%.o: %.cpp
	@echo "Compiling $<..."
	$(CXX) $(CXXFLAGS) $(INCLUDES) $(QT_INCLUDES) -c $< -o $@

clean:
	@echo "Cleaning compiled objects..."
	rm -f $(OBJS) $(TARGET)

.PHONY: all clean
