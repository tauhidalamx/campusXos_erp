#ifndef EVENTSMODULE_HPP
#define EVENTSMODULE_HPP

#include <QWidget>
#include <QTableWidget>
#include <QLineEdit>
#include <QPushButton>

class EventsModule : public QWidget {
    Q_OBJECT
public:
    explicit EventsModule(QWidget* parent = nullptr);
    ~EventsModule() = default;

private slots:
    void registerEvent();
    void loadEvents();

private:
    void setupUi();

    QTableWidget* m_eventsTable;
    QLineEdit* m_eventNameInput;
    QLineEdit* m_venueInput;
    QPushButton* m_registerBtn;
};

#endif // EVENTSMODULE_HPP
