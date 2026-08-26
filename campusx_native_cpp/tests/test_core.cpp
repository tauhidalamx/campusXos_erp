#include <cassert>
#include <iostream>
#include "CampusXCore.hpp"
#include "ThemeEngine.hpp"
#include "AnimationEngine.hpp"

// Standalone C++ verification test suite
void testCoreConfiguration() {
    CampusXCore::instance().setConfig("test_key", "campusx_value_100x");
    assert(CampusXCore::instance().getConfig("test_key") == "campusx_value_100x");
    std::cout << "[C++ Test] Core Configuration Passed." << std::endl;
}

void testThemeEnginePresets() {
    // Default should be Dark
    assert(ThemeEngine::instance().activeTheme() == ThemePreset::Dark);
    assert(ThemeEngine::instance().primaryColor() == "#6366F1"); // Indigo
    
    // Switch to Light
    ThemeEngine::instance().setTheme(ThemePreset::Light);
    assert(ThemeEngine::instance().activeTheme() == ThemePreset::Light);
    assert(ThemeEngine::instance().bgPrimary() == "#F8FAFC");
    
    std::cout << "[C++ Test] Theme Engine Presets Passed." << std::endl;
}

void testAnimationEngineFlags() {
    // Default should be false
    assert(AnimationEngine::instance().isReducedMotion() == false);
    
    // Toggle motion reduction
    AnimationEngine::instance().setReducedMotion(true);
    assert(AnimationEngine::instance().isReducedMotion() == true);
    
    std::cout << "[C++ Test] Animation Engine Flags Passed." << std::endl;
}

int main() {
    std::cout << "Starting CampusX C++ Platform Core Unit Tests..." << std::endl;
    testCoreConfiguration();
    testThemeEnginePresets();
    testAnimationEngineFlags();
    std::cout << "All C++ UI/Theme/Animation Tests Passed Successfully: OK" << std::endl;
    return 0;
}
