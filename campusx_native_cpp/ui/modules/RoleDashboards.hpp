#ifndef ROLEDASHBOARDS_HPP
#define ROLEDASHBOARDS_HPP

#include <QWidget>
#include <QTableWidget>
#include <QLabel>
#include <QPushButton>
#include <QGroupBox>
#include <QStackedWidget>
#include <QComboBox>

// Role-specific dashboard panels displayed based on authenticated user role
class RoleDashboards : public QWidget {
    Q_OBJECT
public:
    explicit RoleDashboards(QWidget* parent = nullptr);
    ~RoleDashboards() = default;
    void setRole(const QString& role);

private:
    void setupUi();
    QWidget* createStudentDashboard();
    QWidget* createStudentPayments();
    QWidget* createFacultyDashboard();
    QWidget* createParentDashboard();
    QWidget* createAlumniDashboard();
    QWidget* createRecruiterDashboard();
    QWidget* createFinanceDashboard();
    QWidget* createPlacementDashboard();
    QWidget* createResearchDashboard();
    
    QStackedWidget* m_stack;
    QComboBox* m_roleSelector;
};

#endif // ROLEDASHBOARDS_HPP
