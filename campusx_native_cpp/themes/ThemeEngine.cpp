#include "ThemeEngine.hpp"
#include <QApplication>
#include <QDebug>

ThemeEngine& ThemeEngine::instance() {
    static ThemeEngine inst;
    return inst;
}

ThemeEngine::ThemeEngine() 
    : m_activeTheme(ThemePreset::Dark), m_fontFamily("Inter"), m_fontSize(12) {}

ThemePreset ThemeEngine::activeTheme() const {
    return m_activeTheme;
}

void ThemeEngine::setTheme(ThemePreset preset) {
    m_activeTheme = preset;
    applyStyleSheet();
    emit themeChanged();
}

QString ThemeEngine::activeFontFamily() const {
    return m_fontFamily;
}

void ThemeEngine::setFontFamily(const QString& family) {
    m_fontFamily = family;
    applyStyleSheet();
    emit themeChanged();
}

int ThemeEngine::activeFontSize() const {
    return m_fontSize;
}

void ThemeEngine::setFontSize(int size) {
    m_fontSize = size;
    applyStyleSheet();
    emit themeChanged();
}

QString ThemeEngine::bgPrimary() const {
    switch (m_activeTheme) {
        case ThemePreset::Dark:         return "#0B0F19";
        case ThemePreset::Amoled:       return "#000000";
        case ThemePreset::Corporate:    return "#F3F4F6";
        case ThemePreset::University:   return "#FDFBF7";
        case ThemePreset::Blue:         return "#F0F9FF";
        case ThemePreset::Purple:       return "#FAF5FF";
        case ThemePreset::Green:        return "#F0FDF4";
        case ThemePreset::Red:          return "#FEF2F2";
        case ThemePreset::HighContrast: return "#000000";
        case ThemePreset::Light:
        default:                        return "#F8FAFC";
    }
}

QString ThemeEngine::bgSecondary() const {
    switch (m_activeTheme) {
        case ThemePreset::Dark:         return "#111827";
        case ThemePreset::Amoled:       return "#050505";
        case ThemePreset::Corporate:    return "#FFFFFF";
        case ThemePreset::University:   return "#FFFFFF";
        case ThemePreset::Blue:         return "#FFFFFF";
        case ThemePreset::Purple:       return "#FFFFFF";
        case ThemePreset::Green:        return "#FFFFFF";
        case ThemePreset::Red:          return "#FFFFFF";
        case ThemePreset::HighContrast: return "#000000";
        case ThemePreset::Light:
        default:                        return "#FFFFFF";
    }
}

QString ThemeEngine::textMain() const {
    switch (m_activeTheme) {
        case ThemePreset::Dark:         return "#F9FAFB";
        case ThemePreset::Amoled:       return "#FFFFFF";
        case ThemePreset::Corporate:    return "#1F2937";
        case ThemePreset::University:   return "#4A3E3D";
        case ThemePreset::Blue:         return "#0369A1";
        case ThemePreset::Purple:       return "#6B21A8";
        case ThemePreset::Green:        return "#166534";
        case ThemePreset::Red:          return "#991B1B";
        case ThemePreset::HighContrast: return "#FFFFFF";
        case ThemePreset::Light:
        default:                        return "#0F172A";
    }
}

QString ThemeEngine::textMuted() const {
    switch (m_activeTheme) {
        case ThemePreset::Dark:         return "#9CA3AF";
        case ThemePreset::Amoled:       return "#A0A0A0";
        case ThemePreset::Corporate:    return "#4B5563";
        case ThemePreset::University:   return "#7A6F6D";
        case ThemePreset::Blue:         return "#0284C7";
        case ThemePreset::Purple:       return "#7E22CE";
        case ThemePreset::Green:        return "#15803D";
        case ThemePreset::Red:          return "#B91C1C";
        case ThemePreset::HighContrast: return "#FFFFFF";
        case ThemePreset::Light:
        default:                        return "#475569";
    }
}

QString ThemeEngine::borderColor() const {
    switch (m_activeTheme) {
        case ThemePreset::Dark:         return "#1F2937";
        case ThemePreset::Amoled:       return "#1C1C1C";
        case ThemePreset::Corporate:    return "#E5E7EB";
        case ThemePreset::University:   return "#F5EFEB";
        case ThemePreset::Blue:         return "#E0F2FE";
        case ThemePreset::Purple:       return "#F3E8FF";
        case ThemePreset::Green:        return "#DCFCE7";
        case ThemePreset::Red:          return "#FEE2E2";
        case ThemePreset::HighContrast: return "#FFFFFF";
        case ThemePreset::Light:
        default:                        return "#E2E8F0";
    }
}

QString ThemeEngine::primaryColor() const {
    switch (m_activeTheme) {
        case ThemePreset::Dark:         return "#6366F1";
        case ThemePreset::Amoled:       return "#4F46E5";
        case ThemePreset::Corporate:    return "#2563EB";
        case ThemePreset::University:   return "#B45309";
        case ThemePreset::Blue:         return "#0284C7";
        case ThemePreset::Purple:       return "#7E22CE";
        case ThemePreset::Green:        return "#15803D";
        case ThemePreset::Red:          return "#B91C1C";
        case ThemePreset::HighContrast: return "#FFFF00";
        case ThemePreset::Light:
        default:                        return "#4F46E5";
    }
}

QString ThemeEngine::accentColor() const {
    switch (m_activeTheme) {
        case ThemePreset::Dark:         return "#10B981";
        case ThemePreset::Amoled:       return "#0891B2";
        case ThemePreset::Corporate:    return "#0891B2";
        case ThemePreset::University:   return "#D97706";
        case ThemePreset::Blue:         return "#0891B2";
        case ThemePreset::Purple:       return "#0891B2";
        case ThemePreset::Green:        return "#059669";
        case ThemePreset::Red:          return "#E11D48";
        case ThemePreset::HighContrast: return "#FF00FF";
        case ThemePreset::Light:
        default:                        return "#0891B2";
    }
}

void ThemeEngine::applyStyleSheet() {
    QString style = QString(
        "QMainWindow { background-color: %1; }"
        "QFrame#sidebar { background-color: %2; border-right: 1px solid %3; }"
        "QFrame#aiPanel { background-color: %2; border-left: 1px solid %3; }"
        "QFrame#card { background-color: %2; border: 1px solid %3; border-radius: %10px; }"
        "QLabel { color: %4; font-family: '%7', sans-serif; font-size: %8px; }"
        "QLabel#muted { color: %5; font-size: %9px; }"
        "QLineEdit { background-color: %2; border: 1px solid %3; color: %4; border-radius: %11px; padding: 6px; font-size: %8px; }"
        "QPushButton { background-color: %6; color: white; border-radius: %11px; border: none; padding: 6px 12px; font-weight: bold; font-size: %8px; }"
        "QPushButton:hover { background-color: #4F46E5; }"
        "QTableWidget { background-color: %2; alternate-background-color: %1; gridline-color: %3; color: %4; border: 1px solid %3; font-size: %8px; }"
        "QHeaderView::section { background-color: %2; color: %4; border: 1px solid %3; padding: 4px; }"
        "QTabBar::tab { background-color: %2; color: %5; border: 1px solid %3; padding: 8px; font-size: %8px; }"
        "QTabBar::tab:selected { background-color: %6; color: white; }"
    ).arg(bgPrimary())
     .arg(bgSecondary())
     .arg(borderColor())
     .arg(textMain())
     .arg(textMuted())
     .arg(primaryColor())
     .arg(m_fontFamily)
     .arg(m_fontSize)
     .arg(m_fontSize - 2)
     .arg(borderRadius() * 2)
     .arg(borderRadius());
    if (qApp) {
        qApp->setStyleSheet(style);
    }
}
