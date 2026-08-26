#include "AiModule.hpp"
#include "ApiClient.hpp"
#include <QVBoxLayout>
#include <QHBoxLayout>

AiModule::AiModule(QWidget* parent) : QWidget(parent) {
    setupUi();
}

void AiModule::setupUi() {
    QVBoxLayout* mainLayout = new QVBoxLayout(this);
    mainLayout->setContentsMargins(0, 0, 0, 0);
    mainLayout->setSpacing(8);
    
    m_chatHistory = new QListWidget(this);
    m_chatHistory->setStyleSheet("background-color: transparent; border: none; font-size: 11px;");
    m_chatHistory->addItem("🤖 AI: Greetings Evelyn. How can I assist you with your campus ERP administration tasks today?");
    mainLayout->addWidget(m_chatHistory, 1);
    
    QHBoxLayout* inputRow = new QHBoxLayout();
    m_chatInput = new QLineEdit(this);
    m_chatInput->setPlaceholderText("Ask AI Copilot...");
    connect(m_chatInput, &QLineEdit::returnPressed, this, &AiModule::submitMessage);
    inputRow->addWidget(m_chatInput, 1);
    
    m_sendBtn = new QPushButton("Send", this);
    m_sendBtn->setStyleSheet("background-color: #6366F1;");
    connect(m_sendBtn, &QPushButton::clicked, this, &AiModule::submitMessage);
    inputRow->addWidget(m_sendBtn);
    
    mainLayout->addLayout(inputRow);
}

void AiModule::submitMessage() {
    QString msg = m_chatInput->text().trimmed();
    if (msg.isEmpty()) return;
    
    m_chatInput->clear();
    m_chatHistory->addItem("👤 You: " + msg);
    
    QJsonObject payload;
    payload["message"] = msg;
    
    ApiClient::instance().fetchPost("/ai/chat", payload, [this](bool success, const QJsonObject& res) {
        if (success) {
            m_chatHistory->addItem("🤖 AI: " + res.value("reply").toString());
        } else {
            m_chatHistory->addItem("🤖 AI: Connection timeout. Fallback offline response. Ask about admissions or threat statuses.");
        }
    });
}
