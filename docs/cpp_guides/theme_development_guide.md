# CAMPUSX OS C++ - Theme Development Guide

This document describes how to create, load, and switch styles using the native C++ `ThemeEngine`.

---

## 1. Defining a Theme Preset

All themes are configured in the `ThemePreset` enum inside `ThemeEngine.hpp`:

```cpp
enum class ThemePreset {
    Dark,
    Light,
    Amoled,
    CampusXBlue,
    CampusXPurple,
    CampusXGreen,
    HighContrast
};
```

---

## 2. Dynamic Style Mappings

Colors are resolved at runtime inside `ThemeEngine.cpp` using conditional switches matching the active selection:

```cpp
QString ThemeEngine::bgPrimary() const {
    switch (m_activeTheme) {
        case ThemePreset::Light:  return "#F8FAFC"; // Slate 50
        case ThemePreset::Amoled: return "#000000"; // Pure Black
        case ThemePreset::Dark:
        default:                  return "#0F172A"; // Slate 900
    }
}
```

---

## 3. Applying Style Sheets at Runtime

To trigger a theme modification, use:

```cpp
#include "ThemeEngine.hpp"

// Switch app theme to AMOLED
ThemeEngine::instance().setTheme(ThemePreset::Amoled);

// Adjust font size scaling
ThemeEngine::instance().setFontSize(14);
```

Active widgets listen to the `themeChanged()` signal to refresh internal margins, layouts, or painter colors.
