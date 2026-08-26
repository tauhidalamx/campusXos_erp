#ifndef HEALTHMODULE_HPP
#define HEALTHMODULE_HPP

#include <QWidget>
#include <QTableWidget>
#include <QLineEdit>
#include <QPushButton>

class HealthModule : public QWidget {
    Q_OBJECT
public:
    explicit HealthModule(QWidget* parent = nullptr);
    ~HealthModule() = default;

private slots:
    void scheduleAppointment();
    void loadAppointments();

private:
    void setupUi();

    QTableWidget* m_queueTable;
    QLineEdit* m_patientInput;
    QLineEdit* m_symptomInput;
    QPushButton* m_bookBtn;
};

#endif // HEALTHMODULE_HPP
