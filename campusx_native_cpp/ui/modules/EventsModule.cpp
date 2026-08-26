#include "EventsModule.hpp"
#include <QVBoxLayout>
#include <QHBoxLayout>
#include <QLabel>
#include <QHeaderView>

EventsModule::EventsModule(QWidget* parent) : QWidget(parent) {
    setupUi();
    loadEvents();
}

void EventsModule::setupUi() {
    QVBoxLayout* mainLayout = new QVBoxLayout(this);
    mainLayout->setContentsMargins(0, 0, 0, 0);
    mainLayout->setSpacing(10);

    QLabel* title = new QLabel("📅 Campus Events Calendar & Conferences", this);
    title->setStyleSheet("font-size: 14px; font-weight: bold;");
    mainLayout->addWidget(title);

    // Event Registration Form
    QFrame* formCard = new QFrame(this);
    formCard->setObjectName("card");
    QHBoxLayout* formLayout = new QHBoxLayout(formCard);
    formLayout->setContentsMargins(10, 10, 10, 10);
    formLayout->setSpacing(8);

    m_eventNameInput = new QLineEdit(this);
    m_eventNameInput->setPlaceholderText("Event Name (e.g., AI Research Seminar)...");
    m_venueInput = new QLineEdit(this);
    m_venueInput->setPlaceholderText("Event Venue (e.g., Auditorium B)...");
    m_registerBtn = new QPushButton("📅 Register Event", this);
    connect(m_registerBtn, &QPushButton::clicked, this, &EventsModule::registerEvent);

    formLayout->addWidget(m_eventNameInput, 2);
    formLayout->addWidget(m_venueInput, 2);
    formLayout->addWidget(m_registerBtn);
    mainLayout->addWidget(formCard);

    // Events Table
    m_eventsTable = new QTableWidget(this);
    m_eventsTable->setColumnCount(3);
    m_eventsTable->setHorizontalHeaderLabels({"Event Name", "Venue Location", "Schedule Date"});
    m_eventsTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    mainLayout->addWidget(m_eventsTable, 1);
}

void EventsModule::loadEvents() {
    m_eventsTable->setRowCount(3);
    m_eventsTable->setItem(0, 0, new QTableWidgetItem("Annual Technical Hackathon"));
    m_eventsTable->setItem(0, 1, new QTableWidgetItem("Campus Seminar Hall"));
    m_eventsTable->setItem(0, 2, new QTableWidgetItem("July 22, 10:00 AM"));

    m_eventsTable->setItem(1, 0, new QTableWidgetItem("Private AI Gateway Architecture Lecture"));
    m_eventsTable->setItem(1, 1, new QTableWidgetItem("Auditorium 2"));
    m_eventsTable->setItem(1, 2, new QTableWidgetItem("July 25, 02:00 PM"));

    m_eventsTable->setItem(2, 0, new QTableWidgetItem("Career Placement & Recruiter Roster"));
    m_eventsTable->setItem(2, 1, new QTableWidgetItem("Exhibition Center Block A"));
    m_eventsTable->setItem(2, 2, new QTableWidgetItem("August 01, 09:30 AM"));
}

void EventsModule::registerEvent() {
    QString nameText = m_eventNameInput->text().trimmed();
    QString venueText = m_venueInput->text().trimmed();
    if (nameText.isEmpty() || venueText.isEmpty()) return;

    int row = m_eventsTable->rowCount();
    m_eventsTable->insertRow(row);
    m_eventsTable->setItem(row, 0, new QTableWidgetItem(nameText));
    m_eventsTable->setItem(row, 1, new QTableWidgetItem(venueText));
    m_eventsTable->setItem(row, 2, new QTableWidgetItem("August 10, 11:00 AM"));

    m_eventNameInput->clear();
    m_venueInput->clear();
}
