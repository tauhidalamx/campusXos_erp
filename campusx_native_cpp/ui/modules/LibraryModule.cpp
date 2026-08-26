#include "LibraryModule.hpp"
#include <QVBoxLayout>
#include <QHBoxLayout>
#include <QLabel>
#include <QHeaderView>
#include <QMessageBox>

LibraryModule::LibraryModule(QWidget* parent) : QWidget(parent) {
    setupUi();
    searchBooks();
}

void LibraryModule::setupUi() {
    QVBoxLayout* mainLayout = new QVBoxLayout(this);
    mainLayout->setContentsMargins(0, 0, 0, 0);
    mainLayout->setSpacing(10);

    QLabel* title = new QLabel("📚 Library Catalog & Academic Books", this);
    title->setStyleSheet("font-size: 14px; font-weight: bold;");
    mainLayout->addWidget(title);

    // Toolbar
    QFrame* toolCard = new QFrame(this);
    toolCard->setObjectName("card");
    QHBoxLayout* toolLayout = new QHBoxLayout(toolCard);
    toolLayout->setContentsMargins(10, 10, 10, 10);
    toolLayout->setSpacing(8);

    m_searchBar = new QLineEdit(this);
    m_searchBar->setPlaceholderText("Search books by title, author, or ISBN...");
    connect(m_searchBar, &QLineEdit::textChanged, this, &LibraryModule::searchBooks);

    m_borrowBtn = new QPushButton("📖 Borrow Book", this);
    connect(m_borrowBtn, &QPushButton::clicked, this, &LibraryModule::borrowSelected);

    toolLayout->addWidget(m_searchBar, 1);
    toolLayout->addWidget(m_borrowBtn);
    mainLayout->addWidget(toolCard);

    // Books table
    m_catalogTable = new QTableWidget(this);
    m_catalogTable->setColumnCount(4);
    m_catalogTable->setHorizontalHeaderLabels({"ISBN Code", "Book Title", "Author Name", "Availability Status"});
    m_catalogTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    m_catalogTable->setSelectionBehavior(QAbstractItemView::SelectRows);
    m_catalogTable->setSelectionMode(QAbstractItemView::SingleSelection);
    mainLayout->addWidget(m_catalogTable, 1);
}

void LibraryModule::searchBooks() {
    QString q = m_searchBar->text().trimmed().toLower();
    m_catalogTable->setRowCount(0);

    struct Book { QString isbn; QString title; QString author; QString status; };
    QList<Book> books = {
        {"978-0131103627", "The C Programming Language", "Brian W. Kernighan", "AVAILABLE"},
        {"978-0262033848", "Introduction to Algorithms", "Thomas H. Cormen", "LOANED (Due: July 20)"},
        {"978-0136083207", "Artificial Intelligence: A Modern Approach", "Stuart Russell", "AVAILABLE"},
        {"978-0596520687", "Designing Data-Intensive Applications", "Martin Kleppmann", "AVAILABLE"}
    };

    for (const Book& b : books) {
        if (q.isEmpty() || b.title.toLower().contains(q) || b.author.toLower().contains(q)) {
            int row = m_catalogTable->rowCount();
            m_catalogTable->insertRow(row);
            m_catalogTable->setItem(row, 0, new QTableWidgetItem(b.isbn));
            m_catalogTable->setItem(row, 1, new QTableWidgetItem(b.title));
            m_catalogTable->setItem(row, 2, new QTableWidgetItem(b.author));
            m_catalogTable->setItem(row, 3, new QTableWidgetItem(b.status));
        }
    }
}

void LibraryModule::borrowSelected() {
    int curRow = m_catalogTable->currentRow();
    if (curRow < 0) return;

    QString status = m_catalogTable->item(curRow, 3)->text();
    if (status != "AVAILABLE") {
        return;
    }

    m_catalogTable->item(curRow, 3)->setText("LOANED (Due: August 15)");
}
