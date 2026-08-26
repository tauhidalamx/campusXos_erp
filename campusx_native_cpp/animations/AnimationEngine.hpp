#ifndef ANIMATIONENGINE_HPP
#define ANIMATIONENGINE_HPP

#include <QObject>
#include <QWidget>
#include <QPoint>

class AnimationEngine : public QObject {
    Q_OBJECT
public:
    static AnimationEngine& instance();
    
    bool isReducedMotion() const;
    void setReducedMotion(bool reduced);
    
    // Animation API wrappers
    void fadeIn(QWidget* widget, int duration = 300);
    void slide(QWidget* widget, const QPoint& start, const QPoint& end, int duration = 250);
    void scaleZoom(QWidget* widget, double startScale, double endScale, int duration = 200);

private:
    AnimationEngine();
    ~AnimationEngine() = default;
    AnimationEngine(const AnimationEngine&) = delete;
    AnimationEngine& operator=(const AnimationEngine&) = delete;
    
    bool m_reducedMotion;
};

#endif // ANIMATIONENGINE_HPP
