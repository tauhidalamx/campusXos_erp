#ifndef SETTINGSPANEL_HPP
#define SETTINGSPANEL_HPP

#include <QWidget>
#include <QComboBox>
#include <QSlider>
#include <QCheckBox>
#include <QLabel>

class SettingsPanel : public QWidget {
    Q_OBJECT
public:
    explicit SettingsPanel(QWidget* parent = nullptr);
    ~SettingsPanel() = default;

private slots:
    void applySettings();

private:
    void setupUi();
    
    QComboBox* m_themeSelect;
    QComboBox* m_fontSelect;
    QSlider* m_fontSizeSlider;
    QLabel* m_fontSizeValueLabel;
    QCheckBox* m_reducedMotionCheck;
    QCheckBox* m_denseLayoutCheck;
};

#endif // SETTINGSPANEL_HPP
