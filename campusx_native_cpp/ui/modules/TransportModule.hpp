#ifndef TRANSPORTMODULE_HPP
#define TRANSPORTMODULE_HPP

#include <QWidget>
#include <QTableWidget>
#include <QPushButton>

class TransportModule : public QWidget {
    Q_OBJECT
public:
    explicit TransportModule(QWidget* parent = nullptr);
    ~TransportModule() = default;

private slots:
    void refreshSchedules();

private:
    void setupUi();

    QTableWidget* m_routesTable;
    QPushButton* m_refreshBtn;
};

#endif // TRANSPORTMODULE_HPP
