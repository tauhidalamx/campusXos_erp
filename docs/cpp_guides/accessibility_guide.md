# Accessibility Guide

This guide describes built-in accessibility features for visual, motor, and cognitive preferences.

---

## 1. High Contrast & Color Palettes

Active themes support accessibility overrides:
- **`ThemePreset::HighContrast`**: Uses black (`#000000`) and white (`#FFFFFF`) with yellow highlights (`#FFFF00`) for maximum legibility.
- **Focus Indicators**: Interactive elements (inputs, buttons, lists) display a distinct focus ring:
  `QLineEdit:focus { border: 2px solid #6366F1; }`

---

## 2. Dynamic Text Scaling

Text size can be customized in Settings:
- The `ThemeEngine` scales font sizes globally.
- Font sizes range from `10px` (compact) to `18px` (large).
- Layout container heights adjust automatically.

---

## 3. Motion Settings

For users sensitive to screen motion:
- Enabling **Reduce Motion** disables transition animations.
- Bypasses slides, zooms, and fades.
- Views update instantly without animation delays.

