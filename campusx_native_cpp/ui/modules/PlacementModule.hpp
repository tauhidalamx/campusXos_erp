#ifndef PLACEMENTMODULE_HPP
#define PLACEMENTMODULE_HPP

#include <QWidget>
#include <QTableWidget>
#include <QPushButton>

class PlacementModule : public QWidget {
    Q_OBJECT
public:
    explicit PlacementModule(QWidget* parent = nullptr);
    ~PlacementModule() = default;

private slots:
    void applySelected();
    void loadJobs();

private:
    void setupUi();

    QTableWidget* m_jobsTable;
    QPushButton* m_applyBtn;
};

#endif // PLACEMENTMODULE_HPP
