#include "SettingsPanel.hpp"
#include "ThemeEngine.hpp"
#include "AnimationEngine.hpp"
#include <QFormLayout>
#include <QVBoxLayout>
#include <QHBoxLayout>
#include <QPushButton>

SettingsPanel::SettingsPanel(QWidget* parent) : QWidget(parent) {
    setupUi();
}

void SettingsPanel::setupUi() {
    QVBoxLayout* mainLayout = new QVBoxLayout(this);
    mainLayout->setContentsMargins(15, 15, 15, 15);
    mainLayout->setSpacing(10);
    
    QLabel* title = new QLabel("⚙️ Native Desktop Settings", this);
    title->setStyleSheet("font-size: 14px; font-weight: bold;");
    mainLayout->addWidget(title);
    
    QFormLayout* form = new QFormLayout();
    form->setSpacing(8);
    
    m_themeSelect = new QComboBox(this);
    m_themeSelect->addItems({"Light Minimalist", "Dark Default", "AMOLED Pitch Black", "Corporate Style", "University Warm", "Sky Blue", "Deep Purple", "Forest Green", "Ruby Red", "High Contrast"});
    // Initialize active theme index
    ThemePreset activePreset = ThemeEngine::instance().activeTheme();
    m_themeSelect->setCurrentIndex(static_cast<int>(activePreset));
    connect(m_themeSelect, &QComboBox::currentIndexChanged, this, &SettingsPanel::applySettings);
    form->addRow("Desktop UI Theme:", m_themeSelect);
    
    // Font family
    m_fontSelect = new QComboBox(this);
    m_fontSelect->addItems({"Inter", "Roboto", "Segoe UI", "Arial"});
    m_fontSelect->setCurrentText(ThemeEngine::instance().activeFontFamily());
    connect(m_fontSelect, &QComboBox::currentIndexChanged, this, &SettingsPanel::applySettings);
    form->addRow("Typography Family:", m_fontSelect);
    
    // Font size
    QHBoxLayout* sizeSliderRow = new QHBoxLayout();
    m_fontSizeSlider = new QSlider(Qt::Horizontal, this);
    m_fontSizeSlider->setRange(10, 18);
    m_fontSizeSlider->setValue(ThemeEngine::instance().activeFontSize());
    
    m_fontSizeValueLabel = new QLabel(QString::number(ThemeEngine::instance().activeFontSize()) + " px", this);
    m_fontSizeValueLabel->setFixedWidth(40);
    
    sizeSliderRow->addWidget(m_fontSizeSlider, 1);
    sizeSliderRow->addWidget(m_fontSizeValueLabel);
    
    connect(m_fontSizeSlider, &QSlider::valueChanged, this, [this](int val) {
        m_fontSizeValueLabel->setText(QString::number(val) + " px");
        applySettings();
    });
    form->addRow("System Font Size:", sizeSliderRow);
    
    // Reduced motion accessibility
    m_reducedMotionCheck = new QCheckBox("Reduced Motion (disable transitions)", this);
    m_reducedMotionCheck->setChecked(AnimationEngine::instance().isReducedMotion());
    connect(m_reducedMotionCheck, &QCheckBox::toggled, this, &SettingsPanel::applySettings);
    form->addRow("Accessibility:", m_reducedMotionCheck);
    
    // Layout density
    m_denseLayoutCheck = new QCheckBox("Dense Layout spacing", this);
    connect(m_denseLayoutCheck, &QCheckBox::toggled, this, &SettingsPanel::applySettings);
    form->addRow("Interface Density:", m_denseLayoutCheck);
    
    mainLayout->addLayout(form);
    mainLayout->addStretch();
}

void SettingsPanel::applySettings() {
    // 1. Set theme preset
    int themeIdx = m_themeSelect->currentIndex();
    ThemeEngine::instance().setTheme(static_cast<ThemePreset>(themeIdx));
    
    // 2. Set font family
    ThemeEngine::instance().setFontFamily(m_fontSelect->currentText());
    
    // 3. Set font size
    ThemeEngine::instance().setFontSize(m_fontSizeSlider->value());
    
    // 4. Set reduced motion
    AnimationEngine::instance().setReducedMotion(m_reducedMotionCheck->isChecked());
    
    // 5. Update layout density debug output
    qDebug() << "[Settings] Settings updated instantly. Density:" 
             << (m_denseLayoutCheck->isChecked() ? "DENSE" : "COMFY");
}
