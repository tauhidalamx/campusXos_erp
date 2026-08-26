#ifndef SOCMODULE_HPP
#define SOCMODULE_HPP

#include <QWidget>
#include <QTableWidget>
#include <QPushButton>

class SocModule : public QWidget {
    Q_OBJECT
public:
    explicit SocModule(QWidget* parent = nullptr);
    ~SocModule() = default;

private slots:
    void loadIncidents();
    void triggerAlert();

private:
    void setupUi();
    
    QTableWidget* m_incidentTable;
    QPushButton* m_alertBtn;
};

#endif // SOCMODULE_HPP
