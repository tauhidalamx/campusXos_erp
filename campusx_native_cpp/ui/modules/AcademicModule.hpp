#ifndef ACADEMICMODULE_HPP
#define ACADEMICMODULE_HPP

#include <QWidget>
#include <QTableWidget>
#include <QPushButton>
#include <QLineEdit>
#include <QComboBox>
#include <QDateEdit>
#include <QCheckBox>

class AcademicModule : public QWidget {
    Q_OBJECT
public:
    explicit AcademicModule(QWidget* parent = nullptr);
    ~AcademicModule() = default;

private slots:
    void loadAdmissions();
    void loadCourses();
    void loadStudents();
    void loadFaculty();
    void markAttendance();
    void submitAttendance();

private:
    void setupUi();
    
    // Admissions
    QTableWidget* m_admissionsTable;
    QPushButton* m_admRefreshBtn;
    
    // Attendance
    QTableWidget* m_attendanceTable;
    QDateEdit* m_attendanceDate;
    QComboBox* m_attendanceCourse;
    QPushButton* m_attendSubmitBtn;
    
    // Courses
    QTableWidget* m_coursesTable;
    QLineEdit* m_courseSearch;
    
    // Students
    QTableWidget* m_studentsTable;
    QLineEdit* m_studentSearch;
    
    // Faculty
    QTableWidget* m_facultyTable;
    QLineEdit* m_facultySearch;
    
    // Timetable
    QTableWidget* m_timetableTable;
    
    // Subjects
    QTableWidget* m_subjectsTable;
    
    // Departments
    QTableWidget* m_departmentsTable;
    
    // Programs
    QTableWidget* m_programsTable;
};

#endif // ACADEMICMODULE_HPP
