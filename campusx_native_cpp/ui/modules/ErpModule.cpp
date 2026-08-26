#include "ErpModule.hpp"
#include "ApiClient.hpp"
#include <QVBoxLayout>
#include <QHBoxLayout>
#include <QTabWidget>
#include <QLabel>
#include <QJsonObject>
#include <QJsonArray>
#include <QHeaderView>
#include <QDateTime>
#include <QGroupBox>
#include <QGridLayout>
#include <QFrame>

ErpModule::ErpModule(QWidget* parent) : QWidget(parent) {
    setupUi();
    loadRosterData();
}

void ErpModule::setupUi() {
    QVBoxLayout* mainLayout = new QVBoxLayout(this);
    mainLayout->setContentsMargins(0, 0, 0, 0);
    
    QTabWidget* tabWidget = new QTabWidget(this);
    
    // ==========================================
    // --- TAB 1: ROSTER DIRECTORY ---
    // ==========================================
    QWidget* rosterTab = new QWidget(this);
    QVBoxLayout* rosterLayout = new QVBoxLayout(rosterTab);
    rosterLayout->setContentsMargins(10, 10, 10, 10);
    
    QLabel* rTitle = new QLabel("🏫 Student & Faculty Registries Directory", rosterTab);
    rTitle->setStyleSheet("font-size: 14px; font-weight: bold;");
    rosterLayout->addWidget(rTitle);
    
    m_rosterTable = new QTableWidget(rosterTab);
    m_rosterTable->setColumnCount(4);
    m_rosterTable->setHorizontalHeaderLabels({"User ID", "Full Name", "Department", "Clearance Role"});
    m_rosterTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    rosterLayout->addWidget(m_rosterTable);
    
    tabWidget->addTab(rosterTab, "Rosters Directory");
    
    // ==========================================
    // --- TAB 2: SEMESTER REGISTRATIONS ---
    // ==========================================
    QWidget* regTab = new QWidget(this);
    QVBoxLayout* regLayout = new QVBoxLayout(regTab);
    regLayout->setContentsMargins(10, 10, 10, 10);
    regLayout->setSpacing(8);
    
    QLabel* regTitle = new QLabel("📝 Semester Course Registrations Console", regTab);
    regTitle->setStyleSheet("font-size: 14px; font-weight: bold;");
    regLayout->addWidget(regTitle);
    
    QHBoxLayout* regForm = new QHBoxLayout();
    m_regStudentInput = new QLineEdit(regTab);
    m_regStudentInput->setPlaceholderText("Enter Student ID (e.g. usr_stu001)...");
    
    m_regCourseCombo = new QComboBox(regTab);
    m_regCourseCombo->addItem("CS202 - Object Oriented Programming");
    m_regCourseCombo->addItem("CS301 - Database Management Systems");
    m_regCourseCombo->addItem("CYBER401 - System Network Security");
    
    m_enrollBtn = new QPushButton("Enroll Student", regTab);
    m_enrollBtn->setStyleSheet("background-color: #6366F1;");
    connect(m_enrollBtn, &QPushButton::clicked, this, &ErpModule::executeEnrollment);
    
    regForm->addWidget(m_regStudentInput, 2);
    regForm->addWidget(m_regCourseCombo, 2);
    regForm->addWidget(m_enrollBtn);
    regLayout->addLayout(regForm);
    
    m_regTable = new QTableWidget(regTab);
    m_regTable->setColumnCount(3);
    m_regTable->setHorizontalHeaderLabels({"Student ID", "Selected Course", "Registration Status"});
    m_regTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    m_regTable->insertRow(0);
    m_regTable->setItem(0, 0, new QTableWidgetItem("usr_stu001"));
    m_regTable->setItem(0, 1, new QTableWidgetItem("CS202 - Object Oriented Programming"));
    m_regTable->setItem(0, 2, new QTableWidgetItem("✓ ACTIVE"));
    regLayout->addWidget(m_regTable);
    
    tabWidget->addTab(regTab, "Registrations");
    
    // ==========================================
    // --- TAB 3: FACULTY COURSE ALLOCATIONS ---
    // ==========================================
    QWidget* allocTab = new QWidget(this);
    QVBoxLayout* allocLayout = new QVBoxLayout(allocTab);
    allocLayout->setContentsMargins(10, 10, 10, 10);
    allocLayout->setSpacing(8);
    
    QLabel* allocTitle = new QLabel("👤 Faculty Course Allocations Desk", allocTab);
    allocTitle->setStyleSheet("font-size: 14px; font-weight: bold;");
    allocLayout->addWidget(allocTitle);
    
    QHBoxLayout* allocForm = new QHBoxLayout();
    m_allocFacultyCombo = new QComboBox(allocTab);
    m_allocFacultyCombo->addItem("Prof. Marcus Chen");
    m_allocFacultyCombo->addItem("Dr. Evelyn Sterling");
    m_allocFacultyCombo->addItem("Prof. David Jenkins");
    
    m_allocCourseCombo = new QComboBox(allocTab);
    m_allocCourseCombo->addItem("CS202");
    m_allocCourseCombo->addItem("CS301");
    m_allocCourseCombo->addItem("CYBER401");
    
    m_allocBtn = new QPushButton("Allocate Course", allocTab);
    m_allocBtn->setStyleSheet("background-color: #F59E0B;");
    connect(m_allocBtn, &QPushButton::clicked, this, &ErpModule::allocateFaculty);
    
    allocForm->addWidget(m_allocFacultyCombo, 2);
    allocForm->addWidget(m_allocCourseCombo, 2);
    allocForm->addWidget(m_allocBtn);
    allocLayout->addLayout(allocForm);
    
    m_allocTable = new QTableWidget(allocTab);
    m_allocTable->setColumnCount(3);
    m_allocTable->setHorizontalHeaderLabels({"Faculty Name", "Allocated Course", "Teaching Workload"});
    m_allocTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    m_allocTable->insertRow(0);
    m_allocTable->setItem(0, 0, new QTableWidgetItem("Prof. Marcus Chen"));
    m_allocTable->setItem(0, 1, new QTableWidgetItem("CS202"));
    m_allocTable->setItem(0, 2, new QTableWidgetItem("6 Hours / Week"));
    allocLayout->addWidget(m_allocTable);
    
    tabWidget->addTab(allocTab, "Faculty Allocation");
    
    // ==========================================
    // --- TAB 4: ATTENDANCE LOCKS ---
    // ==========================================
    QWidget* attendanceTab = new QWidget(this);
    QVBoxLayout* attLayout = new QVBoxLayout(attendanceTab);
    attLayout->setContentsMargins(10, 10, 10, 10);
    
    QLabel* aTitle = new QLabel("🔒 Attendance Lock Operations Command Desk", attendanceTab);
    aTitle->setStyleSheet("font-size: 14px; font-weight: bold;");
    attLayout->addWidget(aTitle);
    
    QLabel* aDesc = new QLabel("Submit daily attendance sheets to lock indices and compute statistics on-chain.", attendanceTab);
    aDesc->setObjectName("muted");
    attLayout->addWidget(aDesc);
    
    attLayout->addSpacing(20);
    
    m_lockButton = new QPushButton("🔒 Lock Roster (CS202 CS)", attendanceTab);
    m_lockButton->setStyleSheet("background-color: #6366F1;");
    connect(m_lockButton, &QPushButton::clicked, this, &ErpModule::executeAttendanceLock);
    attLayout->addWidget(m_lockButton);
    
    attLayout->addStretch();
    
    tabWidget->addTab(attendanceTab, "Attendance Lock");
    
    // ==========================================
    // --- TAB 5: EXAMINATIONS CONSOLE ---
    // ==========================================
    QWidget* examTab = new QWidget(this);
    QVBoxLayout* examLayout = new QVBoxLayout(examTab);
    examLayout->setContentsMargins(10, 10, 10, 10);
    examLayout->setSpacing(8);
    
    QLabel* examTitle = new QLabel("📝 Examination Halls & Examiner Allocations Desk", examTab);
    examTitle->setStyleSheet("font-size: 14px; font-weight: bold;");
    examLayout->addWidget(examTitle);
    
    QHBoxLayout* examForm = new QHBoxLayout();
    m_examHallInput = new QLineEdit(examTab);
    m_examHallInput->setPlaceholderText("Enter Exam Hall Code (e.g. Hall-B)...");
    
    m_examCourseCombo = new QComboBox(examTab);
    m_examCourseCombo->addItem("CS202 Midterm Exam");
    m_examCourseCombo->addItem("CS301 Theory Exam");
    m_examCourseCombo->addItem("CYBER401 Final Exam");
    
    m_examAllocBtn = new QPushButton("Schedule Exam", examTab);
    m_examAllocBtn->setStyleSheet("background-color: #10B981;");
    connect(m_examAllocBtn, &QPushButton::clicked, this, &ErpModule::allocateExamHall);
    
    examForm->addWidget(m_examHallInput, 2);
    examForm->addWidget(m_examCourseCombo, 2);
    examForm->addWidget(m_examAllocBtn);
    examLayout->addLayout(examForm);
    
    m_examsTable = new QTableWidget(examTab);
    m_examsTable->setColumnCount(3);
    m_examsTable->setHorizontalHeaderLabels({"Course Subject", "Exam Hall Block", "Allocated invigilator"});
    m_examsTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    m_examsTable->insertRow(0);
    m_examsTable->setItem(0, 0, new QTableWidgetItem("CS202 Midterm Exam"));
    m_examsTable->setItem(0, 1, new QTableWidgetItem("Hall-A (Block-3)"));
    m_examsTable->setItem(0, 2, new QTableWidgetItem("Prof. David Jenkins"));
    examLayout->addWidget(m_examsTable);
    
    tabWidget->addTab(examTab, "Exams Allocation");
    
    // ==========================================
    // --- TAB 6: GRADES APPROVAL & SBT MINT ---
    // ==========================================
    QWidget* degreeTab = new QWidget(this);
    QVBoxLayout* degLayout = new QVBoxLayout(degreeTab);
    degLayout->setContentsMargins(10, 10, 10, 10);
    degLayout->setSpacing(8);
    
    QLabel* dTitle = new QLabel("🎓 Dean Approvals & Soulbound NFT Degrees Console", degreeTab);
    dTitle->setStyleSheet("font-size: 14px; font-weight: bold;");
    degLayout->addWidget(dTitle);
    
    QLabel* dSub = new QLabel("Active Grade Rosters Pending HOD/Dean Authorization:", degreeTab);
    dSub->setStyleSheet("font-weight: bold;");
    degLayout->addWidget(dSub);
    
    m_approvalsTable = new QTableWidget(degreeTab);
    m_approvalsTable->setColumnCount(4);
    m_approvalsTable->setHorizontalHeaderLabels({"Batch Code", "Course Title", "GPA Average", "Dean Approval Status"});
    m_approvalsTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    m_approvalsTable->insertRow(0);
    m_approvalsTable->setItem(0, 0, new QTableWidgetItem("2026-CS-OOP"));
    m_approvalsTable->setItem(0, 1, new QTableWidgetItem("CS202 Object Oriented Program"));
    m_approvalsTable->setItem(0, 2, new QTableWidgetItem("3.65 / 4.00"));
    m_approvalsTable->setItem(0, 3, new QTableWidgetItem("PENDING DEAN SIGNATURE"));
    degLayout->addWidget(m_approvalsTable);
    
    m_approveBtn = new QPushButton("✍ Sign & Authorize Active Grade Rosters", degreeTab);
    m_approveBtn->setStyleSheet("background-color: #6366F1;");
    connect(m_approveBtn, &QPushButton::clicked, this, &ErpModule::approveCourseGrades);
    degLayout->addWidget(m_approveBtn);
    
    degLayout->addSpacing(10);
    QLabel* dLogsSub = new QLabel("Decentralized Soulbound NFTs Degree ledgers:", degreeTab);
    dLogsSub->setStyleSheet("font-weight: bold;");
    degLayout->addWidget(dLogsSub);
    
    m_mintLogsTable = new QTableWidget(degreeTab);
    m_mintLogsTable->setColumnCount(3);
    m_mintLogsTable->setHorizontalHeaderLabels({"Student ID", "SBT Degree Certificate Title", "Block Status"});
    m_mintLogsTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    m_mintLogsTable->insertRow(0);
    m_mintLogsTable->setItem(0, 0, new QTableWidgetItem("usr_stu001"));
    m_mintLogsTable->setItem(0, 1, new QTableWidgetItem("Bachelor of Science (Computer Science)"));
    m_mintLogsTable->setItem(0, 2, new QTableWidgetItem("✓ ANCHORED (Block #9,401,902)"));
    degLayout->addWidget(m_mintLogsTable);
    
    m_mintButton = new QPushButton("🎓 Mint SBT Degree Certificate", degreeTab);
    m_mintButton->setStyleSheet("background-color: #10B981;");
    connect(m_mintButton, &QPushButton::clicked, this, &ErpModule::executeDegreeMint);
    degLayout->addWidget(m_mintButton);
    
    tabWidget->addTab(degreeTab, "Grades & SBT Mint");
    
    // ==========================================
    // --- TAB 7: ADMIN DASHBOARD ---
    // ==========================================
    QWidget* adminTab = new QWidget(this);
    QVBoxLayout* adminLayout = new QVBoxLayout(adminTab);
    adminLayout->setContentsMargins(10, 10, 10, 10);
    adminLayout->setSpacing(8);
    
    QLabel* adminTitle = new QLabel("🏛️ University Admin Operations Center", adminTab);
    adminTitle->setStyleSheet("font-size: 14px; font-weight: bold;");
    adminLayout->addWidget(adminTitle);
    
    // KPI Cards Row
    QHBoxLayout* kpiRow = new QHBoxLayout();
    auto makeKpiCard = [&](const QString& label, const QString& value, const QString& color) -> QGroupBox* {
        QGroupBox* box = new QGroupBox(adminTab);
        box->setStyleSheet(QString("QGroupBox { background-color: %1; border-radius: 8px; padding: 12px; }").arg(color));
        QVBoxLayout* bl = new QVBoxLayout(box);
        QLabel* vl = new QLabel(value, box);
        vl->setStyleSheet("font-size: 22px; font-weight: bold; color: white;");
        vl->setAlignment(Qt::AlignCenter);
        QLabel* ll = new QLabel(label, box);
        ll->setStyleSheet("font-size: 11px; color: #E0E0E0;");
        ll->setAlignment(Qt::AlignCenter);
        bl->addWidget(vl);
        bl->addWidget(ll);
        return box;
    };
    m_adminStudentCount = new QLabel("2,847");
    m_adminFacultyCount = new QLabel("312");
    m_adminCourseCount = new QLabel("486");
    m_adminDeptCount = new QLabel("24");
    kpiRow->addWidget(makeKpiCard("Total Students", "2,847", "#6366F1"));
    kpiRow->addWidget(makeKpiCard("Faculty Members", "312", "#10B981"));
    kpiRow->addWidget(makeKpiCard("Active Courses", "486", "#F59E0B"));
    kpiRow->addWidget(makeKpiCard("Departments", "24", "#EF4444"));
    adminLayout->addLayout(kpiRow);
    
    QLabel* adminRecent = new QLabel("Recent Administrative Actions:", adminTab);
    adminRecent->setStyleSheet("font-weight: bold; margin-top: 8px;");
    adminLayout->addWidget(adminRecent);
    
    m_adminRecentTable = new QTableWidget(adminTab);
    m_adminRecentTable->setColumnCount(4);
    m_adminRecentTable->setHorizontalHeaderLabels({"Timestamp", "Action", "Performed By", "Status"});
    m_adminRecentTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    m_adminRecentTable->insertRow(0);
    m_adminRecentTable->setItem(0, 0, new QTableWidgetItem(QDateTime::currentDateTime().toString("yyyy-MM-dd hh:mm")));
    m_adminRecentTable->setItem(0, 1, new QTableWidgetItem("New semester registration opened"));
    m_adminRecentTable->setItem(0, 2, new QTableWidgetItem("University Admin"));
    m_adminRecentTable->setItem(0, 3, new QTableWidgetItem("✓ Completed"));
    m_adminRecentTable->insertRow(1);
    m_adminRecentTable->setItem(1, 0, new QTableWidgetItem(QDateTime::currentDateTime().addSecs(-3600).toString("yyyy-MM-dd hh:mm")));
    m_adminRecentTable->setItem(1, 1, new QTableWidgetItem("Faculty payroll batch processed"));
    m_adminRecentTable->setItem(1, 2, new QTableWidgetItem("Finance Manager"));
    m_adminRecentTable->setItem(1, 3, new QTableWidgetItem("✓ Completed"));
    m_adminRecentTable->insertRow(2);
    m_adminRecentTable->setItem(2, 0, new QTableWidgetItem(QDateTime::currentDateTime().addSecs(-7200).toString("yyyy-MM-dd hh:mm")));
    m_adminRecentTable->setItem(2, 1, new QTableWidgetItem("Compliance audit submitted"));
    m_adminRecentTable->setItem(2, 2, new QTableWidgetItem("Auditor"));
    m_adminRecentTable->setItem(2, 3, new QTableWidgetItem("✓ Completed"));
    adminLayout->addWidget(m_adminRecentTable);
    
    tabWidget->addTab(adminTab, "Admin Dashboard");
    
    // ==========================================
    // --- TAB 8: REGISTRAR CONSOLE ---
    // ==========================================
    QWidget* regConTab = new QWidget(this);
    QVBoxLayout* regConLayout = new QVBoxLayout(regConTab);
    regConLayout->setContentsMargins(10, 10, 10, 10);
    regConLayout->setSpacing(8);
    
    QLabel* regConTitle = new QLabel("📋 Registrar Operations Console", regConTab);
    regConTitle->setStyleSheet("font-size: 14px; font-weight: bold;");
    regConLayout->addWidget(regConTitle);
    
    QHBoxLayout* regConSearch = new QHBoxLayout();
    m_registrarSearch = new QLineEdit(regConTab);
    m_registrarSearch->setPlaceholderText("Search student by ID or name...");
    m_genTranscriptBtn = new QPushButton("Generate Transcript", regConTab);
    m_genTranscriptBtn->setStyleSheet("background-color: #6366F1;");
    regConSearch->addWidget(m_registrarSearch, 3);
    regConSearch->addWidget(m_genTranscriptBtn);
    regConLayout->addLayout(regConSearch);
    
    QLabel* regConEnrollLabel = new QLabel("Enrollment Records:", regConTab);
    regConEnrollLabel->setStyleSheet("font-weight: bold;");
    regConLayout->addWidget(regConEnrollLabel);
    
    m_registrarEnrollTable = new QTableWidget(regConTab);
    m_registrarEnrollTable->setColumnCount(5);
    m_registrarEnrollTable->setHorizontalHeaderLabels({"Student ID", "Name", "Program", "Semester", "Status"});
    m_registrarEnrollTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    m_registrarEnrollTable->insertRow(0);
    m_registrarEnrollTable->setItem(0, 0, new QTableWidgetItem("usr_stu001"));
    m_registrarEnrollTable->setItem(0, 1, new QTableWidgetItem("Alex Rivera"));
    m_registrarEnrollTable->setItem(0, 2, new QTableWidgetItem("BSc Computer Science"));
    m_registrarEnrollTable->setItem(0, 3, new QTableWidgetItem("Semester 6"));
    m_registrarEnrollTable->setItem(0, 4, new QTableWidgetItem("✓ Active"));
    m_registrarEnrollTable->insertRow(1);
    m_registrarEnrollTable->setItem(1, 0, new QTableWidgetItem("usr_stu002"));
    m_registrarEnrollTable->setItem(1, 1, new QTableWidgetItem("Priya Sharma"));
    m_registrarEnrollTable->setItem(1, 2, new QTableWidgetItem("MSc Data Science"));
    m_registrarEnrollTable->setItem(1, 3, new QTableWidgetItem("Semester 2"));
    m_registrarEnrollTable->setItem(1, 4, new QTableWidgetItem("✓ Active"));
    regConLayout->addWidget(m_registrarEnrollTable);
    
    QLabel* certLabel = new QLabel("Certificate Issuance Tracker:", regConTab);
    certLabel->setStyleSheet("font-weight: bold; margin-top: 8px;");
    regConLayout->addWidget(certLabel);
    
    m_registrarCertTable = new QTableWidget(regConTab);
    m_registrarCertTable->setColumnCount(4);
    m_registrarCertTable->setHorizontalHeaderLabels({"Student ID", "Certificate Type", "Issue Date", "Blockchain Hash"});
    m_registrarCertTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    m_registrarCertTable->insertRow(0);
    m_registrarCertTable->setItem(0, 0, new QTableWidgetItem("usr_stu001"));
    m_registrarCertTable->setItem(0, 1, new QTableWidgetItem("Degree Certificate"));
    m_registrarCertTable->setItem(0, 2, new QTableWidgetItem("2026-06-15"));
    m_registrarCertTable->setItem(0, 3, new QTableWidgetItem("0xabc...def"));
    regConLayout->addWidget(m_registrarCertTable);
    
    tabWidget->addTab(regConTab, "Registrar Console");
    
    // ==========================================
    // --- TAB 9: DEAN DASHBOARD ---
    // ==========================================
    QWidget* deanTab = new QWidget(this);
    QVBoxLayout* deanLayout = new QVBoxLayout(deanTab);
    deanLayout->setContentsMargins(10, 10, 10, 10);
    deanLayout->setSpacing(8);
    
    QLabel* deanTitle = new QLabel("🎓 Dean Academic Operations Dashboard", deanTab);
    deanTitle->setStyleSheet("font-size: 14px; font-weight: bold;");
    deanLayout->addWidget(deanTitle);
    
    QHBoxLayout* deanKpi = new QHBoxLayout();
    m_deanResearchLabel = new QLabel("Active Research Grants: 14", deanTab);
    m_deanResearchLabel->setStyleSheet("font-weight: bold; padding: 8px; background-color: #1E293B; border-radius: 6px;");
    m_deanBudgetLabel = new QLabel("Total Research Budget: $225,000", deanTab);
    m_deanBudgetLabel->setStyleSheet("font-weight: bold; padding: 8px; background-color: #1E293B; border-radius: 6px;");
    deanKpi->addWidget(m_deanResearchLabel);
    deanKpi->addWidget(m_deanBudgetLabel);
    deanLayout->addLayout(deanKpi);
    
    QLabel* deanFacLabel = new QLabel("Faculty Performance Overview:", deanTab);
    deanFacLabel->setStyleSheet("font-weight: bold;");
    deanLayout->addWidget(deanFacLabel);
    
    m_deanFacultyTable = new QTableWidget(deanTab);
    m_deanFacultyTable->setColumnCount(6);
    m_deanFacultyTable->setHorizontalHeaderLabels({"Faculty ID", "Name", "Department", "Designation", "Workload (hrs)", "Rating"});
    m_deanFacultyTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    m_deanFacultyTable->insertRow(0);
    m_deanFacultyTable->setItem(0, 0, new QTableWidgetItem("fac_001"));
    m_deanFacultyTable->setItem(0, 1, new QTableWidgetItem("Prof. Marcus Chen"));
    m_deanFacultyTable->setItem(0, 2, new QTableWidgetItem("CS"));
    m_deanFacultyTable->setItem(0, 3, new QTableWidgetItem("Professor"));
    m_deanFacultyTable->setItem(0, 4, new QTableWidgetItem("16"));
    m_deanFacultyTable->setItem(0, 5, new QTableWidgetItem("4.8 / 5.0"));
    m_deanFacultyTable->insertRow(1);
    m_deanFacultyTable->setItem(1, 0, new QTableWidgetItem("fac_002"));
    m_deanFacultyTable->setItem(1, 1, new QTableWidgetItem("Dr. Sarah Connor"));
    m_deanFacultyTable->setItem(1, 2, new QTableWidgetItem("CS"));
    m_deanFacultyTable->setItem(1, 3, new QTableWidgetItem("Associate Professor"));
    m_deanFacultyTable->setItem(1, 4, new QTableWidgetItem("12"));
    m_deanFacultyTable->setItem(1, 5, new QTableWidgetItem("4.6 / 5.0"));
    deanLayout->addWidget(m_deanFacultyTable);
    
    QLabel* grantsLabel = new QLabel("Research Grant Proposals (Pending Dean Review):", deanTab);
    grantsLabel->setStyleSheet("font-weight: bold; margin-top: 8px;");
    deanLayout->addWidget(grantsLabel);
    
    m_deanGrantsTable = new QTableWidget(deanTab);
    m_deanGrantsTable->setColumnCount(5);
    m_deanGrantsTable->setHorizontalHeaderLabels({"Project ID", "Title", "Lead Researcher", "Budget ($)", "Status"});
    m_deanGrantsTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    m_deanGrantsTable->insertRow(0);
    m_deanGrantsTable->setItem(0, 0, new QTableWidgetItem("res_1"));
    m_deanGrantsTable->setItem(0, 1, new QTableWidgetItem("Federated Learning on Campus Mesh"));
    m_deanGrantsTable->setItem(0, 2, new QTableWidgetItem("Prof. Marcus Chen"));
    m_deanGrantsTable->setItem(0, 3, new QTableWidgetItem("45,000"));
    m_deanGrantsTable->setItem(0, 4, new QTableWidgetItem("Pending Dean Review"));
    m_deanGrantsTable->insertRow(1);
    m_deanGrantsTable->setItem(1, 0, new QTableWidgetItem("res_3"));
    m_deanGrantsTable->setItem(1, 1, new QTableWidgetItem("Automated Timetable via TensorFlow.js"));
    m_deanGrantsTable->setItem(1, 2, new QTableWidgetItem("Prof. Sarah Connor"));
    m_deanGrantsTable->setItem(1, 3, new QTableWidgetItem("20,000"));
    m_deanGrantsTable->setItem(1, 4, new QTableWidgetItem("Pending Dean Review"));
    deanLayout->addWidget(m_deanGrantsTable);
    
    m_deanApproveGrantBtn = new QPushButton("✍ Approve Selected Research Grant", deanTab);
    m_deanApproveGrantBtn->setStyleSheet("background-color: #10B981;");
    connect(m_deanApproveGrantBtn, &QPushButton::clicked, this, &ErpModule::approveResearchGrant);
    deanLayout->addWidget(m_deanApproveGrantBtn);
    
    // TensorFlow.js AI Forecasting panel
    QLabel* tfLabel = new QLabel("AI Enrollment Forecasting (TensorFlow Model):", deanTab);
    tfLabel->setStyleSheet("font-weight: bold; margin-top: 8px;");
    deanLayout->addWidget(tfLabel);
    m_deanTfProgress = new QProgressBar(deanTab);
    m_deanTfProgress->setValue(0);
    m_deanTfProgress->setFormat("Model: Untrained — %p%");
    deanLayout->addWidget(m_deanTfProgress);
    m_deanTfStatus = new QLabel("Status: Ready to train | Epochs: 150 | LR: 0.05", deanTab);
    m_deanTfStatus->setStyleSheet("font-size: 11px; color: #94A3B8;");
    deanLayout->addWidget(m_deanTfStatus);
    
    tabWidget->addTab(deanTab, "Dean Dashboard");
    
    // ==========================================
    // --- TAB 10: HOD CONSOLE ---
    // ==========================================
    QWidget* hodTab = new QWidget(this);
    QVBoxLayout* hodLayout = new QVBoxLayout(hodTab);
    hodLayout->setContentsMargins(10, 10, 10, 10);
    hodLayout->setSpacing(8);
    
    QLabel* hodTitle = new QLabel("📊 Head of Department Operations Console", hodTab);
    hodTitle->setStyleSheet("font-size: 14px; font-weight: bold;");
    hodLayout->addWidget(hodTitle);
    
    QHBoxLayout* hodFilter = new QHBoxLayout();
    QLabel* hodFilterLabel = new QLabel("Department:", hodTab);
    m_hodDeptFilter = new QComboBox(hodTab);
    m_hodDeptFilter->addItems({"Computer Science", "Electronics", "Mechanical", "Civil", "Mathematics", "Physics"});
    hodFilter->addWidget(hodFilterLabel);
    hodFilter->addWidget(m_hodDeptFilter, 1);
    hodFilter->addStretch();
    hodLayout->addLayout(hodFilter);
    
    QLabel* hodWlLabel = new QLabel("Faculty Course Workload Planner:", hodTab);
    hodWlLabel->setStyleSheet("font-weight: bold;");
    hodLayout->addWidget(hodWlLabel);
    
    m_hodWorkloadTable = new QTableWidget(hodTab);
    m_hodWorkloadTable->setColumnCount(5);
    m_hodWorkloadTable->setHorizontalHeaderLabels({"Faculty Name", "Courses Assigned", "Weekly Hours", "Student Count", "Workload Status"});
    m_hodWorkloadTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    m_hodWorkloadTable->insertRow(0);
    m_hodWorkloadTable->setItem(0, 0, new QTableWidgetItem("Prof. Marcus Chen"));
    m_hodWorkloadTable->setItem(0, 1, new QTableWidgetItem("CS202, CS301"));
    m_hodWorkloadTable->setItem(0, 2, new QTableWidgetItem("16"));
    m_hodWorkloadTable->setItem(0, 3, new QTableWidgetItem("120"));
    m_hodWorkloadTable->setItem(0, 4, new QTableWidgetItem("⚠ Heavy"));
    m_hodWorkloadTable->insertRow(1);
    m_hodWorkloadTable->setItem(1, 0, new QTableWidgetItem("Dr. Sarah Connor"));
    m_hodWorkloadTable->setItem(1, 1, new QTableWidgetItem("CS101"));
    m_hodWorkloadTable->setItem(1, 2, new QTableWidgetItem("8"));
    m_hodWorkloadTable->setItem(1, 3, new QTableWidgetItem("65"));
    m_hodWorkloadTable->setItem(1, 4, new QTableWidgetItem("✓ Normal"));
    hodLayout->addWidget(m_hodWorkloadTable);
    
    QLabel* hodEvalLabel = new QLabel("Faculty Evaluation Scores:", hodTab);
    hodEvalLabel->setStyleSheet("font-weight: bold; margin-top: 8px;");
    hodLayout->addWidget(hodEvalLabel);
    
    m_hodEvalTable = new QTableWidget(hodTab);
    m_hodEvalTable->setColumnCount(4);
    m_hodEvalTable->setHorizontalHeaderLabels({"Faculty Name", "Teaching Score", "Research Score", "Overall Rating"});
    m_hodEvalTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    m_hodEvalTable->insertRow(0);
    m_hodEvalTable->setItem(0, 0, new QTableWidgetItem("Prof. Marcus Chen"));
    m_hodEvalTable->setItem(0, 1, new QTableWidgetItem("4.8 / 5.0"));
    m_hodEvalTable->setItem(0, 2, new QTableWidgetItem("4.5 / 5.0"));
    m_hodEvalTable->setItem(0, 3, new QTableWidgetItem("4.65 / 5.0"));
    hodLayout->addWidget(m_hodEvalTable);
    
    QLabel* hodSylLabel = new QLabel("Syllabus Completion Tracker:", hodTab);
    hodSylLabel->setStyleSheet("font-weight: bold; margin-top: 8px;");
    hodLayout->addWidget(hodSylLabel);
    
    m_hodSyllabusTable = new QTableWidget(hodTab);
    m_hodSyllabusTable->setColumnCount(4);
    m_hodSyllabusTable->setHorizontalHeaderLabels({"Course Code", "Course Title", "Completion %", "Faculty"});
    m_hodSyllabusTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    m_hodSyllabusTable->insertRow(0);
    m_hodSyllabusTable->setItem(0, 0, new QTableWidgetItem("CS202"));
    m_hodSyllabusTable->setItem(0, 1, new QTableWidgetItem("Object Oriented Programming"));
    m_hodSyllabusTable->setItem(0, 2, new QTableWidgetItem("85%"));
    m_hodSyllabusTable->setItem(0, 3, new QTableWidgetItem("Prof. Marcus Chen"));
    hodLayout->addWidget(m_hodSyllabusTable);
    
    tabWidget->addTab(hodTab, "HOD Console");
    
    // ==========================================
    // --- TAB 11: ASSIGNMENTS ---
    // ==========================================
    QWidget* assignTab = new QWidget(this);
    QVBoxLayout* assignLayout = new QVBoxLayout(assignTab);
    assignLayout->setContentsMargins(10, 10, 10, 10);
    assignLayout->setSpacing(8);
    
    QLabel* assignTitle = new QLabel("📝 Assignments Management Console", assignTab);
    assignTitle->setStyleSheet("font-size: 14px; font-weight: bold;");
    assignLayout->addWidget(assignTitle);
    
    QLabel* assignFormLabel = new QLabel("Create New Assignment:", assignTab);
    assignFormLabel->setStyleSheet("font-weight: bold;");
    assignLayout->addWidget(assignFormLabel);
    
    QHBoxLayout* assignFormRow1 = new QHBoxLayout();
    m_assignTitle = new QLineEdit(assignTab);
    m_assignTitle->setPlaceholderText("Assignment Title...");
    m_assignCourseCombo = new QComboBox(assignTab);
    m_assignCourseCombo->addItems({"CS202 - OOP", "CS301 - DBMS", "CYBER401 - Network Security", "CS101 - Intro to CS"});
    assignFormRow1->addWidget(m_assignTitle, 2);
    assignFormRow1->addWidget(m_assignCourseCombo, 1);
    assignLayout->addLayout(assignFormRow1);
    
    m_assignDescription = new QTextEdit(assignTab);
    m_assignDescription->setPlaceholderText("Assignment description and instructions...");
    m_assignDescription->setMaximumHeight(80);
    assignLayout->addWidget(m_assignDescription);
    
    m_assignSubmitBtn = new QPushButton("Create Assignment", assignTab);
    m_assignSubmitBtn->setStyleSheet("background-color: #6366F1;");
    connect(m_assignSubmitBtn, &QPushButton::clicked, this, &ErpModule::submitAssignment);
    assignLayout->addWidget(m_assignSubmitBtn);
    
    QLabel* assignListLabel = new QLabel("Active Assignments:", assignTab);
    assignListLabel->setStyleSheet("font-weight: bold; margin-top: 8px;");
    assignLayout->addWidget(assignListLabel);
    
    m_assignTable = new QTableWidget(assignTab);
    m_assignTable->setColumnCount(5);
    m_assignTable->setHorizontalHeaderLabels({"Title", "Course", "Due Date", "Submissions", "Status"});
    m_assignTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    m_assignTable->insertRow(0);
    m_assignTable->setItem(0, 0, new QTableWidgetItem("Lab 5: Binary Trees"));
    m_assignTable->setItem(0, 1, new QTableWidgetItem("CS202 - OOP"));
    m_assignTable->setItem(0, 2, new QTableWidgetItem("2026-08-01"));
    m_assignTable->setItem(0, 3, new QTableWidgetItem("42 / 65"));
    m_assignTable->setItem(0, 4, new QTableWidgetItem("Open"));
    m_assignTable->insertRow(1);
    m_assignTable->setItem(1, 0, new QTableWidgetItem("Project: ER Diagram Design"));
    m_assignTable->setItem(1, 1, new QTableWidgetItem("CS301 - DBMS"));
    m_assignTable->setItem(1, 2, new QTableWidgetItem("2026-07-25"));
    m_assignTable->setItem(1, 3, new QTableWidgetItem("55 / 55"));
    m_assignTable->setItem(1, 4, new QTableWidgetItem("✓ Closed"));
    assignLayout->addWidget(m_assignTable);
    
    tabWidget->addTab(assignTab, "Assignments");
    
    // ==========================================
    // --- TAB 12: RESULTS ---
    // ==========================================
    QWidget* resultsTab = new QWidget(this);
    QVBoxLayout* resLayout = new QVBoxLayout(resultsTab);
    resLayout->setContentsMargins(10, 10, 10, 10);
    resLayout->setSpacing(8);
    
    QLabel* resTitle = new QLabel("📊 Semester Results Publication Console", resultsTab);
    resTitle->setStyleSheet("font-size: 14px; font-weight: bold;");
    resLayout->addWidget(resTitle);
    
    QHBoxLayout* resFilter = new QHBoxLayout();
    QLabel* resSemLabel = new QLabel("Semester:", resultsTab);
    m_resultsSemCombo = new QComboBox(resultsTab);
    m_resultsSemCombo->addItems({"Spring 2026", "Fall 2025", "Spring 2025", "Fall 2024"});
    m_avgGpaLabel = new QLabel("Avg GPA: 3.42 / 4.00", resultsTab);
    m_avgGpaLabel->setStyleSheet("font-weight: bold; padding: 6px; background-color: #1E293B; border-radius: 6px;");
    resFilter->addWidget(resSemLabel);
    resFilter->addWidget(m_resultsSemCombo, 1);
    resFilter->addWidget(m_avgGpaLabel);
    resLayout->addLayout(resFilter);
    
    m_resultsTable = new QTableWidget(resultsTab);
    m_resultsTable->setColumnCount(6);
    m_resultsTable->setHorizontalHeaderLabels({"Student ID", "Name", "Course", "Grade", "GPA", "Publication Status"});
    m_resultsTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    m_resultsTable->insertRow(0);
    m_resultsTable->setItem(0, 0, new QTableWidgetItem("usr_stu001"));
    m_resultsTable->setItem(0, 1, new QTableWidgetItem("Alex Rivera"));
    m_resultsTable->setItem(0, 2, new QTableWidgetItem("CS202"));
    m_resultsTable->setItem(0, 3, new QTableWidgetItem("A"));
    m_resultsTable->setItem(0, 4, new QTableWidgetItem("4.00"));
    m_resultsTable->setItem(0, 5, new QTableWidgetItem("✓ Published"));
    m_resultsTable->insertRow(1);
    m_resultsTable->setItem(1, 0, new QTableWidgetItem("usr_stu002"));
    m_resultsTable->setItem(1, 1, new QTableWidgetItem("Priya Sharma"));
    m_resultsTable->setItem(1, 2, new QTableWidgetItem("CS301"));
    m_resultsTable->setItem(1, 3, new QTableWidgetItem("A-"));
    m_resultsTable->setItem(1, 4, new QTableWidgetItem("3.70"));
    m_resultsTable->setItem(1, 5, new QTableWidgetItem("✓ Published"));
    m_resultsTable->insertRow(2);
    m_resultsTable->setItem(2, 0, new QTableWidgetItem("usr_stu003"));
    m_resultsTable->setItem(2, 1, new QTableWidgetItem("Jordan McKay"));
    m_resultsTable->setItem(2, 2, new QTableWidgetItem("CYBER401"));
    m_resultsTable->setItem(2, 3, new QTableWidgetItem("B+"));
    m_resultsTable->setItem(2, 4, new QTableWidgetItem("3.30"));
    m_resultsTable->setItem(2, 5, new QTableWidgetItem("Pending"));
    resLayout->addWidget(m_resultsTable);
    
    m_publishResultsBtn = new QPushButton("📢 Publish Semester Results", resultsTab);
    m_publishResultsBtn->setStyleSheet("background-color: #10B981;");
    connect(m_publishResultsBtn, &QPushButton::clicked, this, &ErpModule::publishResults);
    resLayout->addWidget(m_publishResultsBtn);
    
    tabWidget->addTab(resultsTab, "Results");
    
    mainLayout->addWidget(tabWidget);
}

void ErpModule::loadRosterData() {
    ApiClient::instance().fetchGet("/users", [this](bool success, const QJsonObject& response) {
        if (!success) {
            m_rosterTable->setRowCount(3);
            m_rosterTable->setItem(0, 0, new QTableWidgetItem("usr_001"));
            m_rosterTable->setItem(0, 1, new QTableWidgetItem("Dr. Evelyn Sterling"));
            m_rosterTable->setItem(0, 2, new QTableWidgetItem("CS"));
            m_rosterTable->setItem(0, 3, new QTableWidgetItem("admin"));
            
            m_rosterTable->setItem(1, 0, new QTableWidgetItem("usr_stu001"));
            m_rosterTable->setItem(1, 1, new QTableWidgetItem("Alex Rivera"));
            m_rosterTable->setItem(1, 2, new QTableWidgetItem("CS"));
            m_rosterTable->setItem(1, 3, new QTableWidgetItem("student"));
            
            m_rosterTable->setItem(2, 0, new QTableWidgetItem("usr_fac001"));
            m_rosterTable->setItem(2, 1, new QTableWidgetItem("Prof. Marcus Chen"));
            m_rosterTable->setItem(2, 2, new QTableWidgetItem("CS"));
            m_rosterTable->setItem(2, 3, new QTableWidgetItem("faculty"));
            return;
        }
        
        QJsonArray arr = response.value("users").toArray();
        m_rosterTable->setRowCount(arr.size());
        for (int i = 0; i < arr.size(); ++i) {
            QJsonObject user = arr.at(i).toObject();
            m_rosterTable->setItem(i, 0, new QTableWidgetItem(user.value("id").toString()));
            m_rosterTable->setItem(i, 1, new QTableWidgetItem(user.value("name").toString()));
            m_rosterTable->setItem(i, 2, new QTableWidgetItem(user.value("department").toString()));
            m_rosterTable->setItem(i, 3, new QTableWidgetItem(user.value("role").toString()));
        }
    });
}

void ErpModule::executeEnrollment() {
    QString studentId = m_regStudentInput->text().trimmed();
    if (studentId.isEmpty()) return;
    QString courseName = m_regCourseCombo->currentText();
    
    int row = m_regTable->rowCount();
    m_regTable->insertRow(row);
    m_regTable->setItem(row, 0, new QTableWidgetItem(studentId));
    m_regTable->setItem(row, 1, new QTableWidgetItem(courseName));
    m_regTable->setItem(row, 2, new QTableWidgetItem("✓ ACTIVE"));
    
    m_regStudentInput->clear();
}

void ErpModule::allocateFaculty() {
    QString facultyName = m_allocFacultyCombo->currentText();
    QString courseCode = m_allocCourseCombo->currentText();
    
    int row = m_allocTable->rowCount();
    m_allocTable->insertRow(row);
    m_allocTable->setItem(row, 0, new QTableWidgetItem(facultyName));
    m_allocTable->setItem(row, 1, new QTableWidgetItem(courseCode));
    m_allocTable->setItem(row, 2, new QTableWidgetItem("6 Hours / Week"));
}

void ErpModule::allocateExamHall() {
    QString hall = m_examHallInput->text().trimmed();
    if (hall.isEmpty()) return;
    QString course = m_examCourseCombo->currentText();
    
    int row = m_examsTable->rowCount();
    m_examsTable->insertRow(row);
    m_examsTable->setItem(row, 0, new QTableWidgetItem(course));
    m_examsTable->setItem(row, 1, new QTableWidgetItem(hall));
    m_examsTable->setItem(row, 2, new QTableWidgetItem("Prof. Marcus Chen"));
    
    m_examHallInput->clear();
}

void ErpModule::approveCourseGrades() {
    m_approveBtn->setEnabled(false);
    m_approveBtn->setText("Signing active grade rosters on-chain...");
    
    QJsonObject payload;
    payload["batchCode"] = "2026-CS-OOP";
    payload["signee"] = "Dean Evelyn Sterling";
    
    ApiClient::instance().fetchPost("/chain/verify", payload, [this](bool success, const QJsonObject& res) {
        m_approveBtn->setText("✓ Rosters Signed & Authorized");
        m_approveBtn->setStyleSheet("background-color: #10B981;");
        m_approvalsTable->setItem(0, 3, new QTableWidgetItem("✓ SIGNED & ANCHORED"));
    });
}

void ErpModule::executeAttendanceLock() {
    m_lockButton->setEnabled(false);
    m_lockButton->setText("Locking class attendances...");
    
    QJsonObject payload;
    payload["courseCode"] = "CS202";
    payload["date"] = "2026-07-15";
    
    ApiClient::instance().fetchPost("/attendance/lock", payload, [this](bool success, const QJsonObject& res) {
        m_lockButton->setText("✓ Roster Locked Successfully");
        m_lockButton->setStyleSheet("background-color: #10B981;");
    });
}

void ErpModule::executeDegreeMint() {
    m_mintButton->setEnabled(false);
    m_mintButton->setText("Anchoring SBT credential metadata on-chain...");
    
    QJsonObject payload;
    payload["studentId"] = "usr_stu001";
    payload["degree"] = "Bachelor of Science";
    
    ApiClient::instance().fetchPost("/chain/verify", payload, [this](bool success, const QJsonObject& res) {
        m_mintButton->setText("🎓 Mint SBT Degree Certificate");
        m_mintButton->setEnabled(true);
        
        int r = m_mintLogsTable->rowCount();
        m_mintLogsTable->insertRow(r);
        m_mintLogsTable->setItem(r, 0, new QTableWidgetItem("usr_stu001"));
        m_mintLogsTable->setItem(r, 1, new QTableWidgetItem("Bachelor of Science (Computer Science)"));
        m_mintLogsTable->setItem(r, 2, new QTableWidgetItem("✓ ANCHORED (Block #9,401,923)"));
    });
}

void ErpModule::refreshAdminDashboard() {
    ApiClient::instance().fetchGet("/users", [this](bool success, const QJsonObject& response) {
        if (success) {
            int count = response.value("users").toArray().size();
            m_adminStudentCount->setText(QString::number(count));
        }
    });
}

void ErpModule::refreshRegistrarData() {
    ApiClient::instance().fetchGet("/admissions/applications", [this](bool success, const QJsonObject& response) {
        if (!success) return;
        QJsonArray apps = response.value("applications").toArray();
        m_registrarEnrollTable->setRowCount(apps.size());
        for (int i = 0; i < apps.size(); ++i) {
            QJsonObject app = apps.at(i).toObject();
            m_registrarEnrollTable->setItem(i, 0, new QTableWidgetItem(app.value("id").toString()));
            m_registrarEnrollTable->setItem(i, 1, new QTableWidgetItem(app.value("name").toString()));
            m_registrarEnrollTable->setItem(i, 2, new QTableWidgetItem(app.value("program").toString()));
            m_registrarEnrollTable->setItem(i, 3, new QTableWidgetItem(app.value("semester").toString()));
            m_registrarEnrollTable->setItem(i, 4, new QTableWidgetItem(app.value("status").toString()));
        }
    });
}

void ErpModule::refreshDeanData() {
    // Fetch faculty data for dean dashboard
    ApiClient::instance().fetchGet("/users", [this](bool success, const QJsonObject& response) {
        if (!success) return;
        QJsonArray users = response.value("users").toArray();
        int facCount = 0;
        m_deanFacultyTable->setRowCount(0);
        for (int i = 0; i < users.size(); ++i) {
            QJsonObject u = users.at(i).toObject();
            if (u.value("role").toString() == "faculty") {
                int row = m_deanFacultyTable->rowCount();
                m_deanFacultyTable->insertRow(row);
                m_deanFacultyTable->setItem(row, 0, new QTableWidgetItem(u.value("id").toString()));
                m_deanFacultyTable->setItem(row, 1, new QTableWidgetItem(u.value("name").toString()));
                m_deanFacultyTable->setItem(row, 2, new QTableWidgetItem(u.value("department").toString()));
                m_deanFacultyTable->setItem(row, 3, new QTableWidgetItem("Professor"));
                m_deanFacultyTable->setItem(row, 4, new QTableWidgetItem("12"));
                m_deanFacultyTable->setItem(row, 5, new QTableWidgetItem("4.5 / 5.0"));
                facCount++;
            }
        }
    });
}

void ErpModule::refreshHodData() {
    // Refresh HOD workload data from API
    refreshDeanData();
}

void ErpModule::submitAssignment() {
    QString title = m_assignTitle->text().trimmed();
    if (title.isEmpty()) return;
    QString course = m_assignCourseCombo->currentText();
    
    int row = m_assignTable->rowCount();
    m_assignTable->insertRow(row);
    m_assignTable->setItem(row, 0, new QTableWidgetItem(title));
    m_assignTable->setItem(row, 1, new QTableWidgetItem(course));
    m_assignTable->setItem(row, 2, new QTableWidgetItem(QDateTime::currentDateTime().addDays(14).toString("yyyy-MM-dd")));
    m_assignTable->setItem(row, 3, new QTableWidgetItem("0 / 65"));
    m_assignTable->setItem(row, 4, new QTableWidgetItem("Open"));
    
    m_assignTitle->clear();
    m_assignDescription->clear();
}

void ErpModule::publishResults() {
    m_publishResultsBtn->setEnabled(false);
    m_publishResultsBtn->setText("Publishing semester results...");
    
    // Mark all pending results as published
    for (int i = 0; i < m_resultsTable->rowCount(); ++i) {
        QTableWidgetItem* statusItem = m_resultsTable->item(i, 5);
        if (statusItem && statusItem->text() == "Pending") {
            statusItem->setText("✓ Published");
        }
    }
    
    m_publishResultsBtn->setText("✓ Results Published Successfully");
    m_publishResultsBtn->setStyleSheet("background-color: #6366F1;");
}

void ErpModule::approveResearchGrant() {
    int currentRow = m_deanGrantsTable->currentRow();
    if (currentRow < 0) return;
    
    QTableWidgetItem* statusItem = m_deanGrantsTable->item(currentRow, 4);
    if (statusItem) {
        statusItem->setText("✓ Approved by Dean");
    }
}
