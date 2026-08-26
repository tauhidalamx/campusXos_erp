#include "HostelModule.hpp"
#include <QVBoxLayout>
#include <QHBoxLayout>
#include <QLabel>
#include <QHeaderView>

HostelModule::HostelModule(QWidget* parent) : QWidget(parent) {
    setupUi();
    loadAllocations();
}

void HostelModule::setupUi() {
    QVBoxLayout* mainLayout = new QVBoxLayout(this);
    mainLayout->setContentsMargins(0, 0, 0, 0);
    mainLayout->setSpacing(10);

    QLabel* title = new QLabel("🏢 Student Hostel Room Allocations", this);
    title->setStyleSheet("font-size: 14px; font-weight: bold;");
    mainLayout->addWidget(title);

    // Form
    QFrame* formCard = new QFrame(this);
    formCard->setObjectName("card");
    QHBoxLayout* formLayout = new QHBoxLayout(formCard);
    formLayout->setContentsMargins(10, 10, 10, 10);
    formLayout->setSpacing(8);

    m_roomInput = new QLineEdit(this);
    m_roomInput->setPlaceholderText("Room Number (e.g., A-301)...");
    m_studentInput = new QLineEdit(this);
    m_studentInput->setPlaceholderText("Student Name...");
    m_allocateBtn = new QPushButton("🔑 Assign Room", this);
    connect(m_allocateBtn, &QPushButton::clicked, this, &HostelModule::allocateRoom);

    formLayout->addWidget(m_roomInput, 1);
    formLayout->addWidget(m_studentInput, 2);
    formLayout->addWidget(m_allocateBtn);
    mainLayout->addWidget(formCard);

    // Allocations grid
    m_roomsTable = new QTableWidget(this);
    m_roomsTable->setColumnCount(3);
    m_roomsTable->setHorizontalHeaderLabels({"Hostel Block / Room", "Assigned Student", "Occupancy Status"});
    m_roomsTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    mainLayout->addWidget(m_roomsTable, 1);
}

void HostelModule::loadAllocations() {
    m_roomsTable->setRowCount(3);
    m_roomsTable->setItem(0, 0, new QTableWidgetItem("Gargi Block - 102"));
    m_roomsTable->setItem(0, 1, new QTableWidgetItem("Sarah Jenkins"));
    m_roomsTable->setItem(0, 2, new QTableWidgetItem("OCCUPIED"));

    m_roomsTable->setItem(1, 0, new QTableWidgetItem("Vyas Block - 204"));
    m_roomsTable->setItem(1, 1, new QTableWidgetItem("David Miller"));
    m_roomsTable->setItem(1, 2, new QTableWidgetItem("OCCUPIED"));

    m_roomsTable->setItem(2, 0, new QTableWidgetItem("Tagore Block - 305"));
    m_roomsTable->setItem(2, 1, new QTableWidgetItem("None"));
    m_roomsTable->setItem(2, 2, new QTableWidgetItem("VACANT"));
}

void HostelModule::allocateRoom() {
    QString roomText = m_roomInput->text().trimmed();
    QString studentText = m_studentInput->text().trimmed();
    if (roomText.isEmpty() || studentText.isEmpty()) return;

    int row = m_roomsTable->rowCount();
    m_roomsTable->insertRow(row);
    m_roomsTable->setItem(row, 0, new QTableWidgetItem(roomText));
    m_roomsTable->setItem(row, 1, new QTableWidgetItem(studentText));
    m_roomsTable->setItem(row, 2, new QTableWidgetItem("OCCUPIED"));

    m_roomInput->clear();
    m_studentInput->clear();
}
