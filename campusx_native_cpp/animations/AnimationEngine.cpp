#include "AnimationEngine.hpp"
#include <QPropertyAnimation>
#include <QGraphicsOpacityEffect>
#include <QEasingCurve>

AnimationEngine& AnimationEngine::instance() {
    static AnimationEngine inst;
    return inst;
}

AnimationEngine::AnimationEngine() : m_reducedMotion(false) {}

bool AnimationEngine::isReducedMotion() const {
    return m_reducedMotion;
}

void AnimationEngine::setReducedMotion(bool reduced) {
    m_reducedMotion = reduced;
}

void AnimationEngine::fadeIn(QWidget* widget, int duration) {
    if (m_reducedMotion) {
        widget->setWindowOpacity(1.0);
        widget->show();
        return;
    }
    
    QGraphicsOpacityEffect* effect = new QGraphicsOpacityEffect(widget);
    widget->setGraphicsEffect(effect);
    
    QPropertyAnimation* anim = new QPropertyAnimation(effect, "opacity");
    anim->setDuration(duration);
    anim->setStartValue(0.0);
    anim->setEndValue(1.0);
    anim->setEasingCurve(QEasingCurve::InOutQuad);
    
    connect(anim, &QPropertyAnimation::finished, effect, [effect]() {
        // Clean up graphics effect once finished to avoid rendering overhead
        effect->setOpacity(1.0);
    });
    
    widget->show();
    anim->start(QAbstractAnimation::DeleteWhenStopped);
}

void AnimationEngine::slide(QWidget* widget, const QPoint& start, const QPoint& end, int duration) {
    if (m_reducedMotion) {
        widget->move(end);
        widget->show();
        return;
    }
    
    QPropertyAnimation* anim = new QPropertyAnimation(widget, "pos");
    anim->setDuration(duration);
    anim->setStartValue(start);
    anim->setEndValue(end);
    anim->setEasingCurve(QEasingCurve::OutBack); // spring-bounce curve
    
    widget->show();
    anim->start(QAbstractAnimation::DeleteWhenStopped);
}

void AnimationEngine::scaleZoom(QWidget* widget, double startScale, double endScale, int duration) {
    // Zoom/scale is simulated with size modifications
    if (m_reducedMotion) {
        widget->show();
        return;
    }
    
    QPropertyAnimation* anim = new QPropertyAnimation(widget, "geometry");
    anim->setDuration(duration);
    
    QRect orig = widget->geometry();
    QRect startRect(orig.center(), QSize(orig.width() * startScale, orig.height() * startScale));
    QRect endRect(orig.center(), QSize(orig.width() * endScale, orig.height() * endScale));
    
    anim->setStartValue(startRect);
    anim->setEndValue(endRect);
    anim->setEasingCurve(QEasingCurve::OutQuad);
    
    widget->show();
    anim->start(QAbstractAnimation::DeleteWhenStopped);
}
