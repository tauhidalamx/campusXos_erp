#ifndef CAMPUSXCORE_HPP
#define CAMPUSXCORE_HPP

#include <QString>
#include <QMap>
#include <QObject>

class CampusXCore : public QObject {
    Q_OBJECT
public:
    static CampusXCore& instance();
    
    void initialize();
    void logMessage(const QString& level, const QString& message);
    
    // Config management
    void setConfig(const QString& key, const QString& value);
    QString getConfig(const QString& key, const QString& defaultValue = "");
    
    // Mock Plugin Loader
    void loadPlugins();
    QStringList getLoadedPlugins() const;

private:
    CampusXCore() = default;
    ~CampusXCore() = default;
    CampusXCore(const CampusXCore&) = delete;
    CampusXCore& operator=(const CampusXCore&) = delete;
    
    QMap<QString, QString> m_configs;
    QStringList m_loadedPlugins;
};

#endif // CAMPUSXCORE_HPP
