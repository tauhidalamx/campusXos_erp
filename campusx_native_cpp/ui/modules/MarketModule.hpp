#ifndef MARKETMODULE_HPP
#define MARKETMODULE_HPP

#include <QWidget>
#include <QTableWidget>
#include <QPushButton>
#include <QLineEdit>
#include <QLabel>
#include <QComboBox>
#include <QListWidget>
#include <QCheckBox>
#include <QPainter>
#include <QVector>

// --- Helper Candlestick Custom Paint Widget ---
class TechnicalChartWidget : public QWidget {
    Q_OBJECT
public:
    explicit TechnicalChartWidget(QWidget* parent = nullptr);
    void setSymbol(const QString& symbol);
    void setIndicators(bool sma, bool ema, bool bollinger, bool vwap);

protected:
    void paintEvent(QPaintEvent* event) override;

private:
    QString m_symbol;
    QVector<double> m_prices;
    bool m_showSMA;
    bool m_showEMA;
    bool m_showBollinger;
    bool m_showVWAP;
};

// --- Main Native Market Module Widget ---
class MarketModule : public QWidget {
    Q_OBJECT
public:
    explicit MarketModule(QWidget* parent = nullptr);
    ~MarketModule() = default;

private slots:
    void loadMarketRates();
    void addWatchlistSymbol();
    void removeWatchlistSymbol();
    void executeTradeOrder();
    void filterScannerCategory(int tabIndex);
    void submitAiQuery();
    void addAlertTrigger();
    void deleteAlertTrigger();
    void validateCitationLedger();
    void syncChartSelection(int row, int col);

private:
    void setupUi();
    void initializeMockData();

    // --- Tab 1: Overview Widgets ---
    QTableWidget* m_overviewIndicesTable;
    QTableWidget* m_overviewSectorsTable;

    // --- Tab 2: Watchlist Widgets ---
    QTableWidget* m_watchlistTable;
    QLineEdit* m_watchlistSearchInput;
    QPushButton* m_watchlistAddBtn;
    QPushButton* m_watchlistRemoveBtn;

    // --- Tab 3: Technical Chart Widgets ---
    TechnicalChartWidget* m_chartCanvas;
    QComboBox* m_chartSymbolSelector;
    QCheckBox* m_smaCheck;
    QCheckBox* m_emaCheck;
    QCheckBox* m_bbCheck;
    QCheckBox* m_vwapCheck;

    // --- Tab 4: Portfolio & Order Desk Widgets ---
    QTableWidget* m_holdingsTable;
    QTableWidget* m_txHistoryTable;
    QLabel* m_cashBalanceLabel;
    QLabel* m_sharpeRatioLabel;
    QLabel* m_varLabel;
    QComboBox* m_tradeSymbolSelector;
    QComboBox* m_tradeTypeSelector;
    QLineEdit* m_tradeQtyInput;
    QPushButton* m_tradeSubmitBtn;
    double m_cashBalance;

    // --- Tab 5: Scanner Widgets ---
    QTableWidget* m_scannerTable;
    QComboBox* m_scannerCategorySelector;

    // --- Tab 6: AI Insights Widgets ---
    QComboBox* m_aiAgentSelector;
    QListWidget* m_aiChatHistory;
    QLineEdit* m_aiQueryInput;
    QPushButton* m_aiSendBtn;

    // --- Tab 7: Price Alerts Widgets ---
    QTableWidget* m_alertsTable;
    QComboBox* m_alertSymbolSelector;
    QComboBox* m_alertTypeSelector;
    QLineEdit* m_alertPriceInput;
    QPushButton* m_alertCreateBtn;
    QPushButton* m_alertDeleteBtn;

    // --- Tab 8: Research Ledger Widgets ---
    QTableWidget* m_researchGrantsTable;
    QTableWidget* m_researchLedgerTable;
    QLineEdit* m_citationCidInput;
    QPushButton* m_validateCidBtn;
};

#endif // MARKETMODULE_HPP
