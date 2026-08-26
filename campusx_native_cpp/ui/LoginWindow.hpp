#ifndef LOGINWINDOW_HPP
#define LOGINWINDOW_HPP

#include <QWidget>
#include <QLineEdit>
#include <QLabel>
#include <QPushButton>

class LoginWindow : public QWidget {
    Q_OBJECT
public:
    explicit LoginWindow(QWidget* parent = nullptr);
    ~LoginWindow() = default;

private slots:
    void handleLogin();
    void fillCredentials(const QString& email, const QString& password);

private:
    void setupUi();
    
    QLineEdit* m_emailInput;
    QLineEdit* m_passwordInput;
    QLabel* m_statusLabel;
    QPushButton* m_loginButton;
};

#endif // LOGINWINDOW_HPP
