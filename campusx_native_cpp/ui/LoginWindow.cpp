#include "LoginWindow.hpp"
#include "ApiClient.hpp"
#include "DashboardWindow.hpp"
#include "ThemeManager.hpp"
#include <QVBoxLayout>
#include <QHBoxLayout>
#include <QJsonObject>
#include <QJsonDocument>
#include <QApplication>

LoginWindow::LoginWindow(QWidget* parent) : QWidget(parent) {
    setupUi();
}

void LoginWindow::setupUi() {
    setWindowTitle("CAMPUSX OS - Native Security Portal");
    resize(400, 500);
    
    QVBoxLayout* mainLayout = new QVBoxLayout(this);
    mainLayout->setContentsMargins(40, 40, 40, 40);
    mainLayout->setSpacing(15);
    
    // Header Logo Mock
    QLabel* logoLabel = new QLabel("🛡️ CAMPUSX OS", this);
    logoLabel->setStyleSheet("font-size: 24px; font-weight: bold; color: #6366F1;");
    logoLabel->setAlignment(Qt::AlignCenter);
    mainLayout->addWidget(logoLabel);
    
    QLabel* subtitle = new QLabel("Enterprise Native Platform Client", this);
    subtitle->setObjectName("muted");
    subtitle->setAlignment(Qt::AlignCenter);
    mainLayout->addWidget(subtitle);
    
    mainLayout->addSpacing(20);
    
    // Credentials fields
    m_emailInput = new QLineEdit(this);
    m_emailInput->setPlaceholderText("Email Address (admin@campusx.edu)");
    mainLayout->addWidget(m_emailInput);
    
    m_passwordInput = new QLineEdit(this);
    m_passwordInput->setPlaceholderText("Account Password");
    m_passwordInput->setEchoMode(QLineEdit::Password);
    mainLayout->addWidget(m_passwordInput);
    
    // Status text
    m_statusLabel = new QLabel("", this);
    m_statusLabel->setStyleSheet("color: #EF4444; font-size: 11px;");
    m_statusLabel->setAlignment(Qt::AlignCenter);
    mainLayout->addWidget(m_statusLabel);
    
    // Login button
    m_loginButton = new QPushButton("Verify Credentials", this);
    connect(m_loginButton, &QPushButton::clicked, this, &LoginWindow::handleLogin);
    mainLayout->addWidget(m_loginButton);
    
    mainLayout->addSpacing(15);
    
    // Biometric Shortcuts
    QLabel* bioLabel = new QLabel("OR ACCESS WITH SIMULATED BIOMETRICS:", this);
    bioLabel->setObjectName("muted");
    bioLabel->setStyleSheet("font-size: 10px; font-weight: bold;");
    bioLabel->setAlignment(Qt::AlignCenter);
    mainLayout->addWidget(bioLabel);
    
    QHBoxLayout* bioLayout = new QHBoxLayout();
    QPushButton* fingerprintBtn = new QPushButton("🧬 Fingerprint", this);
    fingerprintBtn->setStyleSheet("background-color: #1E293B; border: 1px solid #334155;");
    connect(fingerprintBtn, &QPushButton::clicked, this, [this]() {
        m_statusLabel->setText("Simulating Fingerprint authentication...");
        m_statusLabel->setStyleSheet("color: #10B981;");
        fillCredentials("admin@campusx.edu", "admin123");
        handleLogin();
    });
    
    QPushButton* faceBtn = new QPushButton("📷 Face ID", this);
    faceBtn->setStyleSheet("background-color: #1E293B; border: 1px solid #334155;");
    connect(faceBtn, &QPushButton::clicked, this, [this]() {
        m_statusLabel->setText("Simulating Facial signature recognition...");
        m_statusLabel->setStyleSheet("color: #10B981;");
        fillCredentials("student@campusx.edu", "student123");
        handleLogin();
    });
    
    bioLayout->addWidget(fingerprintBtn);
    bioLayout->addWidget(faceBtn);
    mainLayout->addLayout(bioLayout);
}

void LoginWindow::fillCredentials(const QString& email, const QString& password) {
    m_emailInput->setText(email);
    m_passwordInput->setText(password);
}

void LoginWindow::handleLogin() {
    QString email = m_emailInput->text().trimmed();
    QString password = m_passwordInput->text();
    
    if (email.isEmpty() || password.isEmpty()) {
        m_statusLabel->setStyleSheet("color: #EF4444;");
        m_statusLabel->setText("Please enter both email and password.");
        return;
    }
    
    m_loginButton->setEnabled(false);
    m_loginButton->setText("Authenticating security keys...");
    
    QJsonObject payload;
    payload["email"] = email;
    payload["password"] = password;
    
    ApiClient::instance().fetchPost("/auth/login", payload, [this](bool success, const QJsonObject& response) {
        m_loginButton->setEnabled(true);
        m_loginButton->setText("Verify Credentials");
        
        if (success && response.value("success").toBool()) {
            // Store Auth token locally
            QString token = response.value("token").toString();
            ApiClient::instance().setToken(token);
            
            // Redirect to Dashboard Window
            DashboardWindow* dash = new DashboardWindow();
            dash->show();
            
            // Close login portal
            this->close();
        } else {
            m_statusLabel->setStyleSheet("color: #EF4444;");
            m_statusLabel->setText("Authentication failed. Invalid password.");
        }
    });
}
