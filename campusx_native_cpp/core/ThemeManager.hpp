#ifndef THEMEMANAGER_HPP
#define THEMEMANAGER_HPP

#include <QObject>
#include <QString>

class ThemeManager : public QObject {
    Q_OBJECT
public:
    static ThemeManager& instance();
    
    bool isDark() const;
    void toggleTheme();
    
    // Theme Colors
    QString bgPrimary() const;
    QString bgSecondary() const;
    QString bgTertiary() const;
    QString textMain() const;
    QString textMuted() const;
    QString primaryColor() const;
    QString borderColor() const;
    QString accentEmerald() const;
    QString accentRuby() const;
    
    // Style sheets loader
    void applyThemeToApp();

signals:
    void themeChanged();

private:
    ThemeManager();
    ~ThemeManager() = default;
    ThemeManager(const ThemeManager&) = delete;
    ThemeManager& operator=(const ThemeManager&) = delete;
    
    bool m_isDark;
};

#endif // THEMEMANAGER_HPP
