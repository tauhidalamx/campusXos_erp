#include <QApplication>
#include "CampusXCore.hpp"
#include "LoginWindow.hpp"

int main(int argc, char *argv[]) {
    // 1. Initialize Qt GUI application
    QApplication app(argc, argv);
    app.setApplicationName("CampusXOS Client");
    app.setApplicationVersion("1.0.0");
    
    // 2. Initialize Native Core systems
    CampusXCore::instance().initialize();
    
    // 3. Launch Login Screen Window
    LoginWindow* login = new LoginWindow();
    login->show();
    
    // 4. Start Event execution loop
    return app.exec();
}
