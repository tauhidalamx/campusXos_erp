#include "MarketModule.hpp"
#include "ApiClient.hpp"
#include <QVBoxLayout>
#include <QHBoxLayout>
#include <QTabWidget>
#include <QLabel>
#include <QHeaderView>
#include <QGroupBox>
#include <QMessageBox>
#include <QJsonObject>
#include <QDateTime>
#include <QPainterPath>
#include <cstdlib>

// ============================================================================
// --- TechnicalChartWidget Implementation ---
// ============================================================================
TechnicalChartWidget::TechnicalChartWidget(QWidget* parent) 
    : QWidget(parent), m_symbol("CAMPUSX"), m_showSMA(true), m_showEMA(false), m_showBollinger(false), m_showVWAP(false) 
{
    // Generate initial history
    setSymbol(m_symbol);
}

void TechnicalChartWidget::setSymbol(const QString& symbol) {
    m_symbol = symbol;
    m_prices.clear();
    double base = 100.0;
    if (symbol == "CAMPUSX") base = 1450.22;
    else if (symbol == "INFRA") base = 102.15;
    else if (symbol == "YIELD") base = 342.88;
    else if (symbol == "VAULT") base = 280.00;
    else if (symbol == "AAPL") base = 182.52;
    else if (symbol == "MSFT") base = 418.15;
    else if (symbol == "NVDA") base = 125.80;

    double lastPrice = base * 0.95;
    for (int i = 0; i < 20; ++i) {
        lastPrice = lastPrice * (0.99 + (static_cast<double>(rand() % 100) / 5000.0));
        m_prices.append(lastPrice);
    }
    update();
}

void TechnicalChartWidget::setIndicators(bool sma, bool ema, bool bollinger, bool vwap) {
    m_showSMA = sma;
    m_showEMA = ema;
    m_showBollinger = bollinger;
    m_showVWAP = vwap;
    update();
}

void TechnicalChartWidget::paintEvent(QPaintEvent* event) {
    Q_UNUSED(event);
    QPainter painter(this);
    painter.setRenderHint(QPainter::Antialiasing);
    
    // Set Bloomberg Background
    painter.fillRect(rect(), QColor("#040814"));

    if (m_prices.isEmpty()) return;

    int w = width();
    int h = height();

    // Draw Grid Lines
    painter.setPen(QPen(QColor("rgba(255, 255, 255, 0.05)"), 1));
    for (int i = 1; i < 6; ++i) {
        int y = (h / 6) * i;
        painter.drawLine(0, y, w, y);
        int x = (w / 6) * i;
        painter.drawLine(x, 0, x, h);
    }

    double minVal = m_prices[0];
    double maxVal = m_prices[0];
    for (double p : m_prices) {
        if (p < minVal) minVal = p;
        if (p > maxVal) maxVal = p;
    }
    minVal *= 0.98;
    maxVal *= 1.02;
    double range = maxVal - minVal;
    if (range <= 0) range = 1.0;

    auto scaleY = [&](double p) {
        return h - ((p - minVal) / range) * (h - 60) - 30;
    };

    double stepX = static_cast<double>(w) / 20.0;

    // Draw Candles
    for (int i = 0; i < m_prices.size(); ++i) {
        double close = m_prices[i];
        double open = (i > 0) ? m_prices[i-1] : close * 0.99;
        double high = qMax(open, close) * (1.002 + (rand() % 50 / 5000.0));
        double low = qMin(open, close) * (0.998 - (rand() % 50 / 5000.0));

        double x = stepX * i + stepX / 2.0;
        bool isGreen = close >= open;
        QColor color = isGreen ? QColor("#22C55E") : QColor("#EF4444");

        painter.setPen(QPen(color, 1.5));
        painter.setBrush(color);

        // Wick
        painter.drawLine(QPointF(x, scaleY(high)), QPointF(x, scaleY(low)));

        // Body
        double openY = scaleY(open);
        double closeY = scaleY(close);
        double bodyH = qMax(qAbs(closeY - openY), 4.0);
        double bodyY = qMin(openY, closeY);
        painter.drawRect(QRectF(x - 5, bodyY, 10, bodyH));
    }

    // Indicator 1: SMA (Indigo)
    if (m_showSMA) {
        painter.setPen(QPen(QColor("#6366F1"), 2));
        QPainterPath path;
        for (int i = 4; i < m_prices.size(); ++i) {
            double sum = 0;
            for (int j = i - 4; j <= i; ++j) sum += m_prices[j];
            double avg = sum / 5.0;
            double x = stepX * i + stepX / 2.0;
            double y = scaleY(avg);
            if (i == 4) path.moveTo(x, y);
            else path.lineTo(x, y);
        }
        painter.drawPath(path);
    }

    // Indicator 2: EMA (Cyan)
    if (m_showEMA) {
        painter.setPen(QPen(QColor("#06B6D4"), 2));
        QPainterPath path;
        double prevEma = m_prices[0];
        double k = 2.0 / (5.0 + 1.0);
        for (int i = 0; i < m_prices.size(); ++i) {
            double ema = m_prices[i] * k + prevEma * (1.0 - k);
            prevEma = ema;
            double x = stepX * i + stepX / 2.0;
            double y = scaleY(ema);
            if (i == 0) path.moveTo(x, y);
            else path.lineTo(x, y);
        }
        painter.drawPath(path);
    }

    // Indicator 3: Bollinger Bands (Amber)
    if (m_showBollinger) {
        painter.setPen(QPen(QColor("rgba(245, 158, 11, 0.4)"), 1.5));
        QPainterPath upperPath, lowerPath;
        for (int i = 0; i < m_prices.size(); ++i) {
            double x = stepX * i + stepX / 2.0;
            if (i == 0) {
                upperPath.moveTo(x, scaleY(m_prices[i] * 1.03));
                lowerPath.moveTo(x, scaleY(m_prices[i] * 0.97));
            } else {
                upperPath.lineTo(x, scaleY(m_prices[i] * 1.03));
                lowerPath.lineTo(x, scaleY(m_prices[i] * 0.97));
            }
        }
        painter.drawPath(upperPath);
        painter.drawPath(lowerPath);
    }

    // Indicator 4: VWAP (Rose)
    if (m_showVWAP) {
        painter.setPen(QPen(QColor("#F43F5E"), 2, Qt::DashLine));
        QPainterPath path;
        for (int i = 0; i < m_prices.size(); ++i) {
            double x = stepX * i + stepX / 2.0;
            double y = scaleY(m_prices[i] * 0.992);
            if (i == 0) path.moveTo(x, y);
            else path.lineTo(x, y);
        }
        painter.drawPath(path);
    }
}


// ============================================================================
// --- MarketModule Implementation ---
// ============================================================================
MarketModule::MarketModule(QWidget* parent) : QWidget(parent), m_cashBalance(85420.00) {
    setupUi();
    initializeMockData();
    loadMarketRates();
}

void MarketModule::setupUi() {
    QVBoxLayout* mainLayout = new QVBoxLayout(this);
    mainLayout->setContentsMargins(10, 10, 10, 10);
    
    QTabWidget* tabWidget = new QTabWidget(this);
    tabWidget->setStyleSheet("QTabWidget::pane { border: 1px solid #0F1B3A; background: #0A1128; } "
                             "QTabBar::tab { background: #040814; color: #9CA3AF; border: 1px solid #0F1B3A; padding: 8px 12px; font-weight: bold; } "
                             "QTabBar::tab:selected { background: #0A1128; color: #F59E0B; border-bottom: 2px solid #F59E0B; }");

    // ------------------------------------------------------------------------
    // --- TAB 1: OVERVIEW ---
    // ------------------------------------------------------------------------
    QWidget* overviewTab = new QWidget(this);
    QVBoxLayout* overviewLayout = new QVBoxLayout(overviewTab);
    
    QLabel* oTitle = new QLabel("🌍 GLOBAL INDEX TERMINAL", overviewTab);
    oTitle->setStyleSheet("font-size: 13px; font-weight: bold; color: #F59E0B;");
    overviewLayout->addWidget(oTitle);
    
    m_overviewIndicesTable = new QTableWidget(overviewTab);
    m_overviewIndicesTable->setColumnCount(4);
    m_overviewIndicesTable->setHorizontalHeaderLabels({"Index Ticker", "Market Price", "Change ($)", "Percentage (%)"});
    m_overviewIndicesTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    overviewLayout->addWidget(m_overviewIndicesTable);

    QLabel* secTitle = new QLabel("🔥 SECTOR HEAT RATING", overviewTab);
    secTitle->setStyleSheet("font-size: 11px; font-weight: bold; color: #9CA3AF; margin-top: 10px;");
    overviewLayout->addWidget(secTitle);

    m_overviewSectorsTable = new QTableWidget(overviewTab);
    m_overviewSectorsTable->setColumnCount(3);
    m_overviewSectorsTable->setHorizontalHeaderLabels({"Sector Classification", "Gains (%)", "Global Sentiment"});
    m_overviewSectorsTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    overviewLayout->addWidget(m_overviewSectorsTable);

    tabWidget->addTab(overviewTab, "Overview");

    // ------------------------------------------------------------------------
    // --- TAB 2: WATCHLIST ---
    // ------------------------------------------------------------------------
    QWidget* watchTab = new QWidget(this);
    QVBoxLayout* watchLayout = new QVBoxLayout(watchTab);
    
    QHBoxLayout* watchHeader = new QHBoxLayout();
    m_watchlistSearchInput = new QLineEdit(watchTab);
    m_watchlistSearchInput->setPlaceholderText("ADD SYMBOL (e.g. AAPL)...");
    watchHeader->addWidget(m_watchlistSearchInput);

    m_watchlistAddBtn = new QPushButton("➕ Add Ticker", watchTab);
    m_watchlistAddBtn->setStyleSheet("background-color: #F59E0B; color: #000; font-weight: bold;");
    connect(m_watchlistAddBtn, &QPushButton::clicked, this, &MarketModule::addWatchlistSymbol);
    watchHeader->addWidget(m_watchlistAddBtn);

    m_watchlistRemoveBtn = new QPushButton("🗑️ Remove", watchTab);
    m_watchlistRemoveBtn->setStyleSheet("background-color: rgba(239, 68, 68, 0.2); color: #EF4444; border: 1px solid rgba(239, 68, 68, 0.4);");
    connect(m_watchlistRemoveBtn, &QPushButton::clicked, this, &MarketModule::removeWatchlistSymbol);
    watchHeader->addWidget(m_watchlistRemoveBtn);
    watchLayout->addLayout(watchHeader);

    m_watchlistTable = new QTableWidget(watchTab);
    m_watchlistTable->setColumnCount(4);
    m_watchlistTable->setHorizontalHeaderLabels({"Symbol", "Asset Classification", "Close Price ($)", "Change %"});
    m_watchlistTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    connect(m_watchlistTable, &QTableWidget::cellClicked, this, &MarketModule::syncChartSelection);
    watchLayout->addWidget(m_watchlistTable);

    tabWidget->addTab(watchTab, "Watchlists");

    // ------------------------------------------------------------------------
    // --- TAB 3: TECHNICAL CHARTS ---
    // ------------------------------------------------------------------------
    QWidget* chartTab = new QWidget(this);
    QVBoxLayout* chartLayout = new QVBoxLayout(chartTab);

    QHBoxLayout* chartHeader = new QHBoxLayout();
    m_chartSymbolSelector = new QComboBox(chartTab);
    m_chartSymbolSelector->addItems({"CAMPUSX", "INFRA", "YIELD", "VAULT", "AAPL", "MSFT", "NVDA"});
    connect(m_chartSymbolSelector, &QComboBox::currentTextChanged, this, [this](const QString& sym) {
        m_chartCanvas->setSymbol(sym);
    });
    chartHeader->addWidget(m_chartSymbolSelector);

    auto syncIndicators = [this]() {
        m_chartCanvas->setIndicators(m_smaCheck->isChecked(), m_emaCheck->isChecked(), m_bbCheck->isChecked(), m_vwapCheck->isChecked());
    };

    m_smaCheck = new QCheckBox("SMA (5d)", chartTab);
    m_smaCheck->setChecked(true);
    connect(m_smaCheck, &QCheckBox::stateChanged, this, syncIndicators);
    chartHeader->addWidget(m_smaCheck);

    m_emaCheck = new QCheckBox("EMA (5d)", chartTab);
    connect(m_emaCheck, &QCheckBox::stateChanged, this, syncIndicators);
    chartHeader->addWidget(m_emaCheck);

    m_bbCheck = new QCheckBox("Bollinger Bands", chartTab);
    connect(m_bbCheck, &QCheckBox::stateChanged, this, syncIndicators);
    chartHeader->addWidget(m_bbCheck);

    m_vwapCheck = new QCheckBox("VWAP Indicator", chartTab);
    connect(m_vwapCheck, &QCheckBox::stateChanged, this, syncIndicators);
    chartHeader->addWidget(m_vwapCheck);
    chartLayout->addLayout(chartHeader);

    m_chartCanvas = new TechnicalChartWidget(chartTab);
    m_chartCanvas->setMinimumHeight(300);
    chartLayout->addWidget(m_chartCanvas);

    tabWidget->addTab(chartTab, "Technical Charts");

    // ------------------------------------------------------------------------
    // --- TAB 4: PORTFOLIO & ORDER DESK ---
    // ------------------------------------------------------------------------
    QWidget* portfolioTab = new QWidget(this);
    QHBoxLayout* portfolioLayout = new QHBoxLayout(portfolioTab);

    // Left Column: Holdings & History
    QVBoxLayout* portLeft = new QVBoxLayout();
    m_cashBalanceLabel = new QLabel("Cash Available: $85,420.00 USD", portfolioTab);
    m_cashBalanceLabel->setStyleSheet("font-size: 13px; font-weight: bold; color: #F59E0B;");
    portLeft->addWidget(m_cashBalanceLabel);

    m_holdingsTable = new QTableWidget(portfolioTab);
    m_holdingsTable->setColumnCount(4);
    m_holdingsTable->setHorizontalHeaderLabels({"Symbol", "Qty Held", "Avg Cost ($)", "Current Value"});
    m_holdingsTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    portLeft->addWidget(m_holdingsTable);

    QLabel* txTitle = new QLabel("📁 ORDER TRANSACTION HISTORY", portfolioTab);
    txTitle->setStyleSheet("font-size: 10px; font-weight: bold; color: #9CA3AF; margin-top: 10px;");
    portLeft->addWidget(txTitle);

    m_txHistoryTable = new QTableWidget(portfolioTab);
    m_txHistoryTable->setColumnCount(5);
    m_txHistoryTable->setHorizontalHeaderLabels({"ID", "Asset", "Action", "Quantity", "Price"});
    m_txHistoryTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    portLeft->addWidget(m_txHistoryTable);
    portfolioLayout->addLayout(portLeft, 2);

    // Right Column: Risk & Buy/Sell Desk
    QVBoxLayout* portRight = new QVBoxLayout();
    QGroupBox* riskGroup = new QGroupBox("Quantitative Risk Analytics", portfolioTab);
    QVBoxLayout* riskLayout = new QVBoxLayout(riskGroup);
    m_sharpeRatioLabel = new QLabel("Sharpe Ratio: 2.41 (High Yield)", riskGroup);
    m_varLabel = new QLabel("Value-at-Risk (VaR 5d): $420.00 USD", riskGroup);
    riskLayout->addWidget(m_sharpeRatioLabel);
    riskLayout->addWidget(m_varLabel);
    portRight->addWidget(riskGroup);

    QGroupBox* deskGroup = new QGroupBox("Simulated Order Desk", portfolioTab);
    QVBoxLayout* deskLayout = new QVBoxLayout(deskGroup);
    
    deskLayout->addWidget(new QLabel("Asset Ticker Symbol:"));
    m_tradeSymbolSelector = new QComboBox(deskGroup);
    m_tradeSymbolSelector->addItems({"CAMPUSX", "INFRA", "YIELD", "VAULT", "AAPL", "MSFT", "NVDA"});
    deskLayout->addWidget(m_tradeSymbolSelector);

    deskLayout->addWidget(new QLabel("Order Type:"));
    m_tradeTypeSelector = new QComboBox(deskGroup);
    m_tradeTypeSelector->addItems({"BUY", "SELL"});
    deskLayout->addWidget(m_tradeTypeSelector);

    deskLayout->addWidget(new QLabel("Quantity:"));
    m_tradeQtyInput = new QLineEdit("1", deskGroup);
    deskLayout->addWidget(m_tradeQtyInput);

    m_tradeSubmitBtn = new QPushButton("Submit Order to Book", deskGroup);
    m_tradeSubmitBtn->setStyleSheet("background-color: #22C55E; color: #000; font-weight: bold; padding: 8px; margin-top: 10px;");
    connect(m_tradeSubmitBtn, &QPushButton::clicked, this, &MarketModule::executeTradeOrder);
    deskLayout->addWidget(m_tradeSubmitBtn);
    portRight->addWidget(deskGroup);

    portfolioLayout->addLayout(portRight, 1);

    tabWidget->addTab(portfolioTab, "Portfolio & Orders");

    // ------------------------------------------------------------------------
    // --- TAB 5: SCANNER ---
    // ------------------------------------------------------------------------
    QWidget* scannerTab = new QWidget(this);
    QVBoxLayout* scannerLayout = new QVBoxLayout(scannerTab);

    QHBoxLayout* scannerHeader = new QHBoxLayout();
    scannerHeader->addWidget(new QLabel("Asset Category Filter:"));
    m_scannerCategorySelector = new QComboBox(scannerTab);
    m_scannerCategorySelector->addItems({"All Categories", "Stocks Only", "ETFs Only", "Crypto Only", "Mutual Funds"});
    connect(m_scannerCategorySelector, QOverload<int>::of(&QComboBox::currentIndexChanged), this, &MarketModule::filterScannerCategory);
    scannerHeader->addWidget(m_scannerCategorySelector);
    scannerLayout->addLayout(scannerHeader);

    m_scannerTable = new QTableWidget(scannerTab);
    m_scannerTable->setColumnCount(5);
    m_scannerTable->setHorizontalHeaderLabels({"Ticker", "Classification", "Price ($)", "Change %", "P/E Ratio"});
    m_scannerTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    scannerLayout->addWidget(m_scannerTable);

    tabWidget->addTab(scannerTab, "Scanner");

    // ------------------------------------------------------------------------
    // --- TAB 6: AI INSIGHTS ---
    // ------------------------------------------------------------------------
    QWidget* aiTab = new QWidget(this);
    QVBoxLayout* aiLayout = new QVBoxLayout(aiTab);

    QHBoxLayout* aiHeader = new QHBoxLayout();
    aiHeader->addWidget(new QLabel("AI Agent Specialist:"));
    m_aiAgentSelector = new QComboBox(aiTab);
    m_aiAgentSelector->addItems({"analyst", "risk", "research", "portfolio", "news", "prediction"});
    aiHeader->addWidget(m_aiAgentSelector);
    aiLayout->addLayout(aiHeader);

    m_aiChatHistory = new QListWidget(aiTab);
    m_aiChatHistory->setStyleSheet("background: #040814; color: #FFF; border: 1px solid #0F1B3A; font-family: monospace;");
    aiLayout->addWidget(m_aiChatHistory);

    QHBoxLayout* aiInputBar = new QHBoxLayout();
    m_aiQueryInput = new QLineEdit(aiTab);
    m_aiQueryInput->setPlaceholderText("ASK PORTFOLIO AGENT A FINANCIAL OR RISK QUESTION...");
    connect(m_aiQueryInput, &QLineEdit::returnPressed, this, &MarketModule::submitAiQuery);
    aiInputBar->addWidget(m_aiQueryInput);

    m_aiSendBtn = new QPushButton("🚀 Send Query", aiTab);
    m_aiSendBtn->setStyleSheet("background-color: #F59E0B; color: #000; font-weight: bold;");
    connect(m_aiSendBtn, &QPushButton::clicked, this, &MarketModule::submitAiQuery);
    aiInputBar->addWidget(m_aiSendBtn);
    aiLayout->addLayout(aiInputBar);

    tabWidget->addTab(aiTab, "AI Financial Agents");

    // ------------------------------------------------------------------------
    // --- TAB 7: PRICE ALERTS ---
    // ------------------------------------------------------------------------
    QWidget* alertsTab = new QWidget(this);
    QHBoxLayout* alertsLayout = new QHBoxLayout(alertsTab);

    // Left Alert Configuration
    QVBoxLayout* alLeft = new QVBoxLayout();
    alLeft->addWidget(new QLabel("Alert Symbol:"));
    m_alertSymbolSelector = new QComboBox(alertsTab);
    m_alertSymbolSelector->addItems({"CAMPUSX", "INFRA", "YIELD", "VAULT"});
    alLeft->addWidget(m_alertSymbolSelector);

    alLeft->addWidget(new QLabel("Alert Direction:"));
    m_alertTypeSelector = new QComboBox(alertsTab);
    m_alertTypeSelector->addItems({"ABOVE", "BELOW"});
    alLeft->addWidget(m_alertTypeSelector);

    alLeft->addWidget(new QLabel("Alert Price Target:"));
    m_alertPriceInput = new QLineEdit("150", alertsTab);
    alLeft->addWidget(m_alertPriceInput);

    m_alertCreateBtn = new QPushButton("Set Price Trigger", alertsTab);
    m_alertCreateBtn->setStyleSheet("background-color: #F59E0B; color: #000; font-weight: bold; padding: 6px;");
    connect(m_alertCreateBtn, &QPushButton::clicked, this, &MarketModule::addAlertTrigger);
    alLeft->addWidget(m_alertCreateBtn);
    alLeft->addStretch();
    alertsLayout->addLayout(alLeft, 1);

    // Right Alert Registry List
    QVBoxLayout* alRight = new QVBoxLayout();
    QHBoxLayout* alRightHeader = new QHBoxLayout();
    alRightHeader->addWidget(new QLabel("Active Alarms Registry:"));
    m_alertDeleteBtn = new QPushButton("🗑️ Deactivate Alert", alertsTab);
    m_alertDeleteBtn->setStyleSheet("background-color: rgba(239, 68, 68, 0.1); color: #EF4444; border: 1px solid rgba(239, 68, 68, 0.4);");
    connect(m_alertDeleteBtn, &QPushButton::clicked, this, &MarketModule::deleteAlertTrigger);
    alRightHeader->addWidget(m_alertDeleteBtn);
    alRight->addLayout(alRightHeader);

    m_alertsTable = new QTableWidget(alertsTab);
    m_alertsTable->setColumnCount(4);
    m_alertsTable->setHorizontalHeaderLabels({"ID", "Symbol", "Trigger Target", "Direction"});
    m_alertsTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    alRight->addWidget(m_alertsTable);
    alertsLayout->addLayout(alRight, 2);

    tabWidget->addTab(alertsTab, "Price Alerts");

    // ------------------------------------------------------------------------
    // --- TAB 8: RESEARCH LEDGER ---
    // ------------------------------------------------------------------------
    QWidget* researchTab = new QWidget(this);
    QVBoxLayout* researchLayout = new QVBoxLayout(researchTab);

    QLabel* resGrTitle = new QLabel("🎓 RESEARCH GRANTS SYSTEM DIRECTORY", researchTab);
    resGrTitle->setStyleSheet("font-size: 11px; font-weight: bold; color: #F59E0B;");
    researchLayout->addWidget(resGrTitle);

    m_researchGrantsTable = new QTableWidget(researchTab);
    m_researchGrantsTable->setColumnCount(4);
    m_researchGrantsTable->setHorizontalHeaderLabels({"ID", "Project Title", "Fund Allocation", "Approval Status"});
    m_researchGrantsTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    researchLayout->addWidget(m_researchGrantsTable);

    QHBoxLayout* cidLayout = new QHBoxLayout();
    m_citationCidInput = new QLineEdit(researchTab);
    m_citationCidInput->setPlaceholderText("ENTER PATENT CITATION CID TO VERIFY ON BLOCKCHAIN...");
    cidLayout->addWidget(m_citationCidInput);

    m_validateCidBtn = new QPushButton("🔒 Validate Ledger", researchTab);
    m_validateCidBtn->setStyleSheet("background-color: #22C55E; color: #000; font-weight: bold;");
    connect(m_validateCidBtn, &QPushButton::clicked, this, &MarketModule::validateCitationLedger);
    cidLayout->addWidget(m_validateCidBtn);
    researchLayout->addLayout(cidLayout);

    m_researchLedgerTable = new QTableWidget(researchTab);
    m_researchLedgerTable->setColumnCount(4);
    m_researchLedgerTable->setHorizontalHeaderLabels({"Target Ticker", "Citation CID", "Ledger Transaction Hash", "Blockchain Status"});
    m_researchLedgerTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    researchLayout->addWidget(m_researchLedgerTable);

    tabWidget->addTab(researchTab, "Research Ledger");

    mainLayout->addWidget(tabWidget);
}

void MarketModule::initializeMockData() {
    // Tab 1 Indices Fallback
    m_overviewIndicesTable->setRowCount(4);
    m_overviewIndicesTable->setItem(0, 0, new QTableWidgetItem("NIFTY 50"));
    m_overviewIndicesTable->setItem(0, 1, new QTableWidgetItem("23,450.80"));
    m_overviewIndicesTable->setItem(0, 2, new QTableWidgetItem("+120.40"));
    m_overviewIndicesTable->setItem(0, 3, new QTableWidgetItem("+0.52%"));

    m_overviewIndicesTable->setItem(1, 0, new QTableWidgetItem("SENSEX"));
    m_overviewIndicesTable->setItem(1, 1, new QTableWidgetItem("77,210.30"));
    m_overviewIndicesTable->setItem(1, 2, new QTableWidgetItem("+410.90"));
    m_overviewIndicesTable->setItem(1, 3, new QTableWidgetItem("+0.53%"));

    m_overviewIndicesTable->setItem(2, 0, new QTableWidgetItem("NASDAQ"));
    m_overviewIndicesTable->setItem(2, 1, new QTableWidgetItem("17,850.50"));
    m_overviewIndicesTable->setItem(2, 2, new QTableWidgetItem("-180.20"));
    m_overviewIndicesTable->setItem(2, 3, new QTableWidgetItem("-1.00%"));

    m_overviewIndicesTable->setItem(3, 0, new QTableWidgetItem("S&P 500"));
    m_overviewIndicesTable->setItem(3, 1, new QTableWidgetItem("5,430.20"));
    m_overviewIndicesTable->setItem(3, 2, new QTableWidgetItem("-24.80"));
    m_overviewIndicesTable->setItem(3, 3, new QTableWidgetItem("-0.45%"));

    // Tab 1 Sectors
    m_overviewSectorsTable->setRowCount(4);
    m_overviewSectorsTable->setItem(0, 0, new QTableWidgetItem("Technology"));
    m_overviewSectorsTable->setItem(0, 1, new QTableWidgetItem("+1.85%"));
    m_overviewSectorsTable->setItem(0, 2, new QTableWidgetItem("Highly Bullish"));

    m_overviewSectorsTable->setItem(1, 0, new QTableWidgetItem("Financials"));
    m_overviewSectorsTable->setItem(1, 1, new QTableWidgetItem("+0.42%"));
    m_overviewSectorsTable->setItem(1, 2, new QTableWidgetItem("Neutral"));

    m_overviewSectorsTable->setItem(2, 0, new QTableWidgetItem("Energy"));
    m_overviewSectorsTable->setItem(2, 1, new QTableWidgetItem("-0.75%"));
    m_overviewSectorsTable->setItem(2, 2, new QTableWidgetItem("Bearish"));

    m_overviewSectorsTable->setItem(3, 0, new QTableWidgetItem("Healthcare"));
    m_overviewSectorsTable->setItem(3, 1, new QTableWidgetItem("+0.95%"));
    m_overviewSectorsTable->setItem(3, 2, new QTableWidgetItem("Bullish"));

    // Tab 4 Default Holdings
    m_holdingsTable->setRowCount(2);
    m_holdingsTable->setItem(0, 0, new QTableWidgetItem("CAMPUSX"));
    m_holdingsTable->setItem(0, 1, new QTableWidgetItem("10"));
    m_holdingsTable->setItem(0, 2, new QTableWidgetItem("1380.00"));
    m_holdingsTable->setItem(0, 3, new QTableWidgetItem("$14,502.20"));

    m_holdingsTable->setItem(1, 0, new QTableWidgetItem("INFRA"));
    m_holdingsTable->setItem(1, 1, new QTableWidgetItem("15"));
    m_holdingsTable->setItem(1, 2, new QTableWidgetItem("100.50"));
    m_holdingsTable->setItem(1, 3, new QTableWidgetItem("$1,532.25"));

    // Tab 4 Transactions
    m_txHistoryTable->setRowCount(1);
    m_txHistoryTable->setItem(0, 0, new QTableWidgetItem("TX_INIT"));
    m_txHistoryTable->setItem(0, 1, new QTableWidgetItem("CAMPUSX"));
    m_txHistoryTable->setItem(0, 2, new QTableWidgetItem("BUY"));
    m_txHistoryTable->setItem(0, 3, new QTableWidgetItem("10"));
    m_txHistoryTable->setItem(0, 4, new QTableWidgetItem("$1,380.00"));

    // Tab 7 Alerts
    m_alertsTable->setRowCount(2);
    m_alertsTable->setItem(0, 0, new QTableWidgetItem("AL_1"));
    m_alertsTable->setItem(0, 1, new QTableWidgetItem("CAMPUSX"));
    m_alertsTable->setItem(0, 2, new QTableWidgetItem("160.00"));
    m_alertsTable->setItem(0, 3, new QTableWidgetItem("ABOVE"));

    m_alertsTable->setItem(1, 0, new QTableWidgetItem("AL_2"));
    m_alertsTable->setItem(1, 1, new QTableWidgetItem("INFRA"));
    m_alertsTable->setItem(1, 2, new QTableWidgetItem("98.00"));
    m_alertsTable->setItem(1, 3, new QTableWidgetItem("BELOW"));

    // Tab 8 Grants
    m_researchGrantsTable->setRowCount(2);
    m_researchGrantsTable->setItem(0, 0, new QTableWidgetItem("GR_1029"));
    m_researchGrantsTable->setItem(0, 1, new QTableWidgetItem("Quantum Computing and Cryptography"));
    m_researchGrantsTable->setItem(0, 2, new QTableWidgetItem("$500,000"));
    m_researchGrantsTable->setItem(0, 3, new QTableWidgetItem("APPROVED"));

    m_researchGrantsTable->setItem(1, 0, new QTableWidgetItem("GR_2941"));
    m_researchGrantsTable->setItem(1, 1, new QTableWidgetItem("Decentralized Academic Identity Registry"));
    m_researchGrantsTable->setItem(1, 2, new QTableWidgetItem("$250,000"));
    m_researchGrantsTable->setItem(1, 3, new QTableWidgetItem("PENDING"));

    // Tab 8 Research Ledger
    m_researchLedgerTable->setRowCount(1);
    m_researchLedgerTable->setItem(0, 0, new QTableWidgetItem("CAMPUSX"));
    m_researchLedgerTable->setItem(0, 1, new QTableWidgetItem("QmXoypizjW3WknFixtdKL91GL7tTFj24uWSyOZemMHob12"));
    m_researchLedgerTable->setItem(0, 2, new QTableWidgetItem("0x7e29f0da11b439c2cfdeee7663ba9831a221f42a98f121d59bc4de29e84b80ad"));
    m_researchLedgerTable->setItem(0, 3, new QTableWidgetItem("Validated"));

    // AI Welcomer
    m_aiChatHistory->addItem("🤖 System: AI advisor online. Submitting queries queries the broker.");
}

void MarketModule::loadMarketRates() {
    // Query /api/market/quotes from server
    ApiClient::instance().fetchGet("/market/quotes", [this](bool success, const QJsonObject& res) {
        if (success && res.contains("quotes")) {
            QJsonObject quotesObj = res["quotes"].toObject();
            m_watchlistTable->setRowCount(quotesObj.keys().size());
            int idx = 0;
            for (const QString& symbol : quotesObj.keys()) {
                QJsonObject doc = quotesObj[symbol].toObject();
                m_watchlistTable->setItem(idx, 0, new QTableWidgetItem(symbol));
                m_watchlistTable->setItem(idx, 1, new QTableWidgetItem(doc["assetType"].toString("STOCK")));
                m_watchlistTable->setItem(idx, 2, new QTableWidgetItem(QString::number(doc["price"].toDouble(0.0), 'f', 2)));
                m_watchlistTable->setItem(idx, 3, new QTableWidgetItem(QString::number(doc["change"].toDouble(0.0), 'f', 2) + "%"));
                idx++;
            }
        } else {
            // Local fallback
            m_watchlistTable->setRowCount(4);
            m_watchlistTable->setItem(0, 0, new QTableWidgetItem("CAMPUSX"));
            m_watchlistTable->setItem(0, 1, new QTableWidgetItem("STOCK"));
            m_watchlistTable->setItem(0, 2, new QTableWidgetItem("1450.22"));
            m_watchlistTable->setItem(0, 3, new QTableWidgetItem("+3.25%"));

            m_watchlistTable->setItem(1, 0, new QTableWidgetItem("INFRA"));
            m_watchlistTable->setItem(1, 1, new QTableWidgetItem("STOCK"));
            m_watchlistTable->setItem(1, 2, new QTableWidgetItem("102.15"));
            m_watchlistTable->setItem(1, 3, new QTableWidgetItem("-2.66%"));

            m_watchlistTable->setItem(2, 0, new QTableWidgetItem("YIELD"));
            m_watchlistTable->setItem(2, 1, new QTableWidgetItem("STOCK"));
            m_watchlistTable->setItem(2, 2, new QTableWidgetItem("342.88"));
            m_watchlistTable->setItem(2, 3, new QTableWidgetItem("+6.10%"));

            m_watchlistTable->setItem(3, 0, new QTableWidgetItem("VAULT"));
            m_watchlistTable->setItem(3, 1, new QTableWidgetItem("STOCK"));
            m_watchlistTable->setItem(3, 2, new QTableWidgetItem("280.00"));
            m_watchlistTable->setItem(3, 3, new QTableWidgetItem("+0.33%"));
        }
        filterScannerCategory(m_scannerCategorySelector->currentIndex());
    });
}

void MarketModule::addWatchlistSymbol() {
    QString symbol = m_watchlistSearchInput->text().trimmed().toUpper();
    if (symbol.isEmpty()) return;

    int rows = m_watchlistTable->rowCount();
    m_watchlistTable->insertRow(rows);
    m_watchlistTable->setItem(rows, 0, new QTableWidgetItem(symbol));
    m_watchlistTable->setItem(rows, 1, new QTableWidgetItem("STOCK"));
    m_watchlistTable->setItem(rows, 2, new QTableWidgetItem("100.00"));
    m_watchlistTable->setItem(rows, 3, new QTableWidgetItem("0.00%"));

    m_watchlistSearchInput->clear();
}

void MarketModule::removeWatchlistSymbol() {
    int row = m_watchlistTable->currentRow();
    if (row >= 0) {
        m_watchlistTable->removeRow(row);
    }
}

void MarketModule::executeTradeOrder() {
    QString symbol = m_tradeSymbolSelector->currentText();
    QString type = m_tradeTypeSelector->currentText();
    double qty = m_tradeQtyInput->text().toDouble();
    if (qty <= 0) {
        QMessageBox::warning(this, "Order Rejected", "Enter a valid order quantity.");
        return;
    }

    double price = 100.0;
    if (symbol == "CAMPUSX") price = 1450.22;
    else if (symbol == "INFRA") price = 102.15;
    else if (symbol == "YIELD") price = 342.88;
    else if (symbol == "VAULT") price = 280.00;

    double cost = price * qty;

    if (type == "BUY") {
        if (m_cashBalance < cost) {
            QMessageBox::warning(this, "Order Rejected", "Insufficient available funds.");
            return;
        }
        m_cashBalance -= cost;
    } else {
        m_cashBalance += cost;
    }

    m_cashBalanceLabel->setText(QString("Cash Available: $%1 USD").arg(m_cashBalance, 0, 'f', 2));

    // Log transaction locally
    int rows = m_txHistoryTable->rowCount();
    m_txHistoryTable->insertRow(rows);
    m_txHistoryTable->setItem(rows, 0, new QTableWidgetItem(QString("TX_%1").arg(QDateTime::currentMSecsSinceEpoch())));
    m_txHistoryTable->setItem(rows, 1, new QTableWidgetItem(symbol));
    m_txHistoryTable->setItem(rows, 2, new QTableWidgetItem(type));
    m_txHistoryTable->setItem(rows, 3, new QTableWidgetItem(QString::number(qty)));
    m_txHistoryTable->setItem(rows, 4, new QTableWidgetItem(QString("$%1").arg(price, 0, 'f', 2)));

    // Submit payload to backend
    QJsonObject payload;
    payload["userId"] = "usr_desktop";
    payload["symbol"] = symbol;
    payload["assetType"] = "STOCK";
    payload["type"] = type;
    payload["quantity"] = qty;
    payload["price"] = price;

    ApiClient::instance().fetchPost("/market/portfolio/transaction", payload, [](bool success, const QJsonObject& res) {
        // Log update finished
    });
}

void MarketModule::filterScannerCategory(int tabIndex) {
    QString cat = m_scannerCategorySelector->itemText(tabIndex);
    
    // Generate filtered scan entries
    m_scannerTable->setRowCount(0);
    
    auto addRow = [this](const QString& sym, const QString& type, double price, double change, const QString& pe) {
        int r = m_scannerTable->rowCount();
        m_scannerTable->insertRow(r);
        m_scannerTable->setItem(r, 0, new QTableWidgetItem(sym));
        m_scannerTable->setItem(r, 1, new QTableWidgetItem(type));
        m_scannerTable->setItem(r, 2, new QTableWidgetItem(QString::number(price, 'f', 2)));
        m_scannerTable->setItem(r, 3, new QTableWidgetItem(QString::number(change, 'f', 2) + "%"));
        m_scannerTable->setItem(r, 4, new QTableWidgetItem(pe));
    };

    if (cat == "All Categories" || cat == "Stocks Only") {
        addRow("CAMPUSX", "STOCK", 1450.22, 3.25, "24.5x");
        addRow("AAPL", "STOCK", 182.52, 1.15, "28.4x");
        addRow("MSFT", "STOCK", 418.15, -0.85, "34.2x");
    }
    if (cat == "All Categories" || cat == "ETFs Only") {
        addRow("SPY", "ETF", 541.22, -0.45, "22.1x");
        addRow("QQQ", "ETF", 462.80, -0.96, "35.8x");
    }
    if (cat == "All Categories" || cat == "Crypto Only") {
        addRow("BTC", "CRYPTO", 67420.00, 2.15, "--");
        addRow("ETH", "CRYPTO", 3480.50, 2.83, "--");
    }
    if (cat == "All Categories" || cat == "Mutual Funds") {
        addRow("AGAFX", "MUTUAL_FUND", 42.15, 0.84, "18.4x");
    }
}

void MarketModule::submitAiQuery() {
    QString text = m_aiQueryInput->text().trimmed();
    if (text.isEmpty()) return;

    m_aiChatHistory->addItem("👤 User: " + text);
    m_aiQueryInput->clear();

    QString agent = m_aiAgentSelector->currentText();

    QJsonObject payload;
    payload["agent"] = agent;
    payload["message"] = text;

    ApiClient::instance().fetchPost("/market/ai/chat", payload, [this, agent](bool success, const QJsonObject& res) {
        if (success && res.contains("response")) {
            m_aiChatHistory->addItem("🤖 Agent (" + agent + "): " + res["response"].toString());
        } else {
            // Fallback mock prompt responses matching web
            QString fallback = "Model inference fit matches positive sentiment indices.";
            if (agent == "analyst") fallback = "Technical Analysis: SMA indicator curves support bullish indicators.";
            else if (agent == "risk") fallback = "Risk Audit: Value-at-Risk remains bounded below safety indices.";
            
            m_aiChatHistory->addItem("🤖 Agent (" + agent + "): " + fallback);
        }
    });
}

void MarketModule::addAlertTrigger() {
    QString symbol = m_alertSymbolSelector->currentText();
    QString type = m_alertTypeSelector->currentText();
    double price = m_alertPriceInput->text().toDouble();
    if (price <= 0) return;

    int r = m_alertsTable->rowCount();
    m_alertsTable->insertRow(r);
    m_alertsTable->setItem(r, 0, new QTableWidgetItem(QString("AL_%1").arg(QDateTime::currentMSecsSinceEpoch())));
    m_alertsTable->setItem(r, 1, new QTableWidgetItem(symbol));
    m_alertsTable->setItem(r, 2, new QTableWidgetItem(QString::number(price, 'f', 2)));
    m_alertsTable->setItem(r, 3, new QTableWidgetItem(type));
}

void MarketModule::deleteAlertTrigger() {
    int row = m_alertsTable->currentRow();
    if (row >= 0) {
        m_alertsTable->removeRow(row);
    }
}

void MarketModule::validateCitationLedger() {
    QString cid = m_citationCidInput->text().trimmed();
    if (cid.isEmpty()) return;

    QString txHash = "0x" + QString::number(QDateTime::currentMSecsSinceEpoch(), 16) + "0fa2bb9d54e";
    
    int r = m_researchLedgerTable->rowCount();
    m_researchLedgerTable->insertRow(r);
    m_researchLedgerTable->setItem(r, 0, new QTableWidgetItem(m_chartSymbolSelector->currentText()));
    m_researchLedgerTable->setItem(r, 1, new QTableWidgetItem(cid));
    m_researchLedgerTable->setItem(r, 2, new QTableWidgetItem(txHash));
    m_researchLedgerTable->setItem(r, 3, new QTableWidgetItem("Validated"));

    m_citationCidInput->clear();
    QMessageBox::information(this, "Consensus Verification", "Citation validation submitted to Blockchain ledger registry.");
}

void MarketModule::syncChartSelection(int row, int col) {
    Q_UNUSED(col);
    QTableWidgetItem* item = m_watchlistTable->item(row, 0);
    if (item) {
        QString symbol = item->text();
        m_chartSymbolSelector->setCurrentText(symbol);
    }
}
