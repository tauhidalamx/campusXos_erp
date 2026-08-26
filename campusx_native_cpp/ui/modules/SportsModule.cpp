#include "SportsModule.hpp"
#include "ApiClient.hpp"
#include <QPainter>
#include <QVBoxLayout>
#include <QHBoxLayout>
#include <QPushButton>
#include <QLabel>
#include <QJsonDocument>
#include <QJsonObject>
#include <QJsonArray>
#include <QRandomGenerator>

// --- CUSTOM 2D SPORTS PITCH RENDERING WIDGET ---
SportsPitchWidget::SportsPitchWidget(QWidget* parent) : QWidget(parent), m_offsideX(-1.0) {
    setAttribute(Qt::WA_StyledBackground, false);
}

void SportsPitchWidget::updateTelemetry(const QList<QPointF>& teamA, const QList<QPointF>& teamB, double offsideX) {
    m_teamA = teamA;
    m_teamB = teamB;
    m_offsideX = offsideX;
    update(); // trigger repaint event
}

void SportsPitchWidget::paintEvent(QPaintEvent* event) {
    QPainter painter(this);
    painter.setRenderHint(QPainter::Antialiasing);
    
    // Draw Green Pitch background
    painter.setBrush(QBrush(QColor("#155E30"))); // Grass green
    painter.setPen(QPen(QColor("#FFFFFF"), 2));
    painter.drawRect(rect());
    
    // Pitch lines
    painter.drawLine(width() / 2, 0, width() / 2, height());
    painter.drawEllipse(QPointF(width() / 2, height() / 2), 60, 60);
    
    // Draw Team A (Red Circles)
    painter.setBrush(QBrush(QColor("#EF4444")));
    painter.setPen(QPen(QColor("#FFFFFF"), 1));
    for (const QPointF& pt : m_teamA) {
        painter.drawEllipse(pt, 8, 8);
    }
    
    // Draw Team B (Blue Circles)
    painter.setBrush(QBrush(QColor("#3B82F6")));
    painter.setPen(QPen(QColor("#FFFFFF"), 1));
    for (const QPointF& pt : m_teamB) {
        painter.drawEllipse(pt, 8, 8);
    }
    
    // Draw Projected Offside Line (Yellow Dashed Line)
    if (m_offsideX > 0) {
        QPen offsidePen(QColor("#F59E0B"), 2, Qt::DashLine);
        painter.setPen(offsidePen);
        painter.drawLine(m_offsideX, 0, m_offsideX, height());
    }
}

// --- MAIN SPORTS DASHBOARD MODULE ---
SportsModule::SportsModule(QWidget* parent) : QWidget(parent), m_feedActive(false) {
    setupUi();
}

SportsModule::~SportsModule() {
    ApiClient::instance().stopWebsocket();
}

void SportsModule::setupUi() {
    QVBoxLayout* mainLayout = new QVBoxLayout(this);
    mainLayout->setContentsMargins(0, 0, 0, 0);
    
    QLabel* title = new QLabel("🏆 Sports Computer Vision Analytics Radar", this);
    title->setStyleSheet("font-size: 14px; font-weight: bold;");
    mainLayout->addWidget(title);
    
    m_pitch = new SportsPitchWidget(this);
    m_pitch->setMinimumHeight(400);
    mainLayout->addWidget(m_pitch, 1);
    
    QHBoxLayout* controls = new QHBoxLayout();
    m_liveBtn = new QPushButton("🛰️ Start Live Feed", this);
    m_liveBtn->setStyleSheet("background-color: #6366F1;");
    connect(m_liveBtn, &QPushButton::clicked, this, &SportsModule::startMatchFeed);
    
    controls->addWidget(m_liveBtn);
    controls->addStretch();
    mainLayout->addLayout(controls);
}

void SportsModule::startMatchFeed() {
    if (m_feedActive) {
        m_feedActive = false;
        m_liveBtn->setText("🛰️ Start Live Feed");
        m_liveBtn->setStyleSheet("background-color: #6366F1;");
        ApiClient::instance().stopWebsocket();
        m_pitch->updateTelemetry({}, {}, -1.0);
    } else {
        m_feedActive = true;
        m_liveBtn->setText("⏹️ Stop Feed");
        m_liveBtn->setStyleSheet("background-color: #EF4444;");
        
        // Start WebSockets feed connection
        ApiClient::instance().startWebsocket("ws://localhost:8000/ws/analytics", [this](const QString& message) {
            processWsFeed(message);
        });
        
        // Simulates radar ticks in offline fallback
        if (ApiClient::instance().isOfflineMode()) {
            processWsFeed("");
        }
    }
}

void SportsModule::processWsFeed(const QString& data) {
    // If empty payload (offline mock), generate coordinates
    if (data.isEmpty()) {
        QList<QPointF> teamA, teamB;
        for (int i = 0; i < 5; ++i) {
            teamA.append(QPointF(QRandomGenerator::global()->bounded(100, m_pitch->width() / 2),
                                 QRandomGenerator::global()->bounded(50, m_pitch->height() - 50)));
            teamB.append(QPointF(QRandomGenerator::global()->bounded(m_pitch->width() / 2, m_pitch->width() - 100),
                                 QRandomGenerator::global()->bounded(50, m_pitch->height() - 50)));
        }
        m_pitch->updateTelemetry(teamA, teamB, m_pitch->width() * 0.65);
        return;
    }
    
    // Parse real coordinates from sports engine
    QJsonDocument doc = QJsonDocument::fromJson(data.toUtf8());
    QJsonObject obj = doc.object();
    QJsonArray tracks = obj.value("tracks").toArray();
    
    QList<QPointF> teamA, teamB;
    for (int i = 0; i < tracks.size(); ++i) {
        QJsonObject tr = tracks.at(i).toObject();
        QJsonArray bbox = tr.value("bbox").toArray();
        if (bbox.size() >= 4) {
            double x = (bbox.at(0).toDouble() + bbox.at(2).toDouble()) / 2.0;
            double y = (bbox.at(1).toDouble() + bbox.at(3).toDouble()) / 2.0;
            
            // Map camera coordinates [0-1920, 0-1080] into pitch widget sizes
            double mappedX = (x / 1920.0) * m_pitch->width();
            double mappedY = (y / 1080.0) * m_pitch->height();
            
            int teamId = tr.value("team_id").toInt();
            if (teamId == 1) {
                teamA.append(QPointF(mappedX, mappedY));
            } else {
                teamB.append(QPointF(mappedX, mappedY));
            }
        }
    }
    
    double defenderX = obj.value("offside_line").toObject().value("defender_x_pixel").toDouble();
    double mappedOffsideX = (defenderX / 1920.0) * m_pitch->width();
    
    m_pitch->updateTelemetry(teamA, teamB, mappedOffsideX);
}
