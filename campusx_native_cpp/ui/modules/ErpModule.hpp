#ifndef ERPMODULE_HPP
#define ERPMODULE_HPP

#include <QWidget>
#include <QTableWidget>
#include <QPushButton>
#include <QLineEdit>
#include <QComboBox>
#include <QTextEdit>
#include <QSpinBox>
#include <QDoubleSpinBox>
#include <QLabel>
#include <QProgressBar>

class ErpModule : public QWidget {
    Q_OBJECT
public:
    explicit ErpModule(QWidget* parent = nullptr);
    ~ErpModule() = default;

private slots:
    void loadRosterData();
    void executeAttendanceLock();
    void executeDegreeMint();
    void executeEnrollment();
    void allocateFaculty();
    void allocateExamHall();
    void approveCourseGrades();
    // New slots
    void refreshAdminDashboard();
    void refreshRegistrarData();
    void refreshDeanData();
    void refreshHodData();
    void submitAssignment();
    void publishResults();
    void approveResearchGrant();

private:
    void setupUi();
    
    // Tab 1: Rosters
    QTableWidget* m_rosterTable;
    
    // Tab 2: Registrations
    QLineEdit* m_regStudentInput;
    QComboBox* m_regCourseCombo;
    QTableWidget* m_regTable;
    QPushButton* m_enrollBtn;
    
    // Tab 3: Faculty Allocation
    QComboBox* m_allocFacultyCombo;
    QComboBox* m_allocCourseCombo;
    QTableWidget* m_allocTable;
    QPushButton* m_allocBtn;
    
    // Tab 4: Attendance Lock
    QPushButton* m_lockButton;
    
    // Tab 5: Exams Allocations
    QLineEdit* m_examHallInput;
    QComboBox* m_examCourseCombo;
    QTableWidget* m_examsTable;
    QPushButton* m_examAllocBtn;
    
    // Tab 6: Grade Approvals
    QTableWidget* m_approvalsTable;
    QTableWidget* m_mintLogsTable;
    QPushButton* m_mintButton;
    QPushButton* m_approveBtn;
    
    // Tab 7: Admin Dashboard
    QLabel* m_adminStudentCount;
    QLabel* m_adminFacultyCount;
    QLabel* m_adminCourseCount;
    QLabel* m_adminDeptCount;
    QTableWidget* m_adminRecentTable;
    
    // Tab 8: Registrar Console
    QLineEdit* m_registrarSearch;
    QTableWidget* m_registrarEnrollTable;
    QTableWidget* m_registrarCertTable;
    QPushButton* m_genTranscriptBtn;
    
    // Tab 9: Dean Dashboard
    QTableWidget* m_deanFacultyTable;
    QTableWidget* m_deanGrantsTable;
    QLabel* m_deanResearchLabel;
    QLabel* m_deanBudgetLabel;
    QPushButton* m_deanApproveGrantBtn;
    QProgressBar* m_deanTfProgress;
    QLabel* m_deanTfStatus;
    
    // Tab 10: HOD Console
    QTableWidget* m_hodWorkloadTable;
    QTableWidget* m_hodEvalTable;
    QTableWidget* m_hodSyllabusTable;
    QComboBox* m_hodDeptFilter;
    
    // Tab 11: Assignments
    QLineEdit* m_assignTitle;
    QComboBox* m_assignCourseCombo;
    QTextEdit* m_assignDescription;
    QTableWidget* m_assignTable;
    QPushButton* m_assignSubmitBtn;
    
    // Tab 12: Results
    QTableWidget* m_resultsTable;
    QComboBox* m_resultsSemCombo;
    QPushButton* m_publishResultsBtn;
    QLabel* m_avgGpaLabel;
};

#endif // ERPMODULE_HPP

