#ifndef CONNECTMODULE_HPP
#define CONNECTMODULE_HPP

#include <QWidget>
#include <QTableWidget>
#include <QLineEdit>
#include <QPushButton>
#include <QListWidget>
#include <QTextEdit>

class ConnectModule : public QWidget {
    Q_OBJECT
public:
    explicit ConnectModule(QWidget* parent = nullptr);
    ~ConnectModule() = default;

private slots:
    void loadPosts();
    void submitNewPost();
    void switchChatChannel(int row);
    void sendChatMessage();

private:
    void setupUi();
    
    // Tab 1 Widgets (Forums)
    QTableWidget* m_postsTable;
    QLineEdit* m_postInput;
    QPushButton* m_submitBtn;

    // Tab 2 Widgets (Workspace Chats)
    QListWidget* m_channelsList;
    QTextEdit* m_chatTerminal;
    QLineEdit* m_chatInput;
    QPushButton* m_sendChatBtn;
};

#endif // CONNECTMODULE_HPP
