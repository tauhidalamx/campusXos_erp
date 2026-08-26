#include "ChainModule.hpp"
#include "ApiClient.hpp"
#include <QVBoxLayout>
#include <QHBoxLayout>
#include <QPushButton>
#include <QHeaderView>

ChainModule::ChainModule(QWidget* parent) : QWidget(parent) {
    setupUi();
}

void ChainModule::setupUi() {
    QVBoxLayout* mainLayout = new QVBoxLayout(this);
    mainLayout->setContentsMargins(0, 0, 0, 0);
    mainLayout->setSpacing(12);
    
    QLabel* title = new QLabel("🔗 CampusX Chain Notary & Block Explorer", this);
    title->setStyleSheet("font-size: 14px; font-weight: bold;");
    mainLayout->addWidget(title);
    
    // Integrity check card
    QFrame* checkCard = new QFrame(this);
    checkCard->setObjectName("card");
    checkCard->setFixedHeight(120);
    QVBoxLayout* checkLayout = new QVBoxLayout(checkCard);
    checkLayout->setContentsMargins(12, 12, 12, 12);
    
    QLabel* checkTitle = new QLabel("VERIFY DEGREE TRANSCRIPT SHA-256 HASH INTEGRITY:", checkCard);
    checkTitle->setObjectName("muted");
    checkTitle->setStyleSheet("font-size: 10px; font-weight: bold;");
    checkLayout->addWidget(checkTitle);
    
    QHBoxLayout* searchRow = new QHBoxLayout();
    m_hashInput = new QLineEdit(checkCard);
    m_hashInput->setPlaceholderText("Paste hash (e.g. 0x9f3c2c1a8b9412fdbce7a81204d8...)");
    searchRow->addWidget(m_hashInput, 1);
    
    QPushButton* checkBtn = new QPushButton("Verify SBT Notary", checkCard);
    checkBtn->setStyleSheet("background-color: #6366F1;");
    connect(checkBtn, &QPushButton::clicked, this, &ChainModule::executeVerification);
    searchRow->addWidget(checkBtn);
    checkLayout->addLayout(searchRow);
    
    m_resultLabel = new QLabel("Enter hash above and submit to verify signatures.", checkCard);
    m_resultLabel->setStyleSheet("font-size: 11px; font-weight: bold;");
    checkLayout->addWidget(m_resultLabel);
    
    mainLayout->addWidget(checkCard);
    
    // Transactions block list
    QLabel* listTitle = new QLabel("⛓️ Live Anchor Block Transactions History", this);
    listTitle->setStyleSheet("font-size: 12px; font-weight: bold;");
    mainLayout->addWidget(listTitle);
    
    m_txTable = new QTableWidget(this);
    m_txTable->setColumnCount(3);
    m_txTable->setHorizontalHeaderLabels({"Tx Signature Hash", "Contract Action Description", "Validation Status"});
    m_txTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    
    m_txTable->insertRow(0);
    m_txTable->setItem(0, 0, new QTableWidgetItem("0x9f3c...14da"));
    m_txTable->setItem(0, 1, new QTableWidgetItem("SBT Degree Mint [STU006 PATEL]"));
    m_txTable->setItem(0, 2, new QTableWidgetItem("SUCCESS"));
    
    m_txTable->insertRow(1);
    m_txTable->setItem(1, 0, new QTableWidgetItem("0x82b5...904b"));
    m_txTable->setItem(1, 1, new QTableWidgetItem("Research IP Anchorage [DEAN EVELYN]"));
    m_txTable->setItem(1, 2, new QTableWidgetItem("SUCCESS"));
    
    mainLayout->addWidget(m_txTable, 1);
}

void ChainModule::executeVerification() {
    QString hash = m_hashInput->text().trimmed();
    if (hash.isEmpty()) return;
    
    m_resultLabel->setText("Querying smart contract verification registers...");
    m_resultLabel->setStyleSheet("color: #6366F1;");
    
    QJsonObject payload;
    payload["hash"] = hash;
    
    ApiClient::instance().fetchPost("/chain/verify", payload, [this](bool success, const QJsonObject& res) {
        if (success && res.value("verified").toBool()) {
            m_resultLabel->setStyleSheet("color: #10B981;");
            m_resultLabel->setText("✓ SUCCESS: SBT Degree Transcript signature is valid. Notarized at Block #" + 
                                  QString::number(res.value("block").toInt()));
        } else {
            m_resultLabel->setStyleSheet("color: #EF4444;");
            m_resultLabel->setText("✕ FAILED: Signature is invalid or has been modified. No ledger match found.");
        }
    });
}
