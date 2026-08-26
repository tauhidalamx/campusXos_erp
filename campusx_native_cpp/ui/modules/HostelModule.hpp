#ifndef HOSTELMODULE_HPP
#define HOSTELMODULE_HPP

#include <QWidget>
#include <QTableWidget>
#include <QLineEdit>
#include <QPushButton>

class HostelModule : public QWidget {
    Q_OBJECT
public:
    explicit HostelModule(QWidget* parent = nullptr);
    ~HostelModule() = default;

private slots:
    void allocateRoom();
    void loadAllocations();

private:
    void setupUi();

    QTableWidget* m_roomsTable;
    QLineEdit* m_roomInput;
    QLineEdit* m_studentInput;
    QPushButton* m_allocateBtn;
};

#endif // HOSTELMODULE_HPP
