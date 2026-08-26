#include "ThemeManager.hpp"
#include <QApplication>

ThemeManager& ThemeManager::instance() {
    static ThemeManager inst;
    return inst;
}

ThemeManager::ThemeManager() : m_isDark(true) {}

bool ThemeManager::isDark() const {
    return m_isDark;
}

void ThemeManager::toggleTheme() {
    m_isDark = !m_isDark;
    applyThemeToApp();
    emit themeChanged();
}

QString ThemeManager::bgPrimary() const {
    return m_isDark ? "#0F172A" : "#F8FAFC"; // Slate 900 / Slate 50
}

QString ThemeManager::bgSecondary() const {
    return m_isDark ? "#1E293B" : "#FFFFFF"; // Slate 800 / White
}

QString ThemeManager::bgTertiary() const {
    return m_isDark ? "#334155" : "#E2E8F0"; // Slate 700 / Slate 200
}

QString ThemeManager::textMain() const {
    return m_isDark ? "#F8FAFC" : "#0F172A"; // Slate 50 / Slate 900
}

QString ThemeManager::textMuted() const {
    return m_isDark ? "#94A3B8" : "#64748B"; // Slate 400 / Slate 500
}

QString ThemeManager::primaryColor() const {
    return "#6366F1"; // Indigo 500
}

QString ThemeManager::borderColor() const {
    return m_isDark ? "#334155" : "#CBD5E1"; // Slate 700 / Slate 300
}

QString ThemeManager::accentEmerald() const {
    return "#10B981"; // Emerald 500
}

QString ThemeManager::accentRuby() const {
    return "#EF4444"; // Red 500
}

void ThemeManager::applyThemeToApp() {
    QString style = QString(
        "QMainWindow { background-color: %1; }"
        "QFrame#sidebar { background-color: %2; border-right: 1px solid %3; }"
        "QFrame#aiPanel { background-color: %2; border-left: 1px solid %3; }"
        "QFrame#card { background-color: %2; border: 1px solid %3; border-radius: 8px; }"
        "QLabel { color: %4; font-family: 'Segoe UI', sans-serif; }"
        "QLabel#muted { color: %5; }"
        "QLineEdit { background-color: %2; border: 1px solid %3; color: %4; border-radius: 4px; padding: 6px; }"
        "QPushButton { background-color: %6; color: white; border-radius: 4px; border: none; padding: 6px 12px; font-weight: bold; }"
        "QPushButton:hover { background-color: #4F46E5; }"
        "QTableWidget { background-color: %2; alternate-background-color: %1; gridline-color: %3; color: %4; border: 1px solid %3; }"
        "QHeaderView::section { background-color: %2; color: %4; border: 1px solid %3; padding: 4px; }"
        "QTabBar::tab { background-color: %2; color: %5; border: 1px solid %3; padding: 8px; }"
        "QTabBar::tab:selected { background-color: %6; color: white; }"
    ).arg(bgPrimary(), bgSecondary(), borderColor(), textMain(), textMuted(), primaryColor());
    
    qApp->setStyleSheet(style);
}
