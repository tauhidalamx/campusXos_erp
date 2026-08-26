#include "SocModule.hpp"
#include "ApiClient.hpp"
#include <QVBoxLayout>
#include <QHBoxLayout>
#include <QLabel>
#include <QHeaderView>
#include <QJsonObject>
#include <QJsonArray>

SocModule::SocModule(QWidget* parent) : QWidget(parent) {
    setupUi();
    loadIncidents();
}

void SocModule::setupUi() {
    QVBoxLayout* mainLayout = new QVBoxLayout(this);
    mainLayout->setContentsMargins(0, 0, 0, 0);
    mainLayout->setSpacing(10);
    
    QLabel* title = new QLabel("🛡️ Security Operations threat registry Log", this);
    title->setStyleSheet("font-size: 14px; font-weight: bold;");
    mainLayout->addWidget(title);
    
    m_incidentTable = new QTableWidget(this);
    m_incidentTable->setColumnCount(4);
    m_incidentTable->setHorizontalHeaderLabels({"Alert Title", "Severity", "Notary Status", "Mitigating Operator"});
    m_incidentTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    mainLayout->addWidget(m_incidentTable, 1);
    
    m_alertBtn = new QPushButton("🚨 Trigger Critical SecOps Alert", this);
    m_alertBtn->setStyleSheet("background-color: #EF4444; color: white;");
    connect(m_alertBtn, &QPushButton::clicked, this, &SocModule::triggerAlert);
    mainLayout->addWidget(m_alertBtn);
}

void SocModule::loadIncidents() {
    ApiClient::instance().fetchGet("/soc/incidents", [this](bool success, const QJsonObject& response) {
        if (!success) {
            // Load mock fallback incidents
            m_incidentTable->setRowCount(3);
            m_incidentTable->setItem(0, 0, new QTableWidgetItem("Brute-Force Attack Mitigation"));
            m_incidentTable->setItem(0, 1, new QTableWidgetItem("HIGH"));
            m_incidentTable->setItem(0, 2, new QTableWidgetItem("Mitigated"));
            m_incidentTable->setItem(0, 3, new QTableWidgetItem("SecOps Agent Bravo"));
            
            m_incidentTable->setItem(1, 0, new QTableWidgetItem("Unauthorized API Gateway Access"));
            m_incidentTable->setItem(1, 1, new QTableWidgetItem("CRITICAL"));
            m_incidentTable->setItem(1, 2, new QTableWidgetItem("Investigating"));
            m_incidentTable->setItem(1, 3, new QTableWidgetItem("System Guardian Engine"));
            
            m_incidentTable->setItem(2, 0, new QTableWidgetItem("SSL Certificate Rotation Completed"));
            m_incidentTable->setItem(2, 1, new QTableWidgetItem("INFO"));
            m_incidentTable->setItem(2, 2, new QTableWidgetItem("Resolved"));
            m_incidentTable->setItem(2, 3, new QTableWidgetItem("Autonomous SecOps Cron"));
            return;
        }
        
        QJsonArray arr = response.value("incidents").toArray();
        m_incidentTable->setRowCount(arr.size());
        for (int i = 0; i < arr.size(); ++i) {
            QJsonObject inc = arr.at(i).toObject();
            m_incidentTable->setItem(i, 0, new QTableWidgetItem(inc.value("title").toString()));
            m_incidentTable->setItem(i, 1, new QTableWidgetItem(inc.value("severity").toString()));
            m_incidentTable->setItem(i, 2, new QTableWidgetItem(inc.value("status").toString()));
            m_incidentTable->setItem(i, 3, new QTableWidgetItem(inc.value("operator").toString()));
        }
    });
}

void SocModule::triggerAlert() {
    m_alertBtn->setEnabled(false);
    m_alertBtn->setText("Dispatching threat vector mitigation event...");
    
    QJsonObject payload;
    payload["title"] = "Manual Trigger: Critical Firewall Check";
    payload["severity"] = "CRITICAL";
    payload["status"] = "Active";
    payload["operator"] = "Evelyn Sterling Console";
    
    ApiClient::instance().fetchPost("/soc/incidents", payload, [this](bool success, const QJsonObject& res) {
        m_alertBtn->setEnabled(true);
        m_alertBtn->setText("🚨 Trigger Critical SecOps Alert");
        loadIncidents();
    });
}
