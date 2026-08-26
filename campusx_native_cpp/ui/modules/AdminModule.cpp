#include "AdminModule.hpp"
#include "ApiClient.hpp"
#include <QVBoxLayout>
#include <QHBoxLayout>
#include <QTabWidget>
#include <QLabel>
#include <QHeaderView>
#include <QJsonObject>
#include <QJsonArray>
#include <QDateTime>

AdminModule::AdminModule(QWidget* parent) : QWidget(parent) { setupUi(); }

void AdminModule::setupUi() {
    QVBoxLayout* mainLayout = new QVBoxLayout(this);
    mainLayout->setContentsMargins(0, 0, 0, 0);
    QTabWidget* tabWidget = new QTabWidget(this);

    // ==========================================
    // --- TAB 1: USERS ---
    // ==========================================
    QWidget* usersTab = new QWidget(this);
    QVBoxLayout* usersLayout = new QVBoxLayout(usersTab);
    usersLayout->setContentsMargins(10, 10, 10, 10);
    usersLayout->setSpacing(8);

    QLabel* usersTitle = new QLabel("👥 User Management", usersTab);
    usersTitle->setStyleSheet("font-size: 14px; font-weight: bold;");
    usersLayout->addWidget(usersTitle);

    QHBoxLayout* usersFilter = new QHBoxLayout();
    m_userSearch = new QLineEdit(usersTab);
    m_userSearch->setPlaceholderText("Search users...");
    m_userRoleFilter = new QComboBox(usersTab);
    m_userRoleFilter->addItems({"All Roles", "admin", "faculty", "student", "registrar", "dean", "hod", "finance_manager", "parent", "alumni"});
    usersFilter->addWidget(m_userSearch, 2);
    usersFilter->addWidget(m_userRoleFilter);
    usersLayout->addLayout(usersFilter);

    m_usersTable = new QTableWidget(usersTab);
    m_usersTable->setColumnCount(6);
    m_usersTable->setHorizontalHeaderLabels({"User ID", "Name", "Email", "Role", "Department", "Status"});
    m_usersTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    m_usersTable->insertRow(0);
    m_usersTable->setItem(0, 0, new QTableWidgetItem("usr_001"));
    m_usersTable->setItem(0, 1, new QTableWidgetItem("Dr. Evelyn Sterling"));
    m_usersTable->setItem(0, 2, new QTableWidgetItem("evelyn@campusx.edu"));
    m_usersTable->setItem(0, 3, new QTableWidgetItem("admin"));
    m_usersTable->setItem(0, 4, new QTableWidgetItem("CS"));
    m_usersTable->setItem(0, 5, new QTableWidgetItem("✓ Active"));
    m_usersTable->insertRow(1);
    m_usersTable->setItem(1, 0, new QTableWidgetItem("usr_stu001"));
    m_usersTable->setItem(1, 1, new QTableWidgetItem("Alex Rivera"));
    m_usersTable->setItem(1, 2, new QTableWidgetItem("alex@campusx.edu"));
    m_usersTable->setItem(1, 3, new QTableWidgetItem("student"));
    m_usersTable->setItem(1, 4, new QTableWidgetItem("CS"));
    m_usersTable->setItem(1, 5, new QTableWidgetItem("✓ Active"));
    m_usersTable->insertRow(2);
    m_usersTable->setItem(2, 0, new QTableWidgetItem("usr_fac001"));
    m_usersTable->setItem(2, 1, new QTableWidgetItem("Prof. Marcus Chen"));
    m_usersTable->setItem(2, 2, new QTableWidgetItem("marcus@campusx.edu"));
    m_usersTable->setItem(2, 3, new QTableWidgetItem("faculty"));
    m_usersTable->setItem(2, 4, new QTableWidgetItem("CS"));
    m_usersTable->setItem(2, 5, new QTableWidgetItem("✓ Active"));
    usersLayout->addWidget(m_usersTable);

    m_addUserBtn = new QPushButton("+ Add New User", usersTab);
    m_addUserBtn->setStyleSheet("background-color: #6366F1;");
    connect(m_addUserBtn, &QPushButton::clicked, this, &AdminModule::addUser);
    usersLayout->addWidget(m_addUserBtn);
    tabWidget->addTab(usersTab, "Users");

    // ==========================================
    // --- TAB 2: STAFF ---
    // ==========================================
    QWidget* staffTab = new QWidget(this);
    QVBoxLayout* staffLayout = new QVBoxLayout(staffTab);
    staffLayout->setContentsMargins(10, 10, 10, 10);

    QLabel* staffTitle = new QLabel("🏢 Staff Directory", staffTab);
    staffTitle->setStyleSheet("font-size: 14px; font-weight: bold;");
    staffLayout->addWidget(staffTitle);

    m_staffTable = new QTableWidget(staffTab);
    m_staffTable->setColumnCount(5);
    m_staffTable->setHorizontalHeaderLabels({"Staff ID", "Name", "Department", "Position", "Status"});
    m_staffTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    m_staffTable->insertRow(0);
    m_staffTable->setItem(0, 0, new QTableWidgetItem("stf_001"));
    m_staffTable->setItem(0, 1, new QTableWidgetItem("James Wilson"));
    m_staffTable->setItem(0, 2, new QTableWidgetItem("Administration"));
    m_staffTable->setItem(0, 3, new QTableWidgetItem("Office Manager"));
    m_staffTable->setItem(0, 4, new QTableWidgetItem("✓ Active"));
    m_staffTable->insertRow(1);
    m_staffTable->setItem(1, 0, new QTableWidgetItem("stf_002"));
    m_staffTable->setItem(1, 1, new QTableWidgetItem("Maria Garcia"));
    m_staffTable->setItem(1, 2, new QTableWidgetItem("Library"));
    m_staffTable->setItem(1, 3, new QTableWidgetItem("Librarian"));
    m_staffTable->setItem(1, 4, new QTableWidgetItem("✓ Active"));
    staffLayout->addWidget(m_staffTable);
    tabWidget->addTab(staffTab, "Staff");

    // ==========================================
    // --- TAB 3: LEAVE ---
    // ==========================================
    QWidget* leaveTab = new QWidget(this);
    QVBoxLayout* leaveLayout = new QVBoxLayout(leaveTab);
    leaveLayout->setContentsMargins(10, 10, 10, 10);

    QLabel* leaveTitle = new QLabel("📅 Leave Management", leaveTab);
    leaveTitle->setStyleSheet("font-size: 14px; font-weight: bold;");
    leaveLayout->addWidget(leaveTitle);

    m_leaveTable = new QTableWidget(leaveTab);
    m_leaveTable->setColumnCount(6);
    m_leaveTable->setHorizontalHeaderLabels({"Employee", "Type", "From", "To", "Days", "Status"});
    m_leaveTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    m_leaveTable->insertRow(0);
    m_leaveTable->setItem(0, 0, new QTableWidgetItem("Prof. Marcus Chen"));
    m_leaveTable->setItem(0, 1, new QTableWidgetItem("Conference Leave"));
    m_leaveTable->setItem(0, 2, new QTableWidgetItem("2026-08-10"));
    m_leaveTable->setItem(0, 3, new QTableWidgetItem("2026-08-14"));
    m_leaveTable->setItem(0, 4, new QTableWidgetItem("5"));
    m_leaveTable->setItem(0, 5, new QTableWidgetItem("Pending"));
    m_leaveTable->insertRow(1);
    m_leaveTable->setItem(1, 0, new QTableWidgetItem("Dr. Sarah Connor"));
    m_leaveTable->setItem(1, 1, new QTableWidgetItem("Sick Leave"));
    m_leaveTable->setItem(1, 2, new QTableWidgetItem("2026-07-20"));
    m_leaveTable->setItem(1, 3, new QTableWidgetItem("2026-07-22"));
    m_leaveTable->setItem(1, 4, new QTableWidgetItem("3"));
    m_leaveTable->setItem(1, 5, new QTableWidgetItem("✓ Approved"));
    leaveLayout->addWidget(m_leaveTable);

    m_approveLeaveBtn = new QPushButton("Approve Selected Leave", leaveTab);
    m_approveLeaveBtn->setStyleSheet("background-color: #10B981;");
    connect(m_approveLeaveBtn, &QPushButton::clicked, this, &AdminModule::approveLeave);
    leaveLayout->addWidget(m_approveLeaveBtn);
    tabWidget->addTab(leaveTab, "Leave");

    // ==========================================
    // --- TAB 4: ANNOUNCEMENTS ---
    // ==========================================
    QWidget* annTab = new QWidget(this);
    QVBoxLayout* annLayout = new QVBoxLayout(annTab);
    annLayout->setContentsMargins(10, 10, 10, 10);
    annLayout->setSpacing(8);

    QLabel* annTitle = new QLabel("📢 Announcements", annTab);
    annTitle->setStyleSheet("font-size: 14px; font-weight: bold;");
    annLayout->addWidget(annTitle);

    QLabel* composeLabel = new QLabel("Compose Announcement:", annTab);
    composeLabel->setStyleSheet("font-weight: bold;");
    annLayout->addWidget(composeLabel);

    m_announcementText = new QTextEdit(annTab);
    m_announcementText->setPlaceholderText("Write your announcement here...");
    m_announcementText->setMaximumHeight(100);
    annLayout->addWidget(m_announcementText);

    m_publishAnnouncementBtn = new QPushButton("Publish Announcement", annTab);
    m_publishAnnouncementBtn->setStyleSheet("background-color: #6366F1;");
    connect(m_publishAnnouncementBtn, &QPushButton::clicked, this, &AdminModule::publishAnnouncement);
    annLayout->addWidget(m_publishAnnouncementBtn);

    QLabel* historyLabel = new QLabel("Recent Announcements:", annTab);
    historyLabel->setStyleSheet("font-weight: bold; margin-top: 8px;");
    annLayout->addWidget(historyLabel);

    m_announcementsTable = new QTableWidget(annTab);
    m_announcementsTable->setColumnCount(3);
    m_announcementsTable->setHorizontalHeaderLabels({"Date", "Message", "Author"});
    m_announcementsTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    m_announcementsTable->insertRow(0);
    m_announcementsTable->setItem(0, 0, new QTableWidgetItem(QDateTime::currentDateTime().toString("yyyy-MM-dd")));
    m_announcementsTable->setItem(0, 1, new QTableWidgetItem("Mid-semester exams schedule published."));
    m_announcementsTable->setItem(0, 2, new QTableWidgetItem("University Admin"));
    annLayout->addWidget(m_announcementsTable);
    tabWidget->addTab(annTab, "Announcements");

    // ==========================================
    // --- TAB 5: COMPLIANCE ---
    // ==========================================
    QWidget* compTab = new QWidget(this);
    QVBoxLayout* compLayout = new QVBoxLayout(compTab);
    compLayout->setContentsMargins(10, 10, 10, 10);

    QLabel* compTitle = new QLabel("🛡 Compliance & Audit", compTab);
    compTitle->setStyleSheet("font-size: 14px; font-weight: bold;");
    compLayout->addWidget(compTitle);

    m_complianceTable = new QTableWidget(compTab);
    m_complianceTable->setColumnCount(4);
    m_complianceTable->setHorizontalHeaderLabels({"Audit ID", "Description", "Date", "Status"});
    m_complianceTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    m_complianceTable->insertRow(0);
    m_complianceTable->setItem(0, 0, new QTableWidgetItem("AUD-001"));
    m_complianceTable->setItem(0, 1, new QTableWidgetItem("Annual NAAC Compliance Review"));
    m_complianceTable->setItem(0, 2, new QTableWidgetItem("2026-06-30"));
    m_complianceTable->setItem(0, 3, new QTableWidgetItem("✓ Completed"));
    m_complianceTable->insertRow(1);
    m_complianceTable->setItem(1, 0, new QTableWidgetItem("AUD-002"));
    m_complianceTable->setItem(1, 1, new QTableWidgetItem("IT Security Policy Audit"));
    m_complianceTable->setItem(1, 2, new QTableWidgetItem("2026-09-15"));
    m_complianceTable->setItem(1, 3, new QTableWidgetItem("Scheduled"));
    compLayout->addWidget(m_complianceTable);
    tabWidget->addTab(compTab, "Compliance");

    // ==========================================
    // --- TAB 6: REPORTS ---
    // ==========================================
    QWidget* repTab = new QWidget(this);
    QVBoxLayout* repLayout = new QVBoxLayout(repTab);
    repLayout->setContentsMargins(10, 10, 10, 10);

    QLabel* repTitle = new QLabel("📈 Reports & Analytics", repTab);
    repTitle->setStyleSheet("font-size: 14px; font-weight: bold;");
    repLayout->addWidget(repTitle);

    m_reportsTable = new QTableWidget(repTab);
    m_reportsTable->setColumnCount(4);
    m_reportsTable->setHorizontalHeaderLabels({"Report Name", "Type", "Generated", "Download"});
    m_reportsTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    m_reportsTable->insertRow(0);
    m_reportsTable->setItem(0, 0, new QTableWidgetItem("Semester Performance Report"));
    m_reportsTable->setItem(0, 1, new QTableWidgetItem("Academic"));
    m_reportsTable->setItem(0, 2, new QTableWidgetItem("2026-07-01"));
    m_reportsTable->setItem(0, 3, new QTableWidgetItem("📥 PDF"));
    m_reportsTable->insertRow(1);
    m_reportsTable->setItem(1, 0, new QTableWidgetItem("Annual Financial Summary"));
    m_reportsTable->setItem(1, 1, new QTableWidgetItem("Finance"));
    m_reportsTable->setItem(1, 2, new QTableWidgetItem("2026-06-30"));
    m_reportsTable->setItem(1, 3, new QTableWidgetItem("📥 PDF"));
    m_reportsTable->insertRow(2);
    m_reportsTable->setItem(2, 0, new QTableWidgetItem("Faculty Workload Analysis"));
    m_reportsTable->setItem(2, 1, new QTableWidgetItem("HR"));
    m_reportsTable->setItem(2, 2, new QTableWidgetItem("2026-07-10"));
    m_reportsTable->setItem(2, 3, new QTableWidgetItem("📥 PDF"));
    repLayout->addWidget(m_reportsTable);
    tabWidget->addTab(repTab, "Reports");

    mainLayout->addWidget(tabWidget);
}

void AdminModule::addUser() {
    int row = m_usersTable->rowCount();
    m_usersTable->insertRow(row);
    m_usersTable->setItem(row, 0, new QTableWidgetItem(QString("usr_%1").arg(row + 1, 3, 10, QChar('0'))));
    m_usersTable->setItem(row, 1, new QTableWidgetItem("New User"));
    m_usersTable->setItem(row, 2, new QTableWidgetItem("user@campusx.edu"));
    m_usersTable->setItem(row, 3, new QTableWidgetItem("student"));
    m_usersTable->setItem(row, 4, new QTableWidgetItem("CS"));
    m_usersTable->setItem(row, 5, new QTableWidgetItem("✓ Active"));
}

void AdminModule::approveLeave() {
    int row = m_leaveTable->currentRow();
    if (row < 0) return;
    QTableWidgetItem* status = m_leaveTable->item(row, 5);
    if (status) status->setText("✓ Approved");
}

void AdminModule::publishAnnouncement() {
    QString text = m_announcementText->toPlainText().trimmed();
    if (text.isEmpty()) return;
    int row = 0;
    m_announcementsTable->insertRow(row);
    m_announcementsTable->setItem(row, 0, new QTableWidgetItem(QDateTime::currentDateTime().toString("yyyy-MM-dd hh:mm")));
    m_announcementsTable->setItem(row, 1, new QTableWidgetItem(text));
    m_announcementsTable->setItem(row, 2, new QTableWidgetItem("University Admin"));
    m_announcementText->clear();
}
