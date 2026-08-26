# Animation Guide

This guide explains how to trigger slide, fade, and zoom animations using `AnimationEngine`.

---

## 1. Animation Types

### Fade-in
- **Method**: `AnimationEngine::instance().fadeIn(QWidget* widget, int duration)`
- **How it works**: Attaches a `QGraphicsOpacityEffect` to smooth opacity from `0.0` to `1.0`.
- **Easing**: `QEasingCurve::InOutQuad`

### Slide
- **Method**: `AnimationEngine::instance().slide(QWidget* widget, QPoint start, QPoint end, int duration)`
- **How it works**: Animates widget position from `start` to `end`.
- **Easing**: `QEasingCurve::OutBack` (smooth spring effect).

### Zoom
- **Method**: `AnimationEngine::instance().scaleZoom(QWidget* widget, double startScale, double endScale, int duration)`
- **How it works**: Scales widget geometry relative to its center.

---

## 2. Reduced Motion Support

`AnimationEngine` checks `isReducedMotion()` before running animations:

```cpp
if (m_reducedMotion) {
    widget->move(end); // Jump straight to the end position
    widget->show();
    return;
}
```

When reduced motion is enabled, elements appear immediately without transition lag.

