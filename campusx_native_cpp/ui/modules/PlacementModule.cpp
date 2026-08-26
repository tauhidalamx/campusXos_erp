#include "PlacementModule.hpp"
#include <QVBoxLayout>
#include <QHBoxLayout>
#include <QLabel>
#include <QHeaderView>

PlacementModule::PlacementModule(QWidget* parent) : QWidget(parent) {
    setupUi();
    loadJobs();
}

void PlacementModule::setupUi() {
    QVBoxLayout* mainLayout = new QVBoxLayout(this);
    mainLayout->setContentsMargins(0, 0, 0, 0);
    mainLayout->setSpacing(10);

    QLabel* title = new QLabel("💼 University Career Placement Board", this);
    title->setStyleSheet("font-size: 14px; font-weight: bold;");
    mainLayout->addWidget(title);

    // Apply button row
    QHBoxLayout* toolRow = new QHBoxLayout();
    m_applyBtn = new QPushButton("🚀 Submit Resume / Apply", this);
    connect(m_applyBtn, &QPushButton::clicked, this, &PlacementModule::applySelected);
    toolRow->addWidget(m_applyBtn);
    toolRow->addStretch();
    mainLayout->addLayout(toolRow);

    // Jobs table
    m_jobsTable = new QTableWidget(this);
    m_jobsTable->setColumnCount(4);
    m_jobsTable->setHorizontalHeaderLabels({"Company Name", "Job Title / Role", "Annual CTC Offered", "Application Status"});
    m_jobsTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    m_jobsTable->setSelectionBehavior(QAbstractItemView::SelectRows);
    m_jobsTable->setSelectionMode(QAbstractItemView::SingleSelection);
    mainLayout->addWidget(m_jobsTable, 1);
}

void PlacementModule::loadJobs() {
    m_jobsTable->setRowCount(3);
    m_jobsTable->setItem(0, 0, new QTableWidgetItem("NVIDIA Research"));
    m_jobsTable->setItem(0, 1, new QTableWidgetItem("C++ Graphics / Vulkan Engineer"));
    m_jobsTable->setItem(0, 2, new QTableWidgetItem("$140,000"));
    m_jobsTable->setItem(0, 3, new QTableWidgetItem("ELIGIBLE (Apply now)"));

    m_jobsTable->setItem(1, 0, new QTableWidgetItem("Google DeepMind"));
    m_jobsTable->setItem(1, 1, new QTableWidgetItem("Machine Learning Engineer"));
    m_jobsTable->setItem(1, 2, new QTableWidgetItem("$165,000"));
    m_jobsTable->setItem(1, 3, new QTableWidgetItem("APPLIED (Under Review)"));

    m_jobsTable->setItem(2, 0, new QTableWidgetItem("Ethereum Foundation"));
    m_jobsTable->setItem(2, 1, new QTableWidgetItem("Solidity Smart Contracts Lead"));
    m_jobsTable->setItem(2, 2, new QTableWidgetItem("$150,000"));
    m_jobsTable->setItem(2, 3, new QTableWidgetItem("ELIGIBLE (Apply now)"));
}

void PlacementModule::applySelected() {
    int curRow = m_jobsTable->currentRow();
    if (curRow < 0) return;

    QString status = m_jobsTable->item(curRow, 3)->text();
    if (status.contains("ELIGIBLE")) {
        m_jobsTable->setItem(curRow, 3, new QTableWidgetItem("APPLIED"));
    }
}
