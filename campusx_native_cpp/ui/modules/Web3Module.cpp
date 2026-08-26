#include "Web3Module.hpp"
#include <QVBoxLayout>
#include <QHBoxLayout>
#include <QLabel>
#include <QHeaderView>

Web3Module::Web3Module(QWidget* parent) : QWidget(parent) {
    setupUi();
    loadCredentials();
}

void Web3Module::setupUi() {
    QVBoxLayout* mainLayout = new QVBoxLayout(this);
    mainLayout->setContentsMargins(0, 0, 0, 0);
    mainLayout->setSpacing(10);

    QLabel* title = new QLabel("🔗 Decentralized Academic Ledger & Web3 Credentials", this);
    title->setStyleSheet("font-size: 14px; font-weight: bold;");
    mainLayout->addWidget(title);

    // SBT Minting Form
    QFrame* formCard = new QFrame(this);
    formCard->setObjectName("card");
    QHBoxLayout* formLayout = new QHBoxLayout(formCard);
    formLayout->setContentsMargins(10, 10, 10, 10);
    formLayout->setSpacing(8);

    m_recipientInput = new QLineEdit(this);
    m_recipientInput->setPlaceholderText("Recipient Wallet address (0x...)...");
    m_degreeInput = new QLineEdit(this);
    m_degreeInput->setPlaceholderText("Degree Certificate Name...");
    m_mintBtn = new QPushButton("🔗 Mint SBT Credential", this);
    connect(m_mintBtn, &QPushButton::clicked, this, &Web3Module::mintCredential);

    formLayout->addWidget(m_recipientInput, 2);
    formLayout->addWidget(m_degreeInput, 2);
    formLayout->addWidget(m_mintBtn);
    mainLayout->addWidget(formCard);

    // SBT table
    m_sbtTable = new QTableWidget(this);
    m_sbtTable->setColumnCount(4);
    m_sbtTable->setHorizontalHeaderLabels({"Token ID", "Recipient Address", "Degree Cert Name", "Blockchain Transaction Hash"});
    m_sbtTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    mainLayout->addWidget(m_sbtTable, 1);
}

void Web3Module::loadCredentials() {
    m_sbtTable->setRowCount(2);
    m_sbtTable->setItem(0, 0, new QTableWidgetItem("SBT-001"));
    m_sbtTable->setItem(0, 1, new QTableWidgetItem("0x71C7656EC7ab88b098defB751B7401B5f6d8976F"));
    m_sbtTable->setItem(0, 2, new QTableWidgetItem("M.S. Computer Science"));
    m_sbtTable->setItem(0, 3, new QTableWidgetItem("0xab3f...82e9"));

    m_sbtTable->setItem(1, 0, new QTableWidgetItem("SBT-002"));
    m_sbtTable->setItem(1, 1, new QTableWidgetItem("0x2810c23aF3efD3D927E2e5F14ABc385ac0C148da"));
    m_sbtTable->setItem(1, 2, new QTableWidgetItem("B.Tech Cybersecurity"));
    m_sbtTable->setItem(1, 3, new QTableWidgetItem("0x82c5...ca44"));
}

void Web3Module::mintCredential() {
    QString recipientText = m_recipientInput->text().trimmed();
    QString degreeText = m_degreeInput->text().trimmed();
    if (recipientText.isEmpty() || degreeText.isEmpty()) return;

    int row = m_sbtTable->rowCount();
    m_sbtTable->insertRow(row);
    m_sbtTable->setItem(row, 0, new QTableWidgetItem("SBT-" + QString::number(100 + row * 2)));
    m_sbtTable->setItem(row, 1, new QTableWidgetItem(recipientText));
    m_sbtTable->setItem(row, 2, new QTableWidgetItem(degreeText));
    m_sbtTable->setItem(row, 3, new QTableWidgetItem("0x" + QString::number(qHash(degreeText), 16) + "...mint"));

    m_recipientInput->clear();
    m_degreeInput->clear();
}
