#include "ResearchModule.hpp"
#include "ApiClient.hpp"
#include <QVBoxLayout>
#include <QHBoxLayout>
#include <QLabel>
#include <QHeaderView>
#include <QJsonObject>
#include <QJsonArray>

ResearchModule::ResearchModule(QWidget* parent) : QWidget(parent) {
    setupUi();
    loadResearchGrants();
}

void ResearchModule::setupUi() {
    QVBoxLayout* mainLayout = new QVBoxLayout(this);
    mainLayout->setContentsMargins(0, 0, 0, 0);
    mainLayout->setSpacing(10);

    QLabel* title = new QLabel("🔬 Research Grants & Scientific Publications", this);
    title->setStyleSheet("font-size: 14px; font-weight: bold;");
    mainLayout->addWidget(title);

    // Form card
    QFrame* formCard = new QFrame(this);
    formCard->setObjectName("card");
    QHBoxLayout* formLayout = new QHBoxLayout(formCard);
    formLayout->setContentsMargins(10, 10, 10, 10);
    formLayout->setSpacing(8);

    m_titleInput = new QLineEdit(this);
    m_titleInput->setPlaceholderText("Grant Proposal Title...");
    m_budgetInput = new QLineEdit(this);
    m_budgetInput->setPlaceholderText("Budget requested ($)...");
    m_submitBtn = new QPushButton("🚀 Submit Grant", this);
    connect(m_submitBtn, &QPushButton::clicked, this, &ResearchModule::submitProposal);

    formLayout->addWidget(m_titleInput, 2);
    formLayout->addWidget(m_budgetInput, 1);
    formLayout->addWidget(m_submitBtn);
    mainLayout->addWidget(formCard);

    // Data table
    m_grantsTable = new QTableWidget(this);
    m_grantsTable->setColumnCount(4);
    m_grantsTable->setHorizontalHeaderLabels({"Proposal ID", "Grant Title", "Budget Requested", "Status"});
    m_grantsTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    mainLayout->addWidget(m_grantsTable, 1);
}

void ResearchModule::loadResearchGrants() {
    // Populate mock research grant rows dynamically
    m_grantsTable->setRowCount(3);
    m_grantsTable->setItem(0, 0, new QTableWidgetItem("GR-928"));
    m_grantsTable->setItem(0, 1, new QTableWidgetItem("Quantum Cryptography Secure Communication Protocol"));
    m_grantsTable->setItem(0, 2, new QTableWidgetItem("$120,000"));
    m_grantsTable->setItem(0, 3, new QTableWidgetItem("UNDER REVIEW"));

    m_grantsTable->setItem(1, 0, new QTableWidgetItem("GR-541"));
    m_grantsTable->setItem(1, 1, new QTableWidgetItem("Federated Learning Decentralized Model Training"));
    m_grantsTable->setItem(1, 2, new QTableWidgetItem("$85,000"));
    m_grantsTable->setItem(1, 3, new QTableWidgetItem("APPROVED"));

    m_grantsTable->setItem(2, 0, new QTableWidgetItem("GR-302"));
    m_grantsTable->setItem(2, 1, new QTableWidgetItem("ZKP Attendance Proofs in Smart Campus Gateways"));
    m_grantsTable->setItem(2, 2, new QTableWidgetItem("$45,000"));
    m_grantsTable->setItem(2, 3, new QTableWidgetItem("REJECTED"));
}

void ResearchModule::submitProposal() {
    QString titleText = m_titleInput->text().trimmed();
    QString budgetText = m_budgetInput->text().trimmed();
    if (titleText.isEmpty() || budgetText.isEmpty()) return;

    int newRow = m_grantsTable->rowCount();
    m_grantsTable->insertRow(newRow);
    m_grantsTable->setItem(newRow, 0, new QTableWidgetItem("GR-" + QString::number(100 + newRow * 7)));
    m_grantsTable->setItem(newRow, 1, new QTableWidgetItem(titleText));
    m_grantsTable->setItem(newRow, 2, new QTableWidgetItem("$" + budgetText));
    m_grantsTable->setItem(newRow, 3, new QTableWidgetItem("PENDING"));

    m_titleInput->clear();
    m_budgetInput->clear();
}
