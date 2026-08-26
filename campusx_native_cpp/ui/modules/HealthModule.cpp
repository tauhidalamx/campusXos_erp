#include "HealthModule.hpp"
#include <QVBoxLayout>
#include <QHBoxLayout>
#include <QLabel>
#include <QHeaderView>

HealthModule::HealthModule(QWidget* parent) : QWidget(parent) {
    setupUi();
    loadAppointments();
}

void HealthModule::setupUi() {
    QVBoxLayout* mainLayout = new QVBoxLayout(this);
    mainLayout->setContentsMargins(0, 0, 0, 0);
    mainLayout->setSpacing(10);

    QLabel* title = new QLabel("🏥 Student Health Center Clinic Queue", this);
    title->setStyleSheet("font-size: 14px; font-weight: bold;");
    mainLayout->addWidget(title);

    // Appointment Form Card
    QFrame* formCard = new QFrame(this);
    formCard->setObjectName("card");
    QHBoxLayout* formLayout = new QHBoxLayout(formCard);
    formLayout->setContentsMargins(10, 10, 10, 10);
    formLayout->setSpacing(8);

    m_patientInput = new QLineEdit(this);
    m_patientInput->setPlaceholderText("Patient Name...");
    m_symptomInput = new QLineEdit(this);
    m_symptomInput->setPlaceholderText("Symptoms (e.g., Fever, Sprain)...");
    m_bookBtn = new QPushButton("🩺 Book Appointment", this);
    connect(m_bookBtn, &QPushButton::clicked, this, &HealthModule::scheduleAppointment);

    formLayout->addWidget(m_patientInput, 2);
    formLayout->addWidget(m_symptomInput, 2);
    formLayout->addWidget(m_bookBtn);
    mainLayout->addWidget(formCard);

    // Queue Table
    m_queueTable = new QTableWidget(this);
    m_queueTable->setColumnCount(4);
    m_queueTable->setHorizontalHeaderLabels({"Ticket Number", "Student Name", "Reason / Symptom", "Queue Status"});
    m_queueTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    mainLayout->addWidget(m_queueTable, 1);
}

void HealthModule::loadAppointments() {
    m_queueTable->setRowCount(3);
    m_queueTable->setItem(0, 0, new QTableWidgetItem("T-004"));
    m_queueTable->setItem(0, 1, new QTableWidgetItem("Lucas Carter"));
    m_queueTable->setItem(0, 2, new QTableWidgetItem("Flu symptoms"));
    m_queueTable->setItem(0, 3, new QTableWidgetItem("IN CLINIC"));

    m_queueTable->setItem(1, 0, new QTableWidgetItem("T-005"));
    m_queueTable->setItem(1, 1, new QTableWidgetItem("Emma Watson"));
    m_queueTable->setItem(1, 2, new QTableWidgetItem("Ankle sprain"));
    m_queueTable->setItem(1, 3, new QTableWidgetItem("WAITING (Next)"));

    m_queueTable->setItem(2, 0, new QTableWidgetItem("T-006"));
    m_queueTable->setItem(2, 1, new QTableWidgetItem("Liam Neeson"));
    m_queueTable->setItem(2, 2, new QTableWidgetItem("Routine physical check"));
    m_queueTable->setItem(2, 3, new QTableWidgetItem("WAITING (2 in queue)"));
}

void HealthModule::scheduleAppointment() {
    QString patientText = m_patientInput->text().trimmed();
    QString symptomText = m_symptomInput->text().trimmed();
    if (patientText.isEmpty() || symptomText.isEmpty()) return;

    int row = m_queueTable->rowCount();
    m_queueTable->insertRow(row);
    m_queueTable->setItem(row, 0, new QTableWidgetItem("T-" + QString::number(100 + row * 3)));
    m_queueTable->setItem(row, 1, new QTableWidgetItem(patientText));
    m_queueTable->setItem(row, 2, new QTableWidgetItem(symptomText));
    m_queueTable->setItem(row, 3, new QTableWidgetItem("WAITING"));

    m_patientInput->clear();
    m_symptomInput->clear();
}
