#include "RoleDashboards.hpp"
#include "AnimationEngine.hpp"
#include <QVBoxLayout>
#include <QHBoxLayout>
#include <QHeaderView>
#include <QLabel>
#include <QTimer>
#include <QProgressBar>
#include <QSlider>
#include <QGroupBox>

RoleDashboards::RoleDashboards(QWidget* parent) : QWidget(parent) { setupUi(); }

void RoleDashboards::setupUi() {
    QVBoxLayout* mainLayout = new QVBoxLayout(this);
    mainLayout->setContentsMargins(10, 10, 10, 10);
    mainLayout->setSpacing(8);
    
    QHBoxLayout* topBar = new QHBoxLayout();
    QLabel* selectorLabel = new QLabel("Select Active Dashboard Role:", this);
    selectorLabel->setStyleSheet("font-weight: bold; color: #94A3B8; font-size: 12px;");
    
    m_roleSelector = new QComboBox(this);
    m_roleSelector->addItems({
        "Student Dashboard",
        "Student Fee Payments",
        "Faculty Dashboard",
        "Parent Dashboard",
        "Alumni Network",
        "Recruiter Dashboard",
        "Finance Manager Dashboard",
        "Placement Officer Dashboard",
        "Research Coordinator Dashboard"
    });
    m_roleSelector->setStyleSheet("QComboBox { background-color: #1E293B; color: #F8FAFC; border: 1px solid #475569; padding: 5px; border-radius: 4px; font-size: 11px; }");
    
    topBar->addWidget(selectorLabel);
    topBar->addWidget(m_roleSelector);
    topBar->addStretch();
    mainLayout->addLayout(topBar);

    m_stack = new QStackedWidget(this);
    m_stack->addWidget(createStudentDashboard());   // 0
    m_stack->addWidget(createStudentPayments());     // 1
    m_stack->addWidget(createFacultyDashboard());    // 2
    m_stack->addWidget(createParentDashboard());     // 3
    m_stack->addWidget(createAlumniDashboard());     // 4
    m_stack->addWidget(createRecruiterDashboard());  // 5
    m_stack->addWidget(createFinanceDashboard());    // 6
    m_stack->addWidget(createPlacementDashboard());  // 7
    m_stack->addWidget(createResearchDashboard());   // 8
    mainLayout->addWidget(m_stack);
    
    connect(m_roleSelector, QOverload<int>::of(&QComboBox::currentIndexChanged), this, [this](int index) {
        m_stack->setCurrentIndex(index);
        QWidget* activeWidget = m_stack->currentWidget();
        if (activeWidget) {
            AnimationEngine::instance().fadeIn(activeWidget, 250);
        }
    });
}

void RoleDashboards::setRole(const QString& role) {
    int index = 0;
    if (role == "student") index = 0;
    else if (role == "student_payments") index = 1;
    else if (role == "faculty") index = 2;
    else if (role == "parent") index = 3;
    else if (role == "alumni") index = 4;
    else if (role == "recruiter") index = 5;
    else if (role == "finance_manager") index = 6;
    else if (role == "placement_officer") index = 7;
    else if (role == "research_coordinator") index = 8;
    
    if (m_roleSelector) {
        m_roleSelector->setCurrentIndex(index);
    }
    m_stack->setCurrentIndex(index);
}

// Helper to create KPI card
static QGroupBox* makeKpi(QWidget* parent, const QString& label, const QString& value, const QString& color) {
    QGroupBox* box = new QGroupBox(parent);
    box->setStyleSheet(QString("QGroupBox { background-color: %1; border-radius: 8px; padding: 12px; }").arg(color));
    QVBoxLayout* bl = new QVBoxLayout(box);
    QLabel* vl = new QLabel(value, box);
    vl->setStyleSheet("font-size: 20px; font-weight: bold; color: white;");
    vl->setAlignment(Qt::AlignCenter);
    QLabel* ll = new QLabel(label, box);
    ll->setStyleSheet("font-size: 11px; color: #E0E0E0;");
    ll->setAlignment(Qt::AlignCenter);
    bl->addWidget(vl); bl->addWidget(ll);
    return box;
}

// Helper to create a native bar chart in C++
static QWidget* createBarChartWidget(QWidget* parent, const QStringList& labels, const QList<int>& values, const QString& color) {
    QWidget* chart = new QWidget(parent);
    QHBoxLayout* l = new QHBoxLayout(chart);
    l->setContentsMargins(0, 5, 0, 5);
    l->setSpacing(10);
    for(int i = 0; i < values.size() && i < labels.size(); ++i) {
        QVBoxLayout* barCol = new QVBoxLayout();
        barCol->setSpacing(2);
        
        QProgressBar* bar = new QProgressBar(chart);
        bar->setOrientation(Qt::Vertical);
        bar->setRange(0, 100);
        bar->setValue(values[i]);
        bar->setTextVisible(false);
        bar->setStyleSheet(QString("QProgressBar { background-color: #334155; border: none; border-radius: 4px; } QProgressBar::chunk { background-color: %1; border-radius: 4px; }").arg(color));
        bar->setFixedHeight(120);
        
        QLabel* valLbl = new QLabel(QString::number(values[i]), chart);
        valLbl->setStyleSheet("font-size: 8px; color: #38BDF8; font-weight: bold;");
        valLbl->setAlignment(Qt::AlignCenter);
        
        QLabel* lbl = new QLabel(labels[i], chart);
        lbl->setStyleSheet("font-size: 9px; color: #94A3B8;");
        lbl->setAlignment(Qt::AlignCenter);
        
        barCol->addWidget(valLbl);
        barCol->addWidget(bar, 1);
        barCol->addWidget(lbl);
        l->addLayout(barCol);
    }
    return chart;
}

// Helper to create simulated AI Predicting Box in C++
static QGroupBox* makeAiPredictor(QWidget* parent, const QString& title, const QString& inputLabel, int minVal, int maxVal, int defaultVal, const QString& suffix, const QString& resultPrefix) {
    QGroupBox* box = new QGroupBox(title, parent);
    box->setStyleSheet("QGroupBox { font-weight: bold; color: #38BDF8; border: 1px solid #475569; border-radius: 8px; margin-top: 10px; padding: 10px; }");
    QVBoxLayout* bl = new QVBoxLayout(box);
    bl->setSpacing(6);
    
    QLabel* il = new QLabel(QString("%1: %2 %3").arg(inputLabel).arg(defaultVal).arg(suffix), box);
    il->setStyleSheet("font-size: 10px; color: #E2E8F0;");
    bl->addWidget(il);
    
    QSlider* slider = new QSlider(Qt::Horizontal, box);
    slider->setRange(minVal, maxVal);
    slider->setValue(defaultVal);
    bl->addWidget(slider);
    
    QPushButton* btn = new QPushButton("🚀 Train & Run C++ TensorFlow Model", box);
    btn->setStyleSheet("QPushButton { background-color: #6366F1; color: white; font-weight: bold; border-radius: 4px; padding: 6px; font-size: 10px; } QPushButton:hover { background-color: #4F46E5; }");
    bl->addWidget(btn);
    
    QProgressBar* progress = new QProgressBar(box);
    progress->setRange(0, 100);
    progress->setValue(0);
    progress->setFixedHeight(6);
    progress->setTextVisible(false);
    progress->setVisible(false);
    bl->addWidget(progress);
    
    QLabel* rl = new QLabel(QString("%1: --").arg(resultPrefix), box);
    rl->setStyleSheet("font-size: 12px; font-weight: bold; color: #10B981;");
    rl->setAlignment(Qt::AlignCenter);
    bl->addWidget(rl);
    
    QObject::connect(slider, &QSlider::valueChanged, parent, [il, inputLabel, suffix](int val) {
        il->setText(QString("%1: %2 %3").arg(inputLabel).arg(val).arg(suffix));
    });
    
    QObject::connect(btn, &QPushButton::clicked, parent, [btn, progress, rl, slider, resultPrefix, minVal, maxVal]() {
        btn->setEnabled(false);
        progress->setVisible(true);
        progress->setValue(0);
        
        QTimer* timer = new QTimer(btn);
        QObject::connect(timer, &QTimer::timeout, btn, [timer, progress, rl, slider, btn, resultPrefix, minVal, maxVal]() {
            int val = progress->value() + 20;
            progress->setValue(val);
            if (val >= 100) {
                timer->stop();
                timer->deleteLater();
                progress->setVisible(false);
                btn->setEnabled(true);
                
                double pct = (double)(slider->value() - minVal) / (maxVal - minVal);
                int score = 40 + (int)(pct * 55);
                rl->setText(QString("%1: %2%").arg(resultPrefix).arg(score));
            }
        });
        timer->start(100);
    });
    
    return box;
}

QWidget* RoleDashboards::createStudentDashboard() {
    QWidget* w = new QWidget(this);
    QVBoxLayout* l = new QVBoxLayout(w);
    l->setContentsMargins(10, 10, 10, 10);
    l->setSpacing(8);
    
    QLabel* t = new QLabel("🎓 Student Dashboard", w);
    t->setStyleSheet("font-size: 16px; font-weight: bold;");
    l->addWidget(t);
    
    QHBoxLayout* kpi = new QHBoxLayout();
    kpi->addWidget(makeKpi(w, "Enrolled Courses", "5", "#6366F1"));
    kpi->addWidget(makeKpi(w, "Current GPA", "3.85", "#10B981"));
    kpi->addWidget(makeKpi(w, "Attendance", "92%", "#F59E0B"));
    kpi->addWidget(makeKpi(w, "Pending Fees", "$0", "#EF4444"));
    l->addLayout(kpi);

    QHBoxLayout* split = new QHBoxLayout();
    
    QWidget* leftContainer = new QWidget(w);
    QVBoxLayout* leftCol = new QVBoxLayout(leftContainer);
    leftCol->setContentsMargins(0, 0, 0, 0);
    
    QLabel* courseLabel = new QLabel("Enrolled Courses:", w);
    courseLabel->setStyleSheet("font-weight: bold;");
    leftCol->addWidget(courseLabel);
    
    QTableWidget* tbl = new QTableWidget(w);
    tbl->setColumnCount(4);
    tbl->setHorizontalHeaderLabels({"Course Code", "Title", "Faculty", "Grade"});
    tbl->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    tbl->insertRow(0);
    tbl->setItem(0, 0, new QTableWidgetItem("CS202"));
    tbl->setItem(0, 1, new QTableWidgetItem("Object Oriented Programming"));
    tbl->setItem(0, 2, new QTableWidgetItem("Prof. Marcus Chen"));
    tbl->setItem(0, 3, new QTableWidgetItem("A"));
    tbl->insertRow(1);
    tbl->setItem(1, 0, new QTableWidgetItem("CS301"));
    tbl->setItem(1, 1, new QTableWidgetItem("Database Management Systems"));
    tbl->setItem(1, 2, new QTableWidgetItem("Dr. Sarah Connor"));
    tbl->setItem(1, 3, new QTableWidgetItem("A-"));
    leftCol->addWidget(tbl);
    
    QLabel* examLabel = new QLabel("Upcoming Exams:", w);
    examLabel->setStyleSheet("font-weight: bold; margin-top: 8px;");
    leftCol->addWidget(examLabel);
    
    QTableWidget* examTbl = new QTableWidget(w);
    examTbl->setColumnCount(3);
    examTbl->setHorizontalHeaderLabels({"Exam", "Date", "Hall"});
    examTbl->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    examTbl->insertRow(0);
    examTbl->setItem(0, 0, new QTableWidgetItem("CS202 Midterm"));
    examTbl->setItem(0, 1, new QTableWidgetItem("2026-08-15"));
    examTbl->setItem(0, 2, new QTableWidgetItem("Hall A1"));
    leftCol->addWidget(examTbl);

    split->addWidget(leftContainer, 2);

    QWidget* rightContainer = new QWidget(w);
    QVBoxLayout* rightCol = new QVBoxLayout(rightContainer);
    rightCol->setContentsMargins(0, 0, 0, 0);

    QGroupBox* chartBox = new QGroupBox("GPA semester progress chart", w);
    chartBox->setStyleSheet("QGroupBox { font-weight: bold; color: #94A3B8; border: 1px solid #475569; border-radius: 8px; margin-top: 10px; padding-top: 15px; }");
    QVBoxLayout* cbl = new QVBoxLayout(chartBox);
    cbl->addWidget(createBarChartWidget(w, {"Sem1", "Sem2", "Sem3", "Sem4"}, {75, 82, 91, 95}, "#10B981"));
    rightCol->addWidget(chartBox);

    rightCol->addWidget(makeAiPredictor(w, "AI Placement Forecaster", "Weekly Study Hours", 5, 25, 15, "hrs", "Placement Probability"));
    
    split->addWidget(rightContainer, 1);
    l->addLayout(split);
    
    return w;
}

QWidget* RoleDashboards::createStudentPayments() {
    QWidget* w = new QWidget(this);
    QVBoxLayout* l = new QVBoxLayout(w);
    l->setContentsMargins(10, 10, 10, 10);
    l->setSpacing(8);
    
    QLabel* t = new QLabel("💳 Student Fee Payments", w);
    t->setStyleSheet("font-size: 16px; font-weight: bold;");
    l->addWidget(t);

    QHBoxLayout* split = new QHBoxLayout();
    
    QWidget* leftContainer = new QWidget(w);
    QVBoxLayout* leftCol = new QVBoxLayout(leftContainer);
    leftCol->setContentsMargins(0, 0, 0, 0);

    QTableWidget* tbl = new QTableWidget(w);
    tbl->setColumnCount(4);
    tbl->setHorizontalHeaderLabels({"Fee Type", "Amount ($)", "Due Date", "Status"});
    tbl->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    tbl->insertRow(0);
    tbl->setItem(0, 0, new QTableWidgetItem("Tuition Fee"));
    tbl->setItem(0, 1, new QTableWidgetItem("12,500"));
    tbl->setItem(0, 2, new QTableWidgetItem("2026-07-30"));
    tbl->setItem(0, 3, new QTableWidgetItem("✓ Paid"));
    tbl->insertRow(1);
    tbl->setItem(1, 0, new QTableWidgetItem("Lab Fee"));
    tbl->setItem(1, 1, new QTableWidgetItem("800"));
    tbl->setItem(1, 2, new QTableWidgetItem("2026-08-15"));
    tbl->setItem(1, 3, new QTableWidgetItem("Pending"));
    leftCol->addWidget(tbl);

    split->addWidget(leftContainer, 2);

    QWidget* rightContainer = new QWidget(w);
    QVBoxLayout* rightCol = new QVBoxLayout(rightContainer);
    rightCol->setContentsMargins(0, 0, 0, 0);

    QGroupBox* chartBox = new QGroupBox("Fees Balance Structure ($)", w);
    chartBox->setStyleSheet("QGroupBox { font-weight: bold; color: #94A3B8; border: 1px solid #475569; border-radius: 8px; padding-top: 15px; }");
    QVBoxLayout* cbl = new QVBoxLayout(chartBox);
    cbl->addWidget(createBarChartWidget(w, {"Tuition", "Library", "Hostel", "Lab"}, {95, 20, 60, 45}, "#EF4444"));
    rightCol->addWidget(chartBox);

    rightCol->addWidget(makeAiPredictor(w, "AI Payment Delay Risk Model", "Outstanding Due ($)", 100, 5000, 800, "USD", "Delay Risk Probability"));

    split->addWidget(rightContainer, 1);
    l->addLayout(split);
    
    return w;
}

QWidget* RoleDashboards::createFacultyDashboard() {
    QWidget* w = new QWidget(this);
    QVBoxLayout* l = new QVBoxLayout(w);
    l->setContentsMargins(10, 10, 10, 10);
    l->setSpacing(8);
    
    QLabel* t = new QLabel("👨‍🏫 Faculty Dashboard", w);
    t->setStyleSheet("font-size: 16px; font-weight: bold;");
    l->addWidget(t);
    
    QHBoxLayout* kpi = new QHBoxLayout();
    kpi->addWidget(makeKpi(w, "Courses Teaching", "3", "#6366F1"));
    kpi->addWidget(makeKpi(w, "Total Students", "185", "#10B981"));
    kpi->addWidget(makeKpi(w, "Publications", "12", "#F59E0B"));
    kpi->addWidget(makeKpi(w, "Rating", "4.8", "#EF4444"));
    l->addLayout(kpi);

    QHBoxLayout* split = new QHBoxLayout();
    
    QWidget* leftContainer = new QWidget(w);
    QVBoxLayout* leftCol = new QVBoxLayout(leftContainer);
    leftCol->setContentsMargins(0, 0, 0, 0);
    
    QTableWidget* tbl = new QTableWidget(w);
    tbl->setColumnCount(4);
    tbl->setHorizontalHeaderLabels({"Course", "Schedule", "Students", "Room"});
    tbl->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    tbl->insertRow(0);
    tbl->setItem(0, 0, new QTableWidgetItem("CS202 - OOP"));
    tbl->setItem(0, 1, new QTableWidgetItem("Mon/Wed 09:00-10:30"));
    tbl->setItem(0, 2, new QTableWidgetItem("65"));
    tbl->setItem(0, 3, new QTableWidgetItem("A1"));
    tbl->insertRow(1);
    tbl->setItem(1, 0, new QTableWidgetItem("CYBER401 - Network Security"));
    tbl->setItem(1, 1, new QTableWidgetItem("Tue/Thu 14:00-15:30"));
    tbl->setItem(1, 2, new QTableWidgetItem("55"));
    tbl->setItem(1, 3, new QTableWidgetItem("Lab C1"));
    leftCol->addWidget(tbl);

    split->addWidget(leftContainer, 2);

    QWidget* rightContainer = new QWidget(w);
    QVBoxLayout* rightCol = new QVBoxLayout(rightContainer);
    rightCol->setContentsMargins(0, 0, 0, 0);

    QGroupBox* chartBox = new QGroupBox("Grade Distribution", w);
    chartBox->setStyleSheet("QGroupBox { font-weight: bold; color: #94A3B8; border: 1px solid #475569; border-radius: 8px; padding-top: 15px; }");
    QVBoxLayout* cbl = new QVBoxLayout(chartBox);
    cbl->addWidget(createBarChartWidget(w, {"A", "B", "C", "D", "F"}, {45, 60, 30, 10, 5}, "#06B6D4"));
    rightCol->addWidget(chartBox);

    rightCol->addWidget(makeAiPredictor(w, "AI Student Risk Evaluator", "Weekly Absences Limit", 0, 10, 2, "Days", "At-Risk Score"));

    split->addWidget(rightContainer, 1);
    l->addLayout(split);
    
    return w;
}

QWidget* RoleDashboards::createParentDashboard() {
    QWidget* w = new QWidget(this);
    QVBoxLayout* l = new QVBoxLayout(w);
    l->setContentsMargins(10, 10, 10, 10);
    l->setSpacing(8);
    
    QLabel* t = new QLabel("👨‍👧 Parent Dashboard", w);
    t->setStyleSheet("font-size: 16px; font-weight: bold;");
    l->addWidget(t);
    
    QHBoxLayout* kpi = new QHBoxLayout();
    kpi->addWidget(makeKpi(w, "Child's GPA", "3.85", "#10B981"));
    kpi->addWidget(makeKpi(w, "Attendance", "92%", "#6366F1"));
    kpi->addWidget(makeKpi(w, "Fee Status", "Paid", "#F59E0B"));
    l->addLayout(kpi);

    QHBoxLayout* split = new QHBoxLayout();
    
    QWidget* leftContainer = new QWidget(w);
    QVBoxLayout* leftCol = new QVBoxLayout(leftContainer);
    leftCol->setContentsMargins(0, 0, 0, 0);
    
    QTableWidget* tbl = new QTableWidget(w);
    tbl->setColumnCount(3);
    tbl->setHorizontalHeaderLabels({"Subject", "Grade", "Attendance %"});
    tbl->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    tbl->insertRow(0);
    tbl->setItem(0, 0, new QTableWidgetItem("CS202 - OOP"));
    tbl->setItem(0, 1, new QTableWidgetItem("A"));
    tbl->setItem(0, 2, new QTableWidgetItem("95%"));
    leftCol->addWidget(tbl);

    split->addWidget(leftContainer, 2);

    QWidget* rightContainer = new QWidget(w);
    QVBoxLayout* rightCol = new QVBoxLayout(rightContainer);
    rightCol->setContentsMargins(0, 0, 0, 0);

    QGroupBox* chartBox = new QGroupBox("Weekly Attendance By Subject (%)", w);
    chartBox->setStyleSheet("QGroupBox { font-weight: bold; color: #94A3B8; border: 1px solid #475569; border-radius: 8px; padding-top: 15px; }");
    QVBoxLayout* cbl = new QVBoxLayout(chartBox);
    cbl->addWidget(createBarChartWidget(w, {"OOP", "DBMS", "OS", "Stats"}, {95, 88, 92, 85}, "#F59E0B"));
    rightCol->addWidget(chartBox);

    rightCol->addWidget(makeAiPredictor(w, "AI Term Grade Estimator", "Daily Study Hours", 1, 8, 4, "hrs", "Estimated Success Index"));

    split->addWidget(rightContainer, 1);
    l->addLayout(split);
    
    return w;
}

QWidget* RoleDashboards::createAlumniDashboard() {
    QWidget* w = new QWidget(this);
    QVBoxLayout* l = new QVBoxLayout(w);
    l->setContentsMargins(10, 10, 10, 10);
    l->setSpacing(8);
    
    QLabel* t = new QLabel("🎓 Alumni Network", w);
    t->setStyleSheet("font-size: 16px; font-weight: bold;");
    l->addWidget(t);

    QHBoxLayout* split = new QHBoxLayout();
    
    QWidget* leftContainer = new QWidget(w);
    QVBoxLayout* leftCol = new QVBoxLayout(leftContainer);
    leftCol->setContentsMargins(0, 0, 0, 0);
    
    QTableWidget* tbl = new QTableWidget(w);
    tbl->setColumnCount(4);
    tbl->setHorizontalHeaderLabels({"Name", "Batch", "Company", "Location"});
    tbl->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    tbl->insertRow(0);
    tbl->setItem(0, 0, new QTableWidgetItem("Sophia Williams"));
    tbl->setItem(0, 1, new QTableWidgetItem("2022"));
    tbl->setItem(0, 2, new QTableWidgetItem("Google"));
    tbl->setItem(0, 3, new QTableWidgetItem("Mountain View, CA"));
    tbl->insertRow(1);
    tbl->setItem(1, 0, new QTableWidgetItem("Raj Patel"));
    tbl->setItem(1, 1, new QTableWidgetItem("2021"));
    tbl->setItem(1, 2, new QTableWidgetItem("Microsoft"));
    tbl->setItem(1, 3, new QTableWidgetItem("Redmond, WA"));
    leftCol->addWidget(tbl);

    split->addWidget(leftContainer, 2);

    QWidget* rightContainer = new QWidget(w);
    QVBoxLayout* rightCol = new QVBoxLayout(rightContainer);
    rightCol->setContentsMargins(0, 0, 0, 0);

    QGroupBox* chartBox = new QGroupBox("Alumni Sectors Distribution (%)", w);
    chartBox->setStyleSheet("QGroupBox { font-weight: bold; color: #94A3B8; border: 1px solid #475569; border-radius: 8px; padding-top: 15px; }");
    QVBoxLayout* cbl = new QVBoxLayout(chartBox);
    cbl->addWidget(createBarChartWidget(w, {"Tech", "Fin", "Health", "Edu"}, {60, 20, 10, 10}, "#6366F1"));
    rightCol->addWidget(chartBox);

    rightCol->addWidget(makeAiPredictor(w, "AI Mentorship Engagement Scorer", "Mentorship Frequency", 1, 10, 3, "meetings/mo", "Engagement Score"));

    split->addWidget(rightContainer, 1);
    l->addLayout(split);
    
    return w;
}

QWidget* RoleDashboards::createRecruiterDashboard() {
    QWidget* w = new QWidget(this);
    QVBoxLayout* l = new QVBoxLayout(w);
    l->setContentsMargins(10, 10, 10, 10);
    l->setSpacing(8);
    
    QLabel* t = new QLabel("🏢 Recruiter Dashboard", w);
    t->setStyleSheet("font-size: 16px; font-weight: bold;");
    l->addWidget(t);
    
    QHBoxLayout* kpi = new QHBoxLayout();
    kpi->addWidget(makeKpi(w, "Active Drives", "4", "#6366F1"));
    kpi->addWidget(makeKpi(w, "Candidates", "245", "#10B981"));
    kpi->addWidget(makeKpi(w, "Interviews", "38", "#F59E0B"));
    l->addLayout(kpi);

    QHBoxLayout* split = new QHBoxLayout();
    
    QWidget* leftContainer = new QWidget(w);
    QVBoxLayout* leftCol = new QVBoxLayout(leftContainer);
    leftCol->setContentsMargins(0, 0, 0, 0);
    
    QTableWidget* tbl = new QTableWidget(w);
    tbl->setColumnCount(4);
    tbl->setHorizontalHeaderLabels({"Drive Name", "Company", "Positions", "Status"});
    tbl->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    tbl->insertRow(0);
    tbl->setItem(0, 0, new QTableWidgetItem("Campus Drive 2026"));
    tbl->setItem(0, 1, new QTableWidgetItem("Google"));
    tbl->setItem(0, 2, new QTableWidgetItem("15"));
    tbl->setItem(0, 3, new QTableWidgetItem("Active"));
    leftCol->addWidget(tbl);

    split->addWidget(leftContainer, 2);

    QWidget* rightContainer = new QWidget(w);
    QVBoxLayout* rightCol = new QVBoxLayout(rightContainer);
    rightCol->setContentsMargins(0, 0, 0, 0);

    QGroupBox* chartBox = new QGroupBox("Applied Candidates By Stream", w);
    chartBox->setStyleSheet("QGroupBox { font-weight: bold; color: #94A3B8; border: 1px solid #475569; border-radius: 8px; padding-top: 15px; }");
    QVBoxLayout* cbl = new QVBoxLayout(chartBox);
    cbl->addWidget(createBarChartWidget(w, {"CS", "EE", "ME", "BA"}, {70, 45, 30, 55}, "#0891B2"));
    rightCol->addWidget(chartBox);

    rightCol->addWidget(makeAiPredictor(w, "AI Resume Qualification Scorer", "Technical Assessment Score", 40, 100, 75, "%", "Qualification Match"));

    split->addWidget(rightContainer, 1);
    l->addLayout(split);
    
    return w;
}

QWidget* RoleDashboards::createFinanceDashboard() {
    QWidget* w = new QWidget(this);
    QVBoxLayout* l = new QVBoxLayout(w);
    l->setContentsMargins(10, 10, 10, 10);
    l->setSpacing(8);
    
    QLabel* t = new QLabel("💰 Finance Manager Dashboard", w);
    t->setStyleSheet("font-size: 16px; font-weight: bold;");
    l->addWidget(t);
    
    QHBoxLayout* kpi = new QHBoxLayout();
    kpi->addWidget(makeKpi(w, "Revenue", "$2.45M", "#10B981"));
    kpi->addWidget(makeKpi(w, "Pending", "$340K", "#F59E0B"));
    kpi->addWidget(makeKpi(w, "Budget Used", "77%", "#6366F1"));
    l->addLayout(kpi);

    QHBoxLayout* split = new QHBoxLayout();
    
    QWidget* leftContainer = new QWidget(w);
    QVBoxLayout* leftCol = new QVBoxLayout(leftContainer);
    leftCol->setContentsMargins(0, 0, 0, 0);
    
    QTableWidget* tbl = new QTableWidget(w);
    tbl->setColumnCount(3);
    tbl->setHorizontalHeaderLabels({"Category", "Amount ($)", "Trend"});
    tbl->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    tbl->insertRow(0);
    tbl->setItem(0, 0, new QTableWidgetItem("Tuition Revenue"));
    tbl->setItem(0, 1, new QTableWidgetItem("1,850,000"));
    tbl->setItem(0, 2, new QTableWidgetItem("↑ 8.5%"));
    leftCol->addWidget(tbl);

    split->addWidget(leftContainer, 2);

    QWidget* rightContainer = new QWidget(w);
    QVBoxLayout* rightCol = new QVBoxLayout(rightContainer);
    rightCol->setContentsMargins(0, 0, 0, 0);

    QGroupBox* chartBox = new QGroupBox("Collection vs Target ($)", w);
    chartBox->setStyleSheet("QGroupBox { font-weight: bold; color: #94A3B8; border: 1px solid #475569; border-radius: 8px; padding-top: 15px; }");
    QVBoxLayout* cbl = new QVBoxLayout(chartBox);
    cbl->addWidget(createBarChartWidget(w, {"Tuit", "Host", "Lab", "Exam"}, {85, 70, 92, 60}, "#10B981"));
    rightCol->addWidget(chartBox);

    rightCol->addWidget(makeAiPredictor(w, "AI Budget Surplus Predictor", "Allocated Operational Budget ($k)", 100, 2000, 450, "kUSD", "Predicted Efficiency Index"));

    split->addWidget(rightContainer, 1);
    l->addLayout(split);
    
    return w;
}

QWidget* RoleDashboards::createPlacementDashboard() {
    QWidget* w = new QWidget(this);
    QVBoxLayout* l = new QVBoxLayout(w);
    l->setContentsMargins(10, 10, 10, 10);
    l->setSpacing(8);
    
    QLabel* t = new QLabel("📊 Placement Officer Dashboard", w);
    t->setStyleSheet("font-size: 16px; font-weight: bold;");
    l->addWidget(t);
    
    QHBoxLayout* kpi = new QHBoxLayout();
    kpi->addWidget(makeKpi(w, "Placed Students", "82%", "#10B981"));
    kpi->addWidget(makeKpi(w, "Active Drives", "6", "#6366F1"));
    kpi->addWidget(makeKpi(w, "Companies", "45", "#F59E0B"));
    l->addLayout(kpi);

    QHBoxLayout* split = new QHBoxLayout();
    
    QWidget* leftContainer = new QWidget(w);
    QVBoxLayout* leftCol = new QVBoxLayout(leftContainer);
    leftCol->setContentsMargins(0, 0, 0, 0);
    
    QTableWidget* tbl = new QTableWidget(w);
    tbl->setColumnCount(4);
    tbl->setHorizontalHeaderLabels({"Company", "Offers", "Package (LPA)", "Status"});
    tbl->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    tbl->insertRow(0);
    tbl->setItem(0, 0, new QTableWidgetItem("Google"));
    tbl->setItem(0, 1, new QTableWidgetItem("8"));
    tbl->setItem(0, 2, new QTableWidgetItem("24.5"));
    tbl->setItem(0, 3, new QTableWidgetItem("✓ Completed"));
    leftCol->addWidget(tbl);

    split->addWidget(leftContainer, 2);

    QWidget* rightContainer = new QWidget(w);
    QVBoxLayout* rightCol = new QVBoxLayout(rightContainer);
    rightCol->setContentsMargins(0, 0, 0, 0);

    QGroupBox* chartBox = new QGroupBox("CTC Salary Package Trend (LPA)", w);
    chartBox->setStyleSheet("QGroupBox { font-weight: bold; color: #94A3B8; border: 1px solid #475569; border-radius: 8px; padding-top: 15px; }");
    QVBoxLayout* cbl = new QVBoxLayout(chartBox);
    cbl->addWidget(createBarChartWidget(w, {"Min", "Avg", "Med", "Max"}, {40, 65, 75, 95}, "#EC4899"));
    rightCol->addWidget(chartBox);

    rightCol->addWidget(makeAiPredictor(w, "AI Batch Placement forecaster", "Workshop participation", 50, 100, 85, "%", "Batch Placement Odds"));

    split->addWidget(rightContainer, 1);
    l->addLayout(split);
    
    return w;
}

QWidget* RoleDashboards::createResearchDashboard() {
    QWidget* w = new QWidget(this);
    QVBoxLayout* l = new QVBoxLayout(w);
    l->setContentsMargins(10, 10, 10, 10);
    l->setSpacing(8);
    
    QLabel* t = new QLabel("🔬 Research Coordinator Dashboard", w);
    t->setStyleSheet("font-size: 16px; font-weight: bold;");
    l->addWidget(t);
    
    QHBoxLayout* kpi = new QHBoxLayout();
    kpi->addWidget(makeKpi(w, "Active Grants", "14", "#6366F1"));
    kpi->addWidget(makeKpi(w, "Publications", "127", "#10B981"));
    kpi->addWidget(makeKpi(w, "Total Funding", "$225K", "#F59E0B"));
    l->addLayout(kpi);

    QHBoxLayout* split = new QHBoxLayout();
    
    QWidget* leftContainer = new QWidget(w);
    QVBoxLayout* leftCol = new QVBoxLayout(leftContainer);
    leftCol->setContentsMargins(0, 0, 0, 0);
    
    QTableWidget* tbl = new QTableWidget(w);
    tbl->setColumnCount(4);
    tbl->setHorizontalHeaderLabels({"Project", "PI", "Budget ($)", "Status"});
    tbl->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    tbl->insertRow(0);
    tbl->setItem(0, 0, new QTableWidgetItem("Federated Learning on Campus Mesh"));
    tbl->setItem(0, 1, new QTableWidgetItem("Prof. Marcus Chen"));
    tbl->setItem(0, 2, new QTableWidgetItem("45,000"));
    tbl->setItem(0, 3, new QTableWidgetItem("Active"));
    leftCol->addWidget(tbl);

    split->addWidget(leftContainer, 2);

    QWidget* rightContainer = new QWidget(w);
    QVBoxLayout* rightCol = new QVBoxLayout(rightContainer);
    rightCol->setContentsMargins(0, 0, 0, 0);

    QGroupBox* chartBox = new QGroupBox("Department Funding Allocations", w);
    chartBox->setStyleSheet("QGroupBox { font-weight: bold; color: #94A3B8; border: 1px solid #475569; border-radius: 8px; padding-top: 15px; }");
    QVBoxLayout* cbl = new QVBoxLayout(chartBox);
    cbl->addWidget(createBarChartWidget(w, {"CS", "EE", "ME", "Bio"}, {80, 50, 35, 60}, "#10B981"));
    rightCol->addWidget(chartBox);

    rightCol->addWidget(makeAiPredictor(w, "AI Grant Approval Odds Calculator", "Research Funding Request ($k)", 10, 100, 45, "kUSD", "Grant Approval Odds"));

    split->addWidget(rightContainer, 1);
    l->addLayout(split);
    
    return w;
}
