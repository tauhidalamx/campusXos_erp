#ifndef RESEARCHMODULE_HPP
#define RESEARCHMODULE_HPP

#include <QWidget>
#include <QTableWidget>
#include <QLineEdit>
#include <QPushButton>

class ResearchModule : public QWidget {
    Q_OBJECT
public:
    explicit ResearchModule(QWidget* parent = nullptr);
    ~ResearchModule() = default;

private slots:
    void submitProposal();
    void loadResearchGrants();

private:
    void setupUi();

    QTableWidget* m_grantsTable;
    QLineEdit* m_titleInput;
    QLineEdit* m_budgetInput;
    QPushButton* m_submitBtn;
};

#endif // RESEARCHMODULE_HPP
