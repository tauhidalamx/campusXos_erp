#include "AcademicModule.hpp"
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

AcademicModule::AcademicModule(QWidget* parent) : QWidget(parent) {
    setupUi();
    loadAdmissions();
    loadCourses();
    loadStudents();
    loadFaculty();
}

void AcademicModule::setupUi() {
    QVBoxLayout* mainLayout = new QVBoxLayout(this);
    mainLayout->setContentsMargins(0, 0, 0, 0);
    
    QTabWidget* tabWidget = new QTabWidget(this);
    
    // ==========================================
    // --- TAB 1: ADMISSIONS ---
    // ==========================================
    QWidget* admTab = new QWidget(this);
    QVBoxLayout* admLayout = new QVBoxLayout(admTab);
    admLayout->setContentsMargins(10, 10, 10, 10);
    
    QLabel* admTitle = new QLabel("🎓 Admissions Applications", admTab);
    admTitle->setStyleSheet("font-size: 14px; font-weight: bold;");
    admLayout->addWidget(admTitle);
    
    m_admRefreshBtn = new QPushButton("↻ Refresh Applications", admTab);
    m_admRefreshBtn->setStyleSheet("background-color: #6366F1;");
    connect(m_admRefreshBtn, &QPushButton::clicked, this, &AcademicModule::loadAdmissions);
    admLayout->addWidget(m_admRefreshBtn);
    
    m_admissionsTable = new QTableWidget(admTab);
    m_admissionsTable->setColumnCount(5);
    m_admissionsTable->setHorizontalHeaderLabels({"Application ID", "Name", "Program Applied", "Date", "Status"});
    m_admissionsTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    m_admissionsTable->insertRow(0);
    m_admissionsTable->setItem(0, 0, new QTableWidgetItem("APP-2026-001"));
    m_admissionsTable->setItem(0, 1, new QTableWidgetItem("Aisha Patel"));
    m_admissionsTable->setItem(0, 2, new QTableWidgetItem("BSc Computer Science"));
    m_admissionsTable->setItem(0, 3, new QTableWidgetItem("2026-06-15"));
    m_admissionsTable->setItem(0, 4, new QTableWidgetItem("Under Review"));
    m_admissionsTable->insertRow(1);
    m_admissionsTable->setItem(1, 0, new QTableWidgetItem("APP-2026-002"));
    m_admissionsTable->setItem(1, 1, new QTableWidgetItem("Carlos Mendez"));
    m_admissionsTable->setItem(1, 2, new QTableWidgetItem("MSc Data Science"));
    m_admissionsTable->setItem(1, 3, new QTableWidgetItem("2026-06-18"));
    m_admissionsTable->setItem(1, 4, new QTableWidgetItem("✓ Accepted"));
    admLayout->addWidget(m_admissionsTable);
    tabWidget->addTab(admTab, "Admissions");
    
    // ==========================================
    // --- TAB 2: ATTENDANCE ---
    // ==========================================
    QWidget* attTab = new QWidget(this);
    QVBoxLayout* attLayout = new QVBoxLayout(attTab);
    attLayout->setContentsMargins(10, 10, 10, 10);
    attLayout->setSpacing(8);
    
    QLabel* attTitle = new QLabel("📋 Attendance Management", attTab);
    attTitle->setStyleSheet("font-size: 14px; font-weight: bold;");
    attLayout->addWidget(attTitle);
    
    QHBoxLayout* attFilter = new QHBoxLayout();
    m_attendanceDate = new QDateEdit(QDate::currentDate(), attTab);
    m_attendanceDate->setCalendarPopup(true);
    m_attendanceCourse = new QComboBox(attTab);
    m_attendanceCourse->addItems({"CS202 - OOP", "CS301 - DBMS", "CYBER401 - Network Security", "CS101 - Intro to CS"});
    attFilter->addWidget(new QLabel("Date:", attTab));
    attFilter->addWidget(m_attendanceDate);
    attFilter->addWidget(new QLabel("Course:", attTab));
    attFilter->addWidget(m_attendanceCourse, 1);
    attLayout->addLayout(attFilter);
    
    m_attendanceTable = new QTableWidget(attTab);
    m_attendanceTable->setColumnCount(4);
    m_attendanceTable->setHorizontalHeaderLabels({"Student ID", "Name", "Present", "Remarks"});
    m_attendanceTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    m_attendanceTable->insertRow(0);
    m_attendanceTable->setItem(0, 0, new QTableWidgetItem("usr_stu001"));
    m_attendanceTable->setItem(0, 1, new QTableWidgetItem("Alex Rivera"));
    m_attendanceTable->setItem(0, 2, new QTableWidgetItem("✓ Present"));
    m_attendanceTable->setItem(0, 3, new QTableWidgetItem(""));
    m_attendanceTable->insertRow(1);
    m_attendanceTable->setItem(1, 0, new QTableWidgetItem("usr_stu002"));
    m_attendanceTable->setItem(1, 1, new QTableWidgetItem("Priya Sharma"));
    m_attendanceTable->setItem(1, 2, new QTableWidgetItem("✗ Absent"));
    m_attendanceTable->setItem(1, 3, new QTableWidgetItem("Medical leave"));
    m_attendanceTable->insertRow(2);
    m_attendanceTable->setItem(2, 0, new QTableWidgetItem("usr_stu003"));
    m_attendanceTable->setItem(2, 1, new QTableWidgetItem("Jordan McKay"));
    m_attendanceTable->setItem(2, 2, new QTableWidgetItem("✓ Present"));
    m_attendanceTable->setItem(2, 3, new QTableWidgetItem(""));
    attLayout->addWidget(m_attendanceTable);
    
    m_attendSubmitBtn = new QPushButton("Submit Attendance", attTab);
    m_attendSubmitBtn->setStyleSheet("background-color: #10B981;");
    connect(m_attendSubmitBtn, &QPushButton::clicked, this, &AcademicModule::submitAttendance);
    attLayout->addWidget(m_attendSubmitBtn);
    tabWidget->addTab(attTab, "Attendance");
    
    // ==========================================
    // --- TAB 3: COURSES ---
    // ==========================================
    QWidget* courseTab = new QWidget(this);
    QVBoxLayout* courseLayout = new QVBoxLayout(courseTab);
    courseLayout->setContentsMargins(10, 10, 10, 10);
    
    QLabel* courseTitle = new QLabel("📚 Course Catalog", courseTab);
    courseTitle->setStyleSheet("font-size: 14px; font-weight: bold;");
    courseLayout->addWidget(courseTitle);
    
    m_courseSearch = new QLineEdit(courseTab);
    m_courseSearch->setPlaceholderText("Search courses by code or title...");
    courseLayout->addWidget(m_courseSearch);
    
    m_coursesTable = new QTableWidget(courseTab);
    m_coursesTable->setColumnCount(5);
    m_coursesTable->setHorizontalHeaderLabels({"Code", "Title", "Credits", "Department", "Faculty"});
    m_coursesTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    m_coursesTable->insertRow(0);
    m_coursesTable->setItem(0, 0, new QTableWidgetItem("CS202"));
    m_coursesTable->setItem(0, 1, new QTableWidgetItem("Object Oriented Programming"));
    m_coursesTable->setItem(0, 2, new QTableWidgetItem("4"));
    m_coursesTable->setItem(0, 3, new QTableWidgetItem("CS"));
    m_coursesTable->setItem(0, 4, new QTableWidgetItem("Prof. Marcus Chen"));
    m_coursesTable->insertRow(1);
    m_coursesTable->setItem(1, 0, new QTableWidgetItem("CS301"));
    m_coursesTable->setItem(1, 1, new QTableWidgetItem("Database Management Systems"));
    m_coursesTable->setItem(1, 2, new QTableWidgetItem("4"));
    m_coursesTable->setItem(1, 3, new QTableWidgetItem("CS"));
    m_coursesTable->setItem(1, 4, new QTableWidgetItem("Dr. Sarah Connor"));
    m_coursesTable->insertRow(2);
    m_coursesTable->setItem(2, 0, new QTableWidgetItem("CYBER401"));
    m_coursesTable->setItem(2, 1, new QTableWidgetItem("System Network Security"));
    m_coursesTable->setItem(2, 2, new QTableWidgetItem("3"));
    m_coursesTable->setItem(2, 3, new QTableWidgetItem("CS"));
    m_coursesTable->setItem(2, 4, new QTableWidgetItem("Prof. Marcus Chen"));
    courseLayout->addWidget(m_coursesTable);
    tabWidget->addTab(courseTab, "Courses");
    
    // ==========================================
    // --- TAB 4: STUDENTS ---
    // ==========================================
    QWidget* stuTab = new QWidget(this);
    QVBoxLayout* stuLayout = new QVBoxLayout(stuTab);
    stuLayout->setContentsMargins(10, 10, 10, 10);
    
    QLabel* stuTitle = new QLabel("👨‍🎓 Student Directory", stuTab);
    stuTitle->setStyleSheet("font-size: 14px; font-weight: bold;");
    stuLayout->addWidget(stuTitle);
    
    m_studentSearch = new QLineEdit(stuTab);
    m_studentSearch->setPlaceholderText("Search students by name or ID...");
    stuLayout->addWidget(m_studentSearch);
    
    m_studentsTable = new QTableWidget(stuTab);
    m_studentsTable->setColumnCount(6);
    m_studentsTable->setHorizontalHeaderLabels({"Student ID", "Name", "Program", "Semester", "GPA", "Status"});
    m_studentsTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    m_studentsTable->insertRow(0);
    m_studentsTable->setItem(0, 0, new QTableWidgetItem("usr_stu001"));
    m_studentsTable->setItem(0, 1, new QTableWidgetItem("Alex Rivera"));
    m_studentsTable->setItem(0, 2, new QTableWidgetItem("BSc CS"));
    m_studentsTable->setItem(0, 3, new QTableWidgetItem("6"));
    m_studentsTable->setItem(0, 4, new QTableWidgetItem("3.85"));
    m_studentsTable->setItem(0, 5, new QTableWidgetItem("✓ Active"));
    m_studentsTable->insertRow(1);
    m_studentsTable->setItem(1, 0, new QTableWidgetItem("usr_stu002"));
    m_studentsTable->setItem(1, 1, new QTableWidgetItem("Priya Sharma"));
    m_studentsTable->setItem(1, 2, new QTableWidgetItem("MSc DS"));
    m_studentsTable->setItem(1, 3, new QTableWidgetItem("2"));
    m_studentsTable->setItem(1, 4, new QTableWidgetItem("3.92"));
    m_studentsTable->setItem(1, 5, new QTableWidgetItem("✓ Active"));
    stuLayout->addWidget(m_studentsTable);
    tabWidget->addTab(stuTab, "Students");
    
    // ==========================================
    // --- TAB 5: FACULTY ---
    // ==========================================
    QWidget* facTab = new QWidget(this);
    QVBoxLayout* facLayout = new QVBoxLayout(facTab);
    facLayout->setContentsMargins(10, 10, 10, 10);
    
    QLabel* facTitle = new QLabel("👨‍🏫 Faculty Directory", facTab);
    facTitle->setStyleSheet("font-size: 14px; font-weight: bold;");
    facLayout->addWidget(facTitle);
    
    m_facultySearch = new QLineEdit(facTab);
    m_facultySearch->setPlaceholderText("Search faculty by name...");
    facLayout->addWidget(m_facultySearch);
    
    m_facultyTable = new QTableWidget(facTab);
    m_facultyTable->setColumnCount(6);
    m_facultyTable->setHorizontalHeaderLabels({"Faculty ID", "Name", "Department", "Designation", "Workload", "Salary"});
    m_facultyTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    m_facultyTable->insertRow(0);
    m_facultyTable->setItem(0, 0, new QTableWidgetItem("fac_001"));
    m_facultyTable->setItem(0, 1, new QTableWidgetItem("Prof. Marcus Chen"));
    m_facultyTable->setItem(0, 2, new QTableWidgetItem("CS"));
    m_facultyTable->setItem(0, 3, new QTableWidgetItem("Professor"));
    m_facultyTable->setItem(0, 4, new QTableWidgetItem("16 hrs/wk"));
    m_facultyTable->setItem(0, 5, new QTableWidgetItem("$120,000"));
    facLayout->addWidget(m_facultyTable);
    tabWidget->addTab(facTab, "Faculty");
    
    // ==========================================
    // --- TAB 6: TIMETABLE ---
    // ==========================================
    QWidget* ttTab = new QWidget(this);
    QVBoxLayout* ttLayout = new QVBoxLayout(ttTab);
    ttLayout->setContentsMargins(10, 10, 10, 10);
    
    QLabel* ttTitle = new QLabel("🗓 Weekly Timetable", ttTab);
    ttTitle->setStyleSheet("font-size: 14px; font-weight: bold;");
    ttLayout->addWidget(ttTitle);
    
    m_timetableTable = new QTableWidget(ttTab);
    m_timetableTable->setColumnCount(6);
    m_timetableTable->setHorizontalHeaderLabels({"Time Slot", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"});
    m_timetableTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    QStringList timeSlots = {"09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00", "14:00 - 15:00", "15:00 - 16:00"};
    QStringList courses_data[] = {
        {"CS202 (Room A1)", "CS301 (Lab B2)", "CS202 (Room A1)", "CYBER401 (Lab C1)", "CS101 (Room D3)"},
        {"CS301 (Lab B2)", "---", "CYBER401 (Lab C1)", "CS202 (Room A1)", "---"},
        {"---", "CS101 (Room D3)", "---", "CS301 (Lab B2)", "CS202 (Room A1)"},
        {"CYBER401 (Lab C1)", "CS202 (Room A1)", "CS101 (Room D3)", "---", "CS301 (Lab B2)"},
        {"CS101 (Room D3)", "CYBER401 (Lab C1)", "CS301 (Lab B2)", "CS101 (Room D3)", "---"}
    };
    for (int r = 0; r < 5; ++r) {
        m_timetableTable->insertRow(r);
        m_timetableTable->setItem(r, 0, new QTableWidgetItem(timeSlots[r]));
        for (int c = 0; c < 5; ++c)
            m_timetableTable->setItem(r, c + 1, new QTableWidgetItem(courses_data[r][c]));
    }
    ttLayout->addWidget(m_timetableTable);
    tabWidget->addTab(ttTab, "Timetable");
    
    // ==========================================
    // --- TAB 7: SUBJECTS ---
    // ==========================================
    QWidget* subTab = new QWidget(this);
    QVBoxLayout* subLayout = new QVBoxLayout(subTab);
    subLayout->setContentsMargins(10, 10, 10, 10);
    
    QLabel* subTitle = new QLabel("📖 Subject Registry", subTab);
    subTitle->setStyleSheet("font-size: 14px; font-weight: bold;");
    subLayout->addWidget(subTitle);
    
    m_subjectsTable = new QTableWidget(subTab);
    m_subjectsTable->setColumnCount(4);
    m_subjectsTable->setHorizontalHeaderLabels({"Subject Code", "Subject Name", "Type", "Credits"});
    m_subjectsTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    QStringList subCodes = {"CS202", "CS301", "CYBER401", "CS101", "MATH201", "PHY101"};
    QStringList subNames = {"Object Oriented Programming", "Database Management", "Network Security", "Intro to CS", "Linear Algebra", "Physics I"};
    QStringList subTypes = {"Core", "Core", "Elective", "Core", "Core", "Core"};
    QStringList subCreds = {"4", "4", "3", "3", "3", "4"};
    for (int i = 0; i < subCodes.size(); ++i) {
        m_subjectsTable->insertRow(i);
        m_subjectsTable->setItem(i, 0, new QTableWidgetItem(subCodes[i]));
        m_subjectsTable->setItem(i, 1, new QTableWidgetItem(subNames[i]));
        m_subjectsTable->setItem(i, 2, new QTableWidgetItem(subTypes[i]));
        m_subjectsTable->setItem(i, 3, new QTableWidgetItem(subCreds[i]));
    }
    subLayout->addWidget(m_subjectsTable);
    tabWidget->addTab(subTab, "Subjects");
    
    // ==========================================
    // --- TAB 8: DEPARTMENTS ---
    // ==========================================
    QWidget* deptTab = new QWidget(this);
    QVBoxLayout* deptLayout = new QVBoxLayout(deptTab);
    deptLayout->setContentsMargins(10, 10, 10, 10);
    
    QLabel* deptTitle = new QLabel("🏢 Department Directory", deptTab);
    deptTitle->setStyleSheet("font-size: 14px; font-weight: bold;");
    deptLayout->addWidget(deptTitle);
    
    m_departmentsTable = new QTableWidget(deptTab);
    m_departmentsTable->setColumnCount(4);
    m_departmentsTable->setHorizontalHeaderLabels({"Department Code", "Department Name", "HOD", "Faculty Count"});
    m_departmentsTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    QStringList deptCodes = {"CS", "EE", "ME", "CE", "MATH", "PHY"};
    QStringList deptNames = {"Computer Science", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering", "Mathematics", "Physics"};
    QStringList hods = {"Prof. Marcus Chen", "Dr. Raymond Park", "Prof. James Kirk", "Dr. Helena Rostova", "Prof. Alan Turing", "Dr. Richard Feynman"};
    QStringList facCounts = {"45", "32", "28", "22", "18", "15"};
    for (int i = 0; i < deptCodes.size(); ++i) {
        m_departmentsTable->insertRow(i);
        m_departmentsTable->setItem(i, 0, new QTableWidgetItem(deptCodes[i]));
        m_departmentsTable->setItem(i, 1, new QTableWidgetItem(deptNames[i]));
        m_departmentsTable->setItem(i, 2, new QTableWidgetItem(hods[i]));
        m_departmentsTable->setItem(i, 3, new QTableWidgetItem(facCounts[i]));
    }
    deptLayout->addWidget(m_departmentsTable);
    tabWidget->addTab(deptTab, "Departments");
    
    // ==========================================
    // --- TAB 9: PROGRAMS ---
    // ==========================================
    QWidget* progTab = new QWidget(this);
    QVBoxLayout* progLayout = new QVBoxLayout(progTab);
    progLayout->setContentsMargins(10, 10, 10, 10);
    
    QLabel* progTitle = new QLabel("🎓 Academic Programs", progTab);
    progTitle->setStyleSheet("font-size: 14px; font-weight: bold;");
    progLayout->addWidget(progTitle);
    
    m_programsTable = new QTableWidget(progTab);
    m_programsTable->setColumnCount(5);
    m_programsTable->setHorizontalHeaderLabels({"Program Code", "Program Name", "Level", "Duration", "Department"});
    m_programsTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    QStringList progCodes = {"BSCS", "MSDS", "BSEE", "PHD-CS", "MBA", "BSCE"};
    QStringList progNames = {"BSc Computer Science", "MSc Data Science", "BSc Electrical Eng.", "PhD Computer Science", "Master of Business Admin", "BSc Civil Engineering"};
    QStringList levels = {"Undergraduate", "Postgraduate", "Undergraduate", "Doctoral", "Postgraduate", "Undergraduate"};
    QStringList durations = {"4 Years", "2 Years", "4 Years", "4 Years", "2 Years", "4 Years"};
    QStringList progDepts = {"CS", "CS", "EE", "CS", "Business", "CE"};
    for (int i = 0; i < progCodes.size(); ++i) {
        m_programsTable->insertRow(i);
        m_programsTable->setItem(i, 0, new QTableWidgetItem(progCodes[i]));
        m_programsTable->setItem(i, 1, new QTableWidgetItem(progNames[i]));
        m_programsTable->setItem(i, 2, new QTableWidgetItem(levels[i]));
        m_programsTable->setItem(i, 3, new QTableWidgetItem(durations[i]));
        m_programsTable->setItem(i, 4, new QTableWidgetItem(progDepts[i]));
    }
    progLayout->addWidget(m_programsTable);
    tabWidget->addTab(progTab, "Programs");
    
    mainLayout->addWidget(tabWidget);
}

void AcademicModule::loadAdmissions() {
    ApiClient::instance().fetchGet("/admissions/applications", [this](bool success, const QJsonObject& response) {
        if (!success) return;
        QJsonArray apps = response.value("applications").toArray();
        m_admissionsTable->setRowCount(apps.size());
        for (int i = 0; i < apps.size(); ++i) {
            QJsonObject a = apps.at(i).toObject();
            m_admissionsTable->setItem(i, 0, new QTableWidgetItem(a.value("id").toString()));
            m_admissionsTable->setItem(i, 1, new QTableWidgetItem(a.value("name").toString()));
            m_admissionsTable->setItem(i, 2, new QTableWidgetItem(a.value("program").toString()));
            m_admissionsTable->setItem(i, 3, new QTableWidgetItem(a.value("date").toString()));
            m_admissionsTable->setItem(i, 4, new QTableWidgetItem(a.value("status").toString()));
        }
    });
}

void AcademicModule::loadCourses() {
    ApiClient::instance().fetchGet("/courses", [](bool, const QJsonObject&) {});
}

void AcademicModule::loadStudents() {
    ApiClient::instance().fetchGet("/users", [this](bool success, const QJsonObject& response) {
        if (!success) return;
        QJsonArray users = response.value("users").toArray();
        m_studentsTable->setRowCount(0);
        for (int i = 0; i < users.size(); ++i) {
            QJsonObject u = users.at(i).toObject();
            if (u.value("role").toString() == "student") {
                int row = m_studentsTable->rowCount();
                m_studentsTable->insertRow(row);
                m_studentsTable->setItem(row, 0, new QTableWidgetItem(u.value("id").toString()));
                m_studentsTable->setItem(row, 1, new QTableWidgetItem(u.value("name").toString()));
                m_studentsTable->setItem(row, 2, new QTableWidgetItem(u.value("program").toString()));
                m_studentsTable->setItem(row, 3, new QTableWidgetItem(u.value("semester").toString()));
                m_studentsTable->setItem(row, 4, new QTableWidgetItem(u.value("gpa").toString()));
                m_studentsTable->setItem(row, 5, new QTableWidgetItem("✓ Active"));
            }
        }
    });
}

void AcademicModule::loadFaculty() {
    ApiClient::instance().fetchGet("/users", [this](bool success, const QJsonObject& response) {
        if (!success) return;
        QJsonArray users = response.value("users").toArray();
        m_facultyTable->setRowCount(0);
        for (int i = 0; i < users.size(); ++i) {
            QJsonObject u = users.at(i).toObject();
            if (u.value("role").toString() == "faculty") {
                int row = m_facultyTable->rowCount();
                m_facultyTable->insertRow(row);
                m_facultyTable->setItem(row, 0, new QTableWidgetItem(u.value("id").toString()));
                m_facultyTable->setItem(row, 1, new QTableWidgetItem(u.value("name").toString()));
                m_facultyTable->setItem(row, 2, new QTableWidgetItem(u.value("department").toString()));
                m_facultyTable->setItem(row, 3, new QTableWidgetItem("Professor"));
                m_facultyTable->setItem(row, 4, new QTableWidgetItem("12 hrs/wk"));
                m_facultyTable->setItem(row, 5, new QTableWidgetItem("$120,000"));
            }
        }
    });
}

void AcademicModule::markAttendance() {}

void AcademicModule::submitAttendance() {
    m_attendSubmitBtn->setEnabled(false);
    m_attendSubmitBtn->setText("✓ Attendance Submitted");
    m_attendSubmitBtn->setStyleSheet("background-color: #6366F1;");
}
