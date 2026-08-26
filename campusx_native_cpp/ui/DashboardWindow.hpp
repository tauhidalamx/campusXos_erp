#ifndef DASHBOARDWINDOW_HPP
#define DASHBOARDWINDOW_HPP

#include <QMainWindow>
#include <QStackedWidget>
#include <QLineEdit>
#include <QPushButton>
#include <QFrame>

class DashboardWindow : public QMainWindow {
    Q_OBJECT
public:
    explicit DashboardWindow(QWidget* parent = nullptr);
    ~DashboardWindow() = default;

private slots:
    void switchWorkspace(const QString& modKey);
    void toggleAiPanel();
    void handleGlobalSearch();

private:
    void setupUi();
    void updateThemeStyles();
    
    QStackedWidget* m_stackWidget;
    QFrame* m_sidebar;
    QFrame* m_aiPanel;
    QLineEdit* m_searchInput;
    QPushButton* m_aiToggleBtn;
    
    bool m_aiVisible;
    QString m_activeModule;
};

#endif // DASHBOARDWINDOW_HPP
