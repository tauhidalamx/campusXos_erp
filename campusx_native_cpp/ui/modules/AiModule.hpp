#ifndef AIMODULE_HPP
#define AIMODULE_HPP

#include <QWidget>
#include <QListWidget>
#include <QLineEdit>
#include <QPushButton>

class AiModule : public QWidget {
    Q_OBJECT
public:
    explicit AiModule(QWidget* parent = nullptr);
    ~AiModule() = default;

private slots:
    void submitMessage();

private:
    void setupUi();
    
    QListWidget* m_chatHistory;
    QLineEdit* m_chatInput;
    QPushButton* m_sendBtn;
};

#endif // AIMODULE_HPP
