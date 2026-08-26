#ifndef LIBRARYMODULE_HPP
#define LIBRARYMODULE_HPP

#include <QWidget>
#include <QTableWidget>
#include <QLineEdit>
#include <QPushButton>

class LibraryModule : public QWidget {
    Q_OBJECT
public:
    explicit LibraryModule(QWidget* parent = nullptr);
    ~LibraryModule() = default;

private slots:
    void searchBooks();
    void borrowSelected();

private:
    void setupUi();

    QTableWidget* m_catalogTable;
    QLineEdit* m_searchBar;
    QPushButton* m_borrowBtn;
};

#endif // LIBRARYMODULE_HPP
