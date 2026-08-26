#ifndef SPORTSMODULE_HPP
#define SPORTSMODULE_HPP

#include <QWidget>
#include <QPushButton>
#include <QList>
#include <QPointF>

class SportsPitchWidget : public QWidget {
    Q_OBJECT
public:
    explicit SportsPitchWidget(QWidget* parent = nullptr);
    ~SportsPitchWidget() = default;

    void updateTelemetry(const QList<QPointF>& teamA, const QList<QPointF>& teamB, double offsideX);

protected:
    void paintEvent(QPaintEvent* event) override;

private:
    QList<QPointF> m_teamA;
    QList<QPointF> m_teamB;
    double m_offsideX;
};

class SportsModule : public QWidget {
    Q_OBJECT
public:
    explicit SportsModule(QWidget* parent = nullptr);
    ~SportsModule();

private slots:
    void startMatchFeed();
    void processWsFeed(const QString& data);

private:
    void setupUi();
    
    SportsPitchWidget* m_pitch;
    QPushButton* m_liveBtn;
    bool m_feedActive;
};

#endif // SPORTSMODULE_HPP
