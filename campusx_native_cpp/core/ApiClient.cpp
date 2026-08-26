#include "ApiClient.hpp"
#include <QNetworkRequest>
#include <QJsonDocument>
#include <QSqlQuery>
#include <QSqlError>
#include <QDateTime>
#include <QDir>

ApiClient& ApiClient::instance() {
    static ApiClient inst;
    return inst;
}

ApiClient::ApiClient() : m_offlineMode(false) {
    m_networkManager = new QNetworkAccessManager(this);
    m_webSocket = new QWebSocket();
    
    // Connect WebSocket events
    connect(m_webSocket, &QWebSocket::textMessageReceived, this, [this](const QString& message) {
        if (m_wsCallback) {
            m_wsCallback(message);
        }
    });
    
    initializeCacheDatabase();
}

void ApiClient::setToken(const QString& token) {
    m_token = token;
}

QString ApiClient::getToken() const {
    return m_token;
}

bool ApiClient::isOfflineMode() const {
    return m_offlineMode;
}

void ApiClient::initializeCacheDatabase() {
    m_cacheDb = QSqlDatabase::addDatabase("QSQLITE", "cpp_cache_connection");
    m_cacheDb.setDatabaseName("campusx_cpp_cache.db");
    
    if (m_cacheDb.open()) {
        QSqlQuery query(m_cacheDb);
        query.exec("CREATE TABLE IF NOT EXISTS api_cache (endpoint TEXT PRIMARY KEY, response_json TEXT, timestamp TEXT)");
    } else {
        qWarning() << "[ApiClient] Failed to open cache SQLite database:" << m_cacheDb.lastError().text();
    }
}

void ApiClient::writeCache(const QString& endpoint, const QJsonObject& response) {
    if (!m_cacheDb.isOpen()) return;
    
    QSqlQuery query(m_cacheDb);
    query.prepare("INSERT OR REPLACE INTO api_cache (endpoint, response_json, timestamp) VALUES (:endpoint, :json, :ts)");
    query.bindValue(":endpoint", endpoint);
    query.bindValue(":json", QJsonDocument(response).toJson(QJsonDocument::Compact));
    query.bindValue(":ts", QDateTime::currentDateTime().toString(Qt::ISODate));
    query.exec();
}

QJsonObject ApiClient::readCache(const QString& endpoint) {
    QJsonObject result;
    if (!m_cacheDb.isOpen()) return result;
    
    QSqlQuery query(m_cacheDb);
    query.prepare("SELECT response_json FROM api_cache WHERE endpoint = :endpoint");
    query.bindValue(":endpoint", endpoint);
    
    if (query.exec() && query.next()) {
        QString jsonStr = query.value(0).toString();
        QJsonDocument doc = QJsonDocument::fromJson(jsonStr.toUtf8());
        result = doc.object();
    }
    return result;
}

void ApiClient::fetchGet(const QString& endpoint, std::function<void(bool, const QJsonObject&)> callback) {
    // If local offline fallback mode is active, fetch from cache immediately
    if (m_offlineMode) {
        QJsonObject cached = readCache(endpoint);
        callback(!cached.isEmpty(), cached);
        return;
    }
    
    QUrl url("http://localhost:5000/api" + endpoint);
    QNetworkRequest request(url);
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    if (!m_token.isEmpty()) {
        request.setRawHeader("Authorization", ("Bearer " + m_token).toUtf8());
    }
    
    QNetworkReply* reply = m_networkManager->get(request);
    connect(reply, &QNetworkReply::finished, this, [this, reply, endpoint, callback]() {
        reply->deleteLater();
        if (reply->error() == QNetworkReply::NoError) {
            QByteArray data = reply->readAll();
            QJsonDocument doc = QJsonDocument::fromJson(data);
            QJsonObject obj = doc.object();
            writeCache(endpoint, obj); // save response to SQLite cache
            callback(true, obj);
        } else {
            // Network error: Fallback to local SQLite cache
            QJsonObject cached = readCache(endpoint);
            callback(!cached.isEmpty(), cached);
        }
    });
}

void ApiClient::fetchPost(const QString& endpoint, const QJsonObject& payload, std::function<void(bool, const QJsonObject&)> callback) {
    if (m_offlineMode) {
        // Local offline credential login override checks
        if (endpoint == "/auth/login") {
            QString email = payload.value("email").toString();
            QString password = payload.value("password").toString();
            
            QJsonObject res;
            if ((email == "admin@campusx.edu" && password == "admin123") ||
                (email == "student@campusx.edu" && password == "student123") ||
                (email == "faculty@campusx.edu" && password == "faculty123")) {
                
                QString role = email.contains("admin") ? "admin" : (email.contains("faculty") ? "faculty" : "student");
                res["success"] = true;
                res["token"] = "mock_cpp_jwt_token_100x";
                
                QJsonObject user;
                user["id"] = "usr_demo_" + role;
                user["name"] = role.at(0).toUpper() + role.mid(1) + " C++ Demo Profile";
                user["email"] = email;
                user["role"] = role;
                user["department"] = "CS";
                res["user"] = user;
                
                callback(true, res);
                return;
            }
        }
        
        QJsonObject empty;
        callback(false, empty);
        return;
    }
    
    QUrl url("http://localhost:5000/api" + endpoint);
    QNetworkRequest request(url);
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    if (!m_token.isEmpty()) {
        request.setRawHeader("Authorization", ("Bearer " + m_token).toUtf8());
    }
    
    QByteArray body = QJsonDocument(payload).toJson();
    QNetworkReply* reply = m_networkManager->post(request, body);
    connect(reply, &QNetworkReply::finished, this, [this, reply, endpoint, payload, callback]() {
        reply->deleteLater();
        if (reply->error() == QNetworkReply::NoError) {
            QByteArray data = reply->readAll();
            QJsonDocument doc = QJsonDocument::fromJson(data);
            callback(true, doc.object());
        } else {
            // Trigger offline fallback trigger if connection refused on login
            if (endpoint == "/auth/login") {
                m_offlineMode = true;
                fetchPost(endpoint, payload, callback); // recursive call in offline mode
            } else {
                QJsonObject empty;
                callback(false, empty);
            }
        }
    });
}

void ApiClient::startWebsocket(const QString& url, std::function<void(const QString&)> callback) {
    m_wsCallback = callback;
    m_webSocket->open(QUrl(url));
}

void ApiClient::stopWebsocket() {
    m_webSocket->close();
    m_wsCallback = nullptr;
}
