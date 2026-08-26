#ifndef FINANCEMODULE_HPP
#define FINANCEMODULE_HPP

#include <QWidget>
#include <QTableWidget>
#include <QPushButton>
#include <QLineEdit>
#include <QComboBox>
#include <QLabel>

class FinanceModule : public QWidget {
    Q_OBJECT
public:
    explicit FinanceModule(QWidget* parent = nullptr);
    ~FinanceModule() = default;

private slots:
    void processPayment();
    void approveScholarship();
    void submitProcurement();

private:
    void setupUi();
    QTableWidget* m_paymentsTable;
    QTableWidget* m_scholarshipsTable;
    QTableWidget* m_budgetsTable;
    QTableWidget* m_procurementTable;
    QLabel* m_revenueLabel;
    QLabel* m_expenseLabel;
    QLabel* m_pendingLabel;
    QLabel* m_collectedLabel;
    QPushButton* m_processPayBtn;
    QPushButton* m_approveScholarBtn;
    QPushButton* m_submitProcBtn;
    QLineEdit* m_paymentSearch;
    QComboBox* m_paymentFilter;
};

#endif // FINANCEMODULE_HPP
