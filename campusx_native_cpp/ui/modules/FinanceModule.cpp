#include "FinanceModule.hpp"
#include "ApiClient.hpp"
#include <QVBoxLayout>
#include <QHBoxLayout>
#include <QTabWidget>
#include <QLabel>
#include <QGroupBox>
#include <QHeaderView>
#include <QJsonObject>

FinanceModule::FinanceModule(QWidget* parent) : QWidget(parent) { setupUi(); }

void FinanceModule::setupUi() {
    QVBoxLayout* mainLayout = new QVBoxLayout(this);
    mainLayout->setContentsMargins(0, 0, 0, 0);
    QTabWidget* tabWidget = new QTabWidget(this);

    // ==========================================
    // --- TAB 1: FINANCE DASHBOARD ---
    // ==========================================
    QWidget* dashTab = new QWidget(this);
    QVBoxLayout* dashLayout = new QVBoxLayout(dashTab);
    dashLayout->setContentsMargins(10, 10, 10, 10);
    dashLayout->setSpacing(8);

    QLabel* dashTitle = new QLabel("💰 Finance Operations Dashboard", dashTab);
    dashTitle->setStyleSheet("font-size: 14px; font-weight: bold;");
    dashLayout->addWidget(dashTitle);

    QHBoxLayout* kpiRow = new QHBoxLayout();
    auto makeKpi = [&](const QString& label, const QString& value, const QString& color) -> QGroupBox* {
        QGroupBox* box = new QGroupBox(dashTab);
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
    };
    m_revenueLabel = new QLabel("$2,450,000");
    m_expenseLabel = new QLabel("$1,890,000");
    m_pendingLabel = new QLabel("$340,000");
    m_collectedLabel = new QLabel("$2,110,000");
    kpiRow->addWidget(makeKpi("Total Revenue", "$2,450,000", "#10B981"));
    kpiRow->addWidget(makeKpi("Total Expenses", "$1,890,000", "#EF4444"));
    kpiRow->addWidget(makeKpi("Pending Fees", "$340,000", "#F59E0B"));
    kpiRow->addWidget(makeKpi("Collected Fees", "$2,110,000", "#6366F1"));
    dashLayout->addLayout(kpiRow);

    QLabel* note = new QLabel("Budget utilization: 77.1% | Fiscal Year: 2025-2026", dashTab);
    note->setStyleSheet("font-size: 11px; color: #94A3B8; padding: 4px;");
    dashLayout->addWidget(note);
    dashLayout->addStretch();
    tabWidget->addTab(dashTab, "Dashboard");

    // ==========================================
    // --- TAB 2: PAYMENTS ---
    // ==========================================
    QWidget* payTab = new QWidget(this);
    QVBoxLayout* payLayout = new QVBoxLayout(payTab);
    payLayout->setContentsMargins(10, 10, 10, 10);
    payLayout->setSpacing(8);

    QLabel* payTitle = new QLabel("💳 Fee Collection & Payments", payTab);
    payTitle->setStyleSheet("font-size: 14px; font-weight: bold;");
    payLayout->addWidget(payTitle);

    QHBoxLayout* payFilter = new QHBoxLayout();
    m_paymentSearch = new QLineEdit(payTab);
    m_paymentSearch->setPlaceholderText("Search by student ID or name...");
    m_paymentFilter = new QComboBox(payTab);
    m_paymentFilter->addItems({"All", "Paid", "Pending", "Overdue"});
    payFilter->addWidget(m_paymentSearch, 2);
    payFilter->addWidget(m_paymentFilter);
    payLayout->addLayout(payFilter);

    m_paymentsTable = new QTableWidget(payTab);
    m_paymentsTable->setColumnCount(6);
    m_paymentsTable->setHorizontalHeaderLabels({"Student ID", "Name", "Fee Type", "Amount ($)", "Due Date", "Status"});
    m_paymentsTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    m_paymentsTable->insertRow(0);
    m_paymentsTable->setItem(0, 0, new QTableWidgetItem("usr_stu001"));
    m_paymentsTable->setItem(0, 1, new QTableWidgetItem("Alex Rivera"));
    m_paymentsTable->setItem(0, 2, new QTableWidgetItem("Tuition Fee"));
    m_paymentsTable->setItem(0, 3, new QTableWidgetItem("12,500"));
    m_paymentsTable->setItem(0, 4, new QTableWidgetItem("2026-07-30"));
    m_paymentsTable->setItem(0, 5, new QTableWidgetItem("✓ Paid"));
    m_paymentsTable->insertRow(1);
    m_paymentsTable->setItem(1, 0, new QTableWidgetItem("usr_stu002"));
    m_paymentsTable->setItem(1, 1, new QTableWidgetItem("Priya Sharma"));
    m_paymentsTable->setItem(1, 2, new QTableWidgetItem("Hostel Fee"));
    m_paymentsTable->setItem(1, 3, new QTableWidgetItem("3,200"));
    m_paymentsTable->setItem(1, 4, new QTableWidgetItem("2026-08-15"));
    m_paymentsTable->setItem(1, 5, new QTableWidgetItem("Pending"));
    m_paymentsTable->insertRow(2);
    m_paymentsTable->setItem(2, 0, new QTableWidgetItem("usr_stu003"));
    m_paymentsTable->setItem(2, 1, new QTableWidgetItem("Jordan McKay"));
    m_paymentsTable->setItem(2, 2, new QTableWidgetItem("Lab Fee"));
    m_paymentsTable->setItem(2, 3, new QTableWidgetItem("800"));
    m_paymentsTable->setItem(2, 4, new QTableWidgetItem("2026-06-30"));
    m_paymentsTable->setItem(2, 5, new QTableWidgetItem("⚠ Overdue"));
    payLayout->addWidget(m_paymentsTable);

    m_processPayBtn = new QPushButton("Process Selected Payment", payTab);
    m_processPayBtn->setStyleSheet("background-color: #10B981;");
    connect(m_processPayBtn, &QPushButton::clicked, this, &FinanceModule::processPayment);
    payLayout->addWidget(m_processPayBtn);
    tabWidget->addTab(payTab, "Payments");

    // ==========================================
    // --- TAB 3: SCHOLARSHIPS ---
    // ==========================================
    QWidget* scholTab = new QWidget(this);
    QVBoxLayout* scholLayout = new QVBoxLayout(scholTab);
    scholLayout->setContentsMargins(10, 10, 10, 10);

    QLabel* scholTitle = new QLabel("🏅 Scholarship Management", scholTab);
    scholTitle->setStyleSheet("font-size: 14px; font-weight: bold;");
    scholLayout->addWidget(scholTitle);

    m_scholarshipsTable = new QTableWidget(scholTab);
    m_scholarshipsTable->setColumnCount(5);
    m_scholarshipsTable->setHorizontalHeaderLabels({"Student", "Scholarship Name", "Amount ($)", "GPA Requirement", "Status"});
    m_scholarshipsTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    m_scholarshipsTable->insertRow(0);
    m_scholarshipsTable->setItem(0, 0, new QTableWidgetItem("Alex Rivera"));
    m_scholarshipsTable->setItem(0, 1, new QTableWidgetItem("Merit Excellence Award"));
    m_scholarshipsTable->setItem(0, 2, new QTableWidgetItem("5,000"));
    m_scholarshipsTable->setItem(0, 3, new QTableWidgetItem("≥ 3.80"));
    m_scholarshipsTable->setItem(0, 4, new QTableWidgetItem("✓ Awarded"));
    m_scholarshipsTable->insertRow(1);
    m_scholarshipsTable->setItem(1, 0, new QTableWidgetItem("Priya Sharma"));
    m_scholarshipsTable->setItem(1, 1, new QTableWidgetItem("Research Fellowship"));
    m_scholarshipsTable->setItem(1, 2, new QTableWidgetItem("8,000"));
    m_scholarshipsTable->setItem(1, 3, new QTableWidgetItem("≥ 3.50"));
    m_scholarshipsTable->setItem(1, 4, new QTableWidgetItem("Pending Review"));
    scholLayout->addWidget(m_scholarshipsTable);

    m_approveScholarBtn = new QPushButton("Approve Selected Scholarship", scholTab);
    m_approveScholarBtn->setStyleSheet("background-color: #6366F1;");
    connect(m_approveScholarBtn, &QPushButton::clicked, this, &FinanceModule::approveScholarship);
    scholLayout->addWidget(m_approveScholarBtn);
    tabWidget->addTab(scholTab, "Scholarships");

    // ==========================================
    // --- TAB 4: BUDGETS ---
    // ==========================================
    QWidget* budTab = new QWidget(this);
    QVBoxLayout* budLayout = new QVBoxLayout(budTab);
    budLayout->setContentsMargins(10, 10, 10, 10);

    QLabel* budTitle = new QLabel("📊 Department Budget Allocation", budTab);
    budTitle->setStyleSheet("font-size: 14px; font-weight: bold;");
    budLayout->addWidget(budTitle);

    m_budgetsTable = new QTableWidget(budTab);
    m_budgetsTable->setColumnCount(5);
    m_budgetsTable->setHorizontalHeaderLabels({"Department", "Allocated ($)", "Spent ($)", "Remaining ($)", "Utilization %"});
    m_budgetsTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    QStringList depts = {"Computer Science", "Electrical Eng.", "Mechanical Eng.", "Civil Eng.", "Administration"};
    QStringList allocs = {"450,000", "320,000", "280,000", "250,000", "180,000"};
    QStringList spents = {"380,000", "260,000", "210,000", "190,000", "150,000"};
    QStringList remaining = {"70,000", "60,000", "70,000", "60,000", "30,000"};
    QStringList utils = {"84.4%", "81.3%", "75.0%", "76.0%", "83.3%"};
    for (int i = 0; i < depts.size(); ++i) {
        m_budgetsTable->insertRow(i);
        m_budgetsTable->setItem(i, 0, new QTableWidgetItem(depts[i]));
        m_budgetsTable->setItem(i, 1, new QTableWidgetItem(allocs[i]));
        m_budgetsTable->setItem(i, 2, new QTableWidgetItem(spents[i]));
        m_budgetsTable->setItem(i, 3, new QTableWidgetItem(remaining[i]));
        m_budgetsTable->setItem(i, 4, new QTableWidgetItem(utils[i]));
    }
    budLayout->addWidget(m_budgetsTable);
    tabWidget->addTab(budTab, "Budgets");

    // ==========================================
    // --- TAB 5: PROCUREMENT ---
    // ==========================================
    QWidget* procTab = new QWidget(this);
    QVBoxLayout* procLayout = new QVBoxLayout(procTab);
    procLayout->setContentsMargins(10, 10, 10, 10);

    QLabel* procTitle = new QLabel("🛒 Procurement Requests", procTab);
    procTitle->setStyleSheet("font-size: 14px; font-weight: bold;");
    procLayout->addWidget(procTitle);

    m_procurementTable = new QTableWidget(procTab);
    m_procurementTable->setColumnCount(5);
    m_procurementTable->setHorizontalHeaderLabels({"Request ID", "Item Description", "Quantity", "Budget ($)", "Status"});
    m_procurementTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    m_procurementTable->insertRow(0);
    m_procurementTable->setItem(0, 0, new QTableWidgetItem("PRQ-001"));
    m_procurementTable->setItem(0, 1, new QTableWidgetItem("Lab Workstations (Dell Precision)"));
    m_procurementTable->setItem(0, 2, new QTableWidgetItem("25"));
    m_procurementTable->setItem(0, 3, new QTableWidgetItem("62,500"));
    m_procurementTable->setItem(0, 4, new QTableWidgetItem("Pending Approval"));
    m_procurementTable->insertRow(1);
    m_procurementTable->setItem(1, 0, new QTableWidgetItem("PRQ-002"));
    m_procurementTable->setItem(1, 1, new QTableWidgetItem("Library Books (Q3 Catalog)"));
    m_procurementTable->setItem(1, 2, new QTableWidgetItem("200"));
    m_procurementTable->setItem(1, 3, new QTableWidgetItem("8,400"));
    m_procurementTable->setItem(1, 4, new QTableWidgetItem("✓ Approved"));
    procLayout->addWidget(m_procurementTable);

    m_submitProcBtn = new QPushButton("Submit New Procurement Request", procTab);
    m_submitProcBtn->setStyleSheet("background-color: #6366F1;");
    connect(m_submitProcBtn, &QPushButton::clicked, this, &FinanceModule::submitProcurement);
    procLayout->addWidget(m_submitProcBtn);
    tabWidget->addTab(procTab, "Procurement");

    mainLayout->addWidget(tabWidget);
}

void FinanceModule::processPayment() {
    int row = m_paymentsTable->currentRow();
    if (row < 0) return;
    QTableWidgetItem* status = m_paymentsTable->item(row, 5);
    if (status) status->setText("✓ Paid");
}

void FinanceModule::approveScholarship() {
    int row = m_scholarshipsTable->currentRow();
    if (row < 0) return;
    QTableWidgetItem* status = m_scholarshipsTable->item(row, 4);
    if (status) status->setText("✓ Awarded");
}

void FinanceModule::submitProcurement() {
    int row = m_procurementTable->rowCount();
    m_procurementTable->insertRow(row);
    m_procurementTable->setItem(row, 0, new QTableWidgetItem(QString("PRQ-%1").arg(row + 1, 3, 10, QChar('0'))));
    m_procurementTable->setItem(row, 1, new QTableWidgetItem("New Request"));
    m_procurementTable->setItem(row, 2, new QTableWidgetItem("1"));
    m_procurementTable->setItem(row, 3, new QTableWidgetItem("0"));
    m_procurementTable->setItem(row, 4, new QTableWidgetItem("Draft"));
}
