#ifndef THEMEENGINE_HPP
#define THEMEENGINE_HPP

#include <QObject>
#include <QString>
#include <QMap>

enum class ThemePreset {
    Light,
    Dark,
    Amoled,
    Corporate,
    University,
    Blue,
    Purple,
    Green,
    Red,
    HighContrast
};

class ThemeEngine : public QObject {
    Q_OBJECT
public:
    static ThemeEngine& instance();
    
    // Theme options getters/setters
    ThemePreset activeTheme() const;
    void setTheme(ThemePreset preset);
    
    QString activeFontFamily() const;
    void setFontFamily(const QString& family);
    
    int activeFontSize() const;
    void setFontSize(int size);
    
    QString primaryColor() const;
    QString accentColor() const;
    QString bgPrimary() const;
    QString bgSecondary() const;
    QString textMain() const;
    QString textMuted() const;
    QString borderColor() const;
    
    // Spacing system
    int spacingUnit() const { return 8; }
    int borderRadius() const { return 4; }
    
    void applyStyleSheet();

signals:
    void themeChanged();

private:
    ThemeEngine();
    ~ThemeEngine() = default;
    ThemeEngine(const ThemeEngine&) = delete;
    ThemeEngine& operator=(const ThemeEngine&) = delete;
    
    ThemePreset m_activeTheme;
    QString m_fontFamily;
    int m_fontSize;
    QString m_customPrimary;
    QString m_customAccent;
};

#endif // THEMEENGINE_HPP
