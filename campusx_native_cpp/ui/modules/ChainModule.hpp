#ifndef CHAINMODULE_HPP
#define CHAINMODULE_HPP

#include <QWidget>
#include <QLineEdit>
#include <QLabel>
#include <QTableWidget>

class ChainModule : public QWidget {
    Q_OBJECT
public:
    explicit ChainModule(QWidget* parent = nullptr);
    ~ChainModule() = default;

private slots:
    void executeVerification();

private:
    void setupUi();
    
    QLineEdit* m_hashInput;
    QLabel* m_resultLabel;
    QTableWidget* m_txTable;
};

#endif // CHAINMODULE_HPP
