#ifndef ADMINMODULE_HPP
#define ADMINMODULE_HPP

#include <QWidget>
#include <QTableWidget>
#include <QPushButton>
#include <QLineEdit>
#include <QComboBox>
#include <QTextEdit>

class AdminModule : public QWidget {
    Q_OBJECT
public:
    explicit AdminModule(QWidget* parent = nullptr);
    ~AdminModule() = default;

private slots:
    void addUser();
    void approveLeave();
    void publishAnnouncement();

private:
    void setupUi();
    QTableWidget* m_usersTable;
    QTableWidget* m_staffTable;
    QTableWidget* m_leaveTable;
    QTableWidget* m_announcementsTable;
    QTableWidget* m_complianceTable;
    QTableWidget* m_reportsTable;
    QLineEdit* m_userSearch;
    QComboBox* m_userRoleFilter;
    QPushButton* m_addUserBtn;
    QPushButton* m_approveLeaveBtn;
    QTextEdit* m_announcementText;
    QPushButton* m_publishAnnouncementBtn;
};

#endif // ADMINMODULE_HPP
