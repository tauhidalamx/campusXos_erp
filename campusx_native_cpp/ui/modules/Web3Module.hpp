#ifndef WEB3MODULE_HPP
#define WEB3MODULE_HPP

#include <QWidget>
#include <QTableWidget>
#include <QLineEdit>
#include <QPushButton>

class Web3Module : public QWidget {
    Q_OBJECT
public:
    explicit Web3Module(QWidget* parent = nullptr);
    ~Web3Module() = default;

private slots:
    void mintCredential();
    void loadCredentials();

private:
    void setupUi();

    QTableWidget* m_sbtTable;
    QLineEdit* m_recipientInput;
    QLineEdit* m_degreeInput;
    QPushButton* m_mintBtn;
};

#endif // WEB3MODULE_HPP
