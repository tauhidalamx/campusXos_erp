#include "TransportModule.hpp"
#include <QVBoxLayout>
#include <QHBoxLayout>
#include <QLabel>
#include <QHeaderView>

TransportModule::TransportModule(QWidget* parent) : QWidget(parent) {
    setupUi();
    refreshSchedules();
}

void TransportModule::setupUi() {
    QVBoxLayout* mainLayout = new QVBoxLayout(this);
    mainLayout->setContentsMargins(0, 0, 0, 0);
    mainLayout->setSpacing(10);

    QLabel* title = new QLabel("🚌 Campus Transport Schedules & Bus Tracking", this);
    title->setStyleSheet("font-size: 14px; font-weight: bold;");
    mainLayout->addWidget(title);

    // Refresh row
    QHBoxLayout* toolRow = new QHBoxLayout();
    m_refreshBtn = new QPushButton("🔄 Refresh Bus Locations", this);
    connect(m_refreshBtn, &QPushButton::clicked, this, &TransportModule::refreshSchedules);
    toolRow->addWidget(m_refreshBtn);
    toolRow->addStretch();
    mainLayout->addLayout(toolRow);

    // Routes table
    m_routesTable = new QTableWidget(this);
    m_routesTable->setColumnCount(4);
    m_routesTable->setHorizontalHeaderLabels({"Bus Number / Route", "Departure Station", "Scheduled Time", "Active Location Progress"});
    m_routesTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    mainLayout->addWidget(m_routesTable, 1);
}

void TransportModule::refreshSchedules() {
    m_routesTable->setRowCount(3);
    m_routesTable->setItem(0, 0, new QTableWidgetItem("Route A (North Campus - Main Gate)"));
    m_routesTable->setItem(0, 1, new QTableWidgetItem("Library Terminal"));
    m_routesTable->setItem(0, 2, new QTableWidgetItem("08:15 AM"));
    m_routesTable->setItem(0, 3, new QTableWidgetItem("EN ROUTE (72% Progress)"));

    m_routesTable->setItem(1, 0, new QTableWidgetItem("Route B (South Hostels - Tech Park)"));
    m_routesTable->setItem(1, 1, new QTableWidgetItem("Tagore Block"));
    m_routesTable->setItem(1, 2, new QTableWidgetItem("08:30 AM"));
    m_routesTable->setItem(1, 3, new QTableWidgetItem("STATIONARY (Ready to Depart)"));

    m_routesTable->setItem(2, 0, new QTableWidgetItem("Route C (Metro Station Express Link)"));
    m_routesTable->setItem(2, 1, new QTableWidgetItem("Metro Terminal Gate 2"));
    m_routesTable->setItem(2, 2, new QTableWidgetItem("09:00 AM"));
    m_routesTable->setItem(2, 3, new QTableWidgetItem("ARRIVED at Library Terminal"));
}
