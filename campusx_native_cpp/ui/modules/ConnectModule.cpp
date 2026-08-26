#include "ConnectModule.hpp"
#include "ApiClient.hpp"
#include <QVBoxLayout>
#include <QHBoxLayout>
#include <QTabWidget>
#include <QLabel>
#include <QHeaderView>
#include <QJsonArray>
#include <QJsonObject>
#include <QDateTime>

ConnectModule::ConnectModule(QWidget* parent) : QWidget(parent) {
    setupUi();
    loadPosts();
}

void ConnectModule::setupUi() {
    QVBoxLayout* mainLayout = new QVBoxLayout(this);
    mainLayout->setContentsMargins(0, 0, 0, 0);
    
    QTabWidget* tabWidget = new QTabWidget(this);
    
    // ==========================================
    // --- TAB 1: DISCUSSION FORUMS ---
    // ==========================================
    QWidget* forumTab = new QWidget(this);
    QVBoxLayout* forumLayout = new QVBoxLayout(forumTab);
    forumLayout->setContentsMargins(10, 10, 10, 10);
    forumLayout->setSpacing(10);
    
    QLabel* fTitle = new QLabel("💬 Connect Forum Discussions & Stories", forumTab);
    fTitle->setStyleSheet("font-size: 14px; font-weight: bold;");
    forumLayout->addWidget(fTitle);
    
    m_postsTable = new QTableWidget(forumTab);
    m_postsTable->setColumnCount(3);
    m_postsTable->setHorizontalHeaderLabels({"Author", "Topic Category", "Post Message Content"});
    m_postsTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    forumLayout->addWidget(m_postsTable, 1);
    
    QHBoxLayout* inputLayout = new QHBoxLayout();
    m_postInput = new QLineEdit(forumTab);
    m_postInput->setPlaceholderText("Share updates or announcements on the campus newsfeed...");
    inputLayout->addWidget(m_postInput, 1);
    
    m_submitBtn = new QPushButton("Publish Thread", forumTab);
    m_submitBtn->setStyleSheet("background-color: #6366F1;");
    connect(m_submitBtn, &QPushButton::clicked, this, &ConnectModule::submitNewPost);
    inputLayout->addWidget(m_submitBtn);
    forumLayout->addLayout(inputLayout);
    
    tabWidget->addTab(forumTab, "Discussion Forums");
    
    // ==========================================
    // --- TAB 2: WORKSPACE CHATS ---
    // ==========================================
    QWidget* chatTab = new QWidget(this);
    QHBoxLayout* chatLayout = new QHBoxLayout(chatTab);
    chatLayout->setContentsMargins(10, 10, 10, 10);
    chatLayout->setSpacing(10);
    
    // Channels list on the left
    QVBoxLayout* leftPanel = new QVBoxLayout();
    QLabel* chanLabel = new QLabel("Channels", chatTab);
    chanLabel->setStyleSheet("font-weight: bold;");
    leftPanel->addWidget(chanLabel);
    
    m_channelsList = new QListWidget(chatTab);
    m_channelsList->addItem("# general");
    m_channelsList->addItem("# announcements");
    m_channelsList->addItem("# admissions");
    m_channelsList->addItem("# sports-analytics");
    m_channelsList->setCurrentRow(0);
    m_channelsList->setMaximumWidth(150);
    connect(m_channelsList, &QListWidget::currentRowChanged, this, &ConnectModule::switchChatChannel);
    leftPanel->addWidget(m_channelsList);
    chatLayout->addLayout(leftPanel);
    
    // Chat display on the right
    QVBoxLayout* rightPanel = new QVBoxLayout();
    QLabel* chatTitle = new QLabel("💬 Workspace Chat Terminal", chatTab);
    chatTitle->setStyleSheet("font-weight: bold;");
    rightPanel->addWidget(chatTitle);
    
    m_chatTerminal = new QTextEdit(chatTab);
    m_chatTerminal->setReadOnly(true);
    m_chatTerminal->setStyleSheet("background-color: #071126; color: #E2E8F0; font-family: Courier;");
    m_chatTerminal->append("[SYSTEM] Joined #general channel.");
    m_chatTerminal->append("[Dean Sterling] Welcome to the CAMPUSX OS workspace.");
    rightPanel->addWidget(m_chatTerminal, 1);
    
    QHBoxLayout* sendRow = new QHBoxLayout();
    m_chatInput = new QLineEdit(chatTab);
    m_chatInput->setPlaceholderText("Type message here...");
    connect(m_chatInput, &QLineEdit::returnPressed, this, &ConnectModule::sendChatMessage);
    sendRow->addWidget(m_chatInput, 1);
    
    m_sendChatBtn = new QPushButton("Send", chatTab);
    m_sendChatBtn->setStyleSheet("background-color: #10B981;");
    connect(m_sendChatBtn, &QPushButton::clicked, this, &ConnectModule::sendChatMessage);
    sendRow->addWidget(m_sendChatBtn);
    rightPanel->addLayout(sendRow);
    
    chatLayout->addLayout(rightPanel, 1);
    
    tabWidget->addTab(chatTab, "Workspace Chats");
    
    mainLayout->addWidget(tabWidget);
}

void ConnectModule::loadPosts() {
    ApiClient::instance().fetchGet("/posts", [this](bool success, const QJsonObject& response) {
        if (!success) {
            m_postsTable->setRowCount(3);
            m_postsTable->setItem(0, 0, new QTableWidgetItem("Dean Evelyn Sterling"));
            m_postsTable->setItem(0, 1, new QTableWidgetItem("Academic Registry"));
            m_postsTable->setItem(0, 2, new QTableWidgetItem("All outstanding student degree credentials have been anchored to the local verification ledger."));
            
            m_postsTable->setItem(1, 0, new QTableWidgetItem("Prof. Marcus Chen"));
            m_postsTable->setItem(1, 1, new QTableWidgetItem("Research Symposium"));
            m_postsTable->setItem(1, 2, new QTableWidgetItem("Inviting all students to the upcoming Private AI Gateway architecture discussion. Check library assets for reading materials."));
            
            m_postsTable->setItem(2, 0, new QTableWidgetItem("System Operations Admin"));
            m_postsTable->setItem(2, 1, new QTableWidgetItem("Maintenance"));
            m_postsTable->setItem(2, 2, new QTableWidgetItem("Successfully rolled out light theme update across ERP components. Telemetry reports normal load."));
            return;
        }
        
        QJsonArray arr = response.value("posts").toArray();
        m_postsTable->setRowCount(arr.size());
        for (int i = 0; i < arr.size(); ++i) {
            QJsonObject p = arr.at(i).toObject();
            m_postsTable->setItem(i, 0, new QTableWidgetItem(p.value("user_name").toString("Anonymous")));
            m_postsTable->setItem(i, 1, new QTableWidgetItem(p.value("category").toString("General")));
            m_postsTable->setItem(i, 2, new QTableWidgetItem(p.value("content").toString()));
        }
    });
}

void ConnectModule::submitNewPost() {
    QString text = m_postInput->text().trimmed();
    if (text.isEmpty()) return;
    m_postInput->clear();
    
    QJsonObject payload;
    payload["content"] = text;
    payload["category"] = "General";
    payload["user_name"] = "Dr. Evelyn Sterling";
    
    ApiClient::instance().fetchPost("/posts", payload, [this](bool success, const QJsonObject& res) {
        loadPosts();
    });
}

void ConnectModule::switchChatChannel(int row) {
    if (!m_channelsList->currentItem()) return;
    QString channel = m_channelsList->currentItem()->text();
    m_chatTerminal->clear();
    m_chatTerminal->append(QString("[SYSTEM] Switched to %1 channel.").arg(channel));
    
    if (channel == "# general") {
        m_chatTerminal->append("[Dean Sterling] Welcome to the CAMPUSX OS workspace.");
    } else if (channel == "# announcements") {
        m_chatTerminal->append("[Registrar] Classes are scheduled normally today. Midterm grades will be approved by Dean on Friday.");
    } else if (channel == "# admissions") {
        m_chatTerminal->append("[Admissions Desk] Reviewing prospective scholar rosters.");
    } else if (channel == "# sports-analytics") {
        m_chatTerminal->append("[CV Broker] Computer vision tracking session is running on pitch A.");
    }
}

void ConnectModule::sendChatMessage() {
    QString text = m_chatInput->text().trimmed();
    if (text.isEmpty()) return;
    m_chatInput->clear();
    
    QString timestamp = QDateTime::currentDateTime().toString("hh:mm:ss");
    m_chatTerminal->append(QString("[%1] [You] %2").arg(timestamp).arg(text));
}
