#include "DashboardWindow.hpp"
#include "ThemeEngine.hpp"
#include "AnimationEngine.hpp"
#include "ErpModule.hpp"
#include "SportsModule.hpp"
#include "MarketModule.hpp"
#include "ConnectModule.hpp"
#include "ChainModule.hpp"
#include "AiModule.hpp"
#include "SocModule.hpp"
#include "SettingsPanel.hpp"
#include "ResearchModule.hpp"
#include "LibraryModule.hpp"
#include "HostelModule.hpp"
#include "TransportModule.hpp"
#include "HealthModule.hpp"
#include "EventsModule.hpp"
#include "PlacementModule.hpp"
#include "Web3Module.hpp"
#include "AcademicModule.hpp"
#include "FinanceModule.hpp"
#include "AdminModule.hpp"
#include "RoleDashboards.hpp"
#include "CampusXCore.hpp"
#include <QHBoxLayout>
#include <QVBoxLayout>
#include <QLabel>
#include <QPropertyAnimation>
#include <QScrollArea>

DashboardWindow::DashboardWindow(QWidget* parent) 
    : QMainWindow(parent), m_aiVisible(false), m_activeModule("erp") {
    setupUi();
    ThemeEngine::instance().applyStyleSheet();
    
    // Connect theme changes to logging and style updates
    connect(&ThemeEngine::instance(), &ThemeEngine::themeChanged, this, [this]() {
        CampusXCore::instance().logMessage("INFO", "Theme stylesheet recompiled and applied globally.");
    });
}

void DashboardWindow::setupUi() {
    resize(1200, 800);
    setWindowTitle("CAMPUSX OS - Native Enterprise Console");
    
    QWidget* centralWidget = new QWidget(this);
    setCentralWidget(centralWidget);
    
    QHBoxLayout* rootLayout = new QHBoxLayout(centralWidget);
    rootLayout->setContentsMargins(0, 0, 0, 0);
    rootLayout->setSpacing(0);
    
    // --- 1. LEFT SIDEBAR RAIL ---
    m_sidebar = new QFrame(this);
    m_sidebar->setObjectName("sidebar");
    m_sidebar->setFixedWidth(230);
    QVBoxLayout* sidebarLayout = new QVBoxLayout(m_sidebar);
    sidebarLayout->setContentsMargins(12, 16, 12, 16);
    sidebarLayout->setSpacing(5);
    
    QLabel* brandLabel = new QLabel("🛡️ CAMPUSX SYSTEM CORE", m_sidebar);
    brandLabel->setStyleSheet("font-size: 14px; font-weight: bold; color: #6366F1;");
    sidebarLayout->addWidget(brandLabel);
    sidebarLayout->addSpacing(10);
    
    struct NavItem { QString key; QString label; };
    QList<NavItem> navs = {
        {"erp", "🏫 ERP Operations"},
        {"connect", "💬 CampusX Connect"},
        {"chain", "🔗 CampusX Chain"},
        {"market", "📈 CampusX Market"},
        {"sports", "🏆 Sports & Athletics"},
        {"soc", "🛡️ Security Operations"},
        {"research", "🔬 Scientific Research"},
        {"library", "📚 University Library"},
        {"hostel", "🏢 Student Hostel"},
        {"transport", "🚌 Route Transport"},
        {"health", "🏥 Clinic & Health"},
        {"events", "📅 Campus Events"},
        {"placement", "💼 Career Placement"},
        {"web3", "🔗 Web3 Credentials"},
        {"academic", "🎓 Academic Console"},
        {"finance", "💰 Finance & Budgets"},
        {"admin", "👥 Administration"},
        {"dashboards", "📊 Role Dashboards"},
        {"settings", "⚙️ System Settings"}
    };
    
    for (const NavItem& nav : navs) {
        QPushButton* btn = new QPushButton(nav.label, m_sidebar);
        btn->setStyleSheet("text-align: left; background-color: transparent; color: #94A3B8; font-size: 11px;");
        connect(btn, &QPushButton::clicked, this, [this, nav]() {
            switchWorkspace(nav.key);
        });
        sidebarLayout->addWidget(btn);
    }
    
    sidebarLayout->addStretch();
    
    // User Profile quickcard
    QFrame* userCard = new QFrame(m_sidebar);
    userCard->setObjectName("card");
    userCard->setFixedHeight(65);
    QVBoxLayout* userCardLayout = new QVBoxLayout(userCard);
    userCardLayout->setContentsMargins(8, 8, 8, 8);
    userCardLayout->setSpacing(2);
    QLabel* userName = new QLabel("Dr. Evelyn Sterling", userCard);
    userName->setStyleSheet("font-size: 11px; font-weight: bold;");
    QLabel* userRole = new QLabel("Role: Platform Admin", userCard);
    userRole->setObjectName("muted");
    userRole->setStyleSheet("font-size: 9px;");
    userCardLayout->addWidget(userName);
    userCardLayout->addWidget(userRole);
    sidebarLayout->addWidget(userCard);
    
    rootLayout->addWidget(m_sidebar);
    
    // --- 2. MAIN CENTER CONTENT VIEW (Header + Stacked Modules) ---
    QVBoxLayout* mainContainer = new QVBoxLayout();
    mainContainer->setContentsMargins(16, 16, 16, 16);
    mainContainer->setSpacing(12);
    
    // Top bar row
    QHBoxLayout* topBar = new QHBoxLayout();
    m_searchInput = new QLineEdit(this);
    m_searchInput->setPlaceholderText("Fuzzy search directories, SBT tokens, security incident hash...");
    connect(m_searchInput, &QLineEdit::returnPressed, this, &DashboardWindow::handleGlobalSearch);
    topBar->addWidget(m_searchInput, 1);
    
    m_aiToggleBtn = new QPushButton("🤖 AI Copilot", this);
    m_aiToggleBtn->setFixedWidth(100);
    connect(m_aiToggleBtn, &QPushButton::clicked, this, &DashboardWindow::toggleAiPanel);
    topBar->addWidget(m_aiToggleBtn);
    
    mainContainer->addLayout(topBar);
    
    // Stack View
    m_stackWidget = new QStackedWidget(this);
    m_stackWidget->addWidget(new ErpModule(this));
    m_stackWidget->addWidget(new ConnectModule(this));
    m_stackWidget->addWidget(new ChainModule(this));
    m_stackWidget->addWidget(new MarketModule(this));
    m_stackWidget->addWidget(new SportsModule(this));
    m_stackWidget->addWidget(new SocModule(this));
    m_stackWidget->addWidget(new SettingsPanel(this));
    m_stackWidget->addWidget(new ResearchModule(this));
    m_stackWidget->addWidget(new LibraryModule(this));
    m_stackWidget->addWidget(new HostelModule(this));
    m_stackWidget->addWidget(new TransportModule(this));
    m_stackWidget->addWidget(new HealthModule(this));
    m_stackWidget->addWidget(new EventsModule(this));
    m_stackWidget->addWidget(new PlacementModule(this));
    m_stackWidget->addWidget(new Web3Module(this));        // 14
    m_stackWidget->addWidget(new AcademicModule(this));     // 15
    m_stackWidget->addWidget(new FinanceModule(this));      // 16
    m_stackWidget->addWidget(new AdminModule(this));        // 17
    m_stackWidget->addWidget(new RoleDashboards(this));     // 18
    
    mainContainer->addWidget(m_stackWidget);
    
    rootLayout->addLayout(mainContainer, 1);
    
    // --- 3. SLIDING RIGHT AI COPILOT SIDE-SHEET ---
    m_aiPanel = new QFrame(this);
    m_aiPanel->setObjectName("aiPanel");
    m_aiPanel->setFixedWidth(300);
    m_aiPanel->setVisible(false); // Collapsed by default
    
    QVBoxLayout* aiLayout = new QVBoxLayout(m_aiPanel);
    aiLayout->setContentsMargins(10, 16, 10, 16);
    aiLayout->setSpacing(10);
    
    QHBoxLayout* aiHeader = new QHBoxLayout();
    QLabel* aiTitle = new QLabel("🤖 AI Assistant Panel", m_aiPanel);
    aiTitle->setStyleSheet("font-weight: bold;");
    QPushButton* aiClose = new QPushButton("✕", m_aiPanel);
    aiClose->setFixedSize(20, 20);
    aiClose->setStyleSheet("background-color: transparent; color: #94A3B8;");
    connect(aiClose, &QPushButton::clicked, this, &DashboardWindow::toggleAiPanel);
    aiHeader->addWidget(aiTitle);
    aiHeader->addWidget(aiClose);
    aiLayout->addLayout(aiHeader);
    
    AiModule* aiChatWidget = new AiModule(m_aiPanel);
    aiLayout->addWidget(aiChatWidget);
    
    rootLayout->addWidget(m_aiPanel);
}

void DashboardWindow::switchWorkspace(const QString& modKey) {
    m_activeModule = modKey;
    int index = 0;
    if (modKey == "erp") index = 0;
    else if (modKey == "connect") index = 1;
    else if (modKey == "chain") index = 2;
    else if (modKey == "market") index = 3;
    else if (modKey == "sports") index = 4;
    else if (modKey == "soc") index = 5;
    else if (modKey == "settings") index = 6;
    else if (modKey == "research") index = 7;
    else if (modKey == "library") index = 8;
    else if (modKey == "hostel") index = 9;
    else if (modKey == "transport") index = 10;
    else if (modKey == "health") index = 11;
    else if (modKey == "events") index = 12;
    else if (modKey == "placement") index = 13;
    else if (modKey == "web3") index = 14;
    else if (modKey == "academic") index = 15;
    else if (modKey == "finance") index = 16;
    else if (modKey == "admin") index = 17;
    else if (modKey == "dashboards") index = 18;
    
    m_stackWidget->setCurrentIndex(index);
    
    // Play page transition animation
    QWidget* activeWidget = m_stackWidget->widget(index);
    AnimationEngine::instance().fadeIn(activeWidget, 250);
}

void DashboardWindow::toggleAiPanel() {
    m_aiVisible = !m_aiVisible;
    
    if (m_aiVisible) {
        m_aiPanel->setVisible(true);
        m_aiToggleBtn->setStyleSheet("background-color: #10B981;");
        // Slide in from right edge of the window
        AnimationEngine::instance().slide(m_aiPanel, QPoint(width(), 0), QPoint(width() - 300, 0), 200);
    } else {
        m_aiToggleBtn->setStyleSheet("background-color: #6366F1;");
        if (AnimationEngine::instance().isReducedMotion()) {
            m_aiPanel->setVisible(false);
        } else {
            // Slide out to the right edge, then hide
            QPropertyAnimation* anim = new QPropertyAnimation(m_aiPanel, "pos");
            anim->setDuration(200);
            anim->setStartValue(QPoint(width() - 300, 0));
            anim->setEndValue(QPoint(width(), 0));
            connect(anim, &QPropertyAnimation::finished, this, [this]() {
                m_aiPanel->setVisible(false);
            });
            anim->start(QAbstractAnimation::DeleteWhenStopped);
        }
    }
}

void DashboardWindow::handleGlobalSearch() {
    QString q = m_searchInput->text().toLower();
    m_searchInput->clear();
    
    if (q.contains("sport") || q.contains("match")) {
        switchWorkspace("sports");
    } else if (q.contains("blockchain") || q.contains("wallet")) {
        switchWorkspace("chain");
    } else if (q.contains("market") || q.contains("trading")) {
        switchWorkspace("market");
    } else if (q.contains("soc") || q.contains("mitigat")) {
        switchWorkspace("soc");
    } else if (q.contains("setting") || q.contains("theme")) {
        switchWorkspace("settings");
    } else if (q.contains("research") || q.contains("grant")) {
        switchWorkspace("research");
    } else if (q.contains("book") || q.contains("library")) {
        switchWorkspace("library");
    } else if (q.contains("hostel") || q.contains("room")) {
        switchWorkspace("hostel");
    } else if (q.contains("bus") || q.contains("route") || q.contains("transport")) {
        switchWorkspace("transport");
    } else if (q.contains("health") || q.contains("clinic") || q.contains("doctor")) {
        switchWorkspace("health");
    } else if (q.contains("event") || q.contains("calendar")) {
        switchWorkspace("events");
    } else if (q.contains("job") || q.contains("career") || q.contains("placement")) {
        switchWorkspace("placement");
    } else if (q.contains("web3") || q.contains("credential") || q.contains("sbt")) {
        switchWorkspace("web3");
    } else if (q.contains("admission") || q.contains("attendance") || q.contains("course") || q.contains("student") || q.contains("faculty") || q.contains("timetable") || q.contains("subject") || q.contains("department") || q.contains("program")) {
        switchWorkspace("academic");
    } else if (q.contains("finance") || q.contains("payment") || q.contains("scholarship") || q.contains("budget") || q.contains("procurement") || q.contains("fee")) {
        switchWorkspace("finance");
    } else if (q.contains("user") || q.contains("staff") || q.contains("leave") || q.contains("announcement") || q.contains("compliance") || q.contains("report") || q.contains("audit")) {
        switchWorkspace("admin");
    } else if (q.contains("dashboard") || q.contains("role") || q.contains("parent") || q.contains("alumni") || q.contains("recruiter")) {
        switchWorkspace("dashboards");
    } else {
        switchWorkspace("erp");
    }
}
