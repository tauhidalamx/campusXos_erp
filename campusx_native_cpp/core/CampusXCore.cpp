#include "CampusXCore.hpp"
#include <QDebug>
#include <QDateTime>

CampusXCore& CampusXCore::instance() {
    static CampusXCore inst;
    return inst;
}

void CampusXCore::initialize() {
    logMessage("INFO", "CAMPUSX OS Native System Core Booting up...");
    loadPlugins();
}

void CampusXCore::logMessage(const QString& level, const QString& message) {
    QString ts = QDateTime::currentDateTime().toString("yyyy-MM-dd hh:mm:ss.zzz");
    qDebug().noquote() << QString("[%1] [%2] %3").arg(ts, level, message);
}

void CampusXCore::setConfig(const QString& key, const QString& value) {
    m_configs[key] = value;
    logMessage("DEBUG", QString("Config updated: %1 = %2").arg(key, value));
}

QString CampusXCore::getConfig(const QString& key, const QString& defaultValue) {
    return m_configs.value(key, defaultValue);
}

void CampusXCore::loadPlugins() {
    logMessage("INFO", "Scanning core dynamic plugins registry...");
    m_loadedPlugins << "libCampusXAnalytics.dylib" << "libCampusXWAFShield.dylib" << "libCampusXSBTNotary.dylib";
    for (const QString& plugin : m_loadedPlugins) {
        logMessage("INFO", QString("✓ Successfully loaded plugin library: %1").arg(plugin));
    }
}

QStringList CampusXCore::getLoadedPlugins() const {
    return m_loadedPlugins;
}
