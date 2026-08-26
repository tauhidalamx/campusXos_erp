#ifndef APICLIENT_HPP
#define APICLIENT_HPP

#include <QObject>
#include <QNetworkAccessManager>
#include <QNetworkReply>
#include <QWebSocket>
#include <QSqlDatabase>
#include <QJsonObject>
#include <functional>

class ApiClient : public QObject {
    Q_OBJECT
public:
    static ApiClient& instance();
    
    void setToken(const QString& token);
    QString getToken() const;
    bool isOfflineMode() const;
    
    // REST API wrappers
    void fetchGet(const QString& endpoint, std::function<void(bool, const QJsonObject&)> callback);
    void fetchPost(const QString& endpoint, const QJsonObject& payload, std::function<void(bool, const QJsonObject&)> callback);
    
    // WebSockets controls
    void startWebsocket(const QString& url, std::function<void(const QString&)> callback);
    void stopWebsocket();

private:
    ApiClient();
    ~ApiClient() = default;
    ApiClient(const ApiClient&) = delete;
    ApiClient& operator=(const ApiClient&) = delete;
    
    void initializeCacheDatabase();
    void writeCache(const QString& endpoint, const QJsonObject& response);
    QJsonObject readCache(const QString& endpoint);
    
    QNetworkAccessManager* m_networkManager;
    QWebSocket* m_webSocket;
    QString m_token;
    bool m_offlineMode;
    QSqlDatabase m_cacheDb;
    std::function<void(const QString&)> m_wsCallback;
};

#endif // APICLIENT_HPP
