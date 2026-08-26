# -*- coding: utf-8 -*-
"""
CAMPUSX OS Kivy Client - Theme Configuration
Manages design tokens, active themes (Dark/Light/Special modes), and typography.
Synchronized with Next.js web application and Qt6 client.
"""

from kivy.utils import get_color_from_hex

class ThemeManager:
    _instance = None
    
    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(ThemeManager, cls).__new__(cls, *args, **kwargs)
            cls._instance.active_theme = 'dark' # Default matching dark mode
            cls._instance.listeners = []
            cls._instance.update_colors()
        return cls._instance

    def update_colors(self):
        t = self.active_theme

        # Set default/fallback colors (Liquid Glass Light preset values)
        self.bg_primary = get_color_from_hex('#F8FAFC')
        self.bg_secondary = [1, 1, 1, 0.75]
        self.bg_tertiary = [0.94, 0.96, 0.98, 0.85]
        self.text_main = get_color_from_hex('#0F172A')
        self.text_muted = get_color_from_hex('#475569')
        self.text_subtle = get_color_from_hex('#64748B')
        self.border = [1, 1, 1, 0.6]
        self.primary = get_color_from_hex('#4F46E5')
        self.primary_hover = get_color_from_hex('#4338CA')
        self.glass_bg = [1, 1, 1, 0.65]
        self.glass_border = [1, 1, 1, 0.6]
        self.glass_specular = [1, 1, 1, 0.9]
        self.primary_glow = [0.31, 0.27, 0.9, 0.25]

        if t == 'dark':
            self.bg_primary = get_color_from_hex('#090D16')
            self.bg_secondary = [0.06, 0.09, 0.15, 0.65]
            self.bg_tertiary = [0.12, 0.16, 0.22, 0.7]
            self.text_main = get_color_from_hex('#F9FAFB')
            self.text_muted = get_color_from_hex('#9CA3AF')
            self.text_subtle = get_color_from_hex('#6B7280')
            self.border = [1, 1, 1, 0.15]
            self.primary = get_color_from_hex('#6366F1')
            self.primary_hover = get_color_from_hex('#4F46E5')
            self.glass_bg = [0.06, 0.09, 0.15, 0.6]
            self.glass_border = [1, 1, 1, 0.15]
            self.glass_specular = [1, 1, 1, 0.25]
            self.primary_glow = [0.38, 0.4, 0.94, 0.25]

        elif t == 'amoled':
            self.bg_primary = get_color_from_hex('#000000')
            self.bg_secondary = get_color_from_hex('#050505')
            self.bg_tertiary = get_color_from_hex('#0C0C0C')
            self.text_main = get_color_from_hex('#FFFFFF')
            self.text_muted = get_color_from_hex('#A0A0A0')
            self.text_subtle = get_color_from_hex('#666666')
            self.border = get_color_from_hex('#1C1C1C')
            self.primary = get_color_from_hex('#4F46E5')
            self.primary_hover = get_color_from_hex('#4338CA')

        elif t == 'corporate':
            self.bg_primary = get_color_from_hex('#F3F4F6')
            self.bg_secondary = get_color_from_hex('#FFFFFF')
            self.bg_tertiary = get_color_from_hex('#E5E7EB')
            self.text_main = get_color_from_hex('#1F2937')
            self.text_muted = get_color_from_hex('#4B5563')
            self.text_subtle = get_color_from_hex('#9CA3AF')
            self.border = get_color_from_hex('#D1D5DB')
            self.primary = get_color_from_hex('#2563EB')
            self.primary_hover = get_color_from_hex('#1D4ED8')

        elif t == 'university':
            self.bg_primary = get_color_from_hex('#FDFBF7')
            self.bg_secondary = get_color_from_hex('#FFFFFF')
            self.bg_tertiary = get_color_from_hex('#F5EFEB')
            self.text_main = get_color_from_hex('#4A3E3D')
            self.text_muted = get_color_from_hex('#7A6F6D')
            self.text_subtle = get_color_from_hex('#9F9390')
            self.border = get_color_from_hex('#E8DFDA')
            self.primary = get_color_from_hex('#B45309')
            self.primary_hover = get_color_from_hex('#92400E')

        elif t == 'blue':
            self.bg_primary = get_color_from_hex('#F0F9FF')
            self.bg_secondary = get_color_from_hex('#FFFFFF')
            self.bg_tertiary = get_color_from_hex('#E0F2FE')
            self.text_main = get_color_from_hex('#0369A1')
            self.text_muted = get_color_from_hex('#0284C7')
            self.text_subtle = get_color_from_hex('#38BDF8')
            self.border = get_color_from_hex('#BAE6FD')
            self.primary = get_color_from_hex('#0284C7')
            self.primary_hover = get_color_from_hex('#0369A1')

        elif t == 'purple':
            self.bg_primary = get_color_from_hex('#FAF5FF')
            self.bg_secondary = get_color_from_hex('#FFFFFF')
            self.bg_tertiary = get_color_from_hex('#F3E8FF')
            self.text_main = get_color_from_hex('#6B21A8')
            self.text_muted = get_color_from_hex('#7E22CE')
            self.text_subtle = get_color_from_hex('#A855F7')
            self.border = get_color_from_hex('#E9D5FF')
            self.primary = get_color_from_hex('#7E22CE')
            self.primary_hover = get_color_from_hex('#6B21A8')

        elif t == 'green':
            self.bg_primary = get_color_from_hex('#F0FDF4')
            self.bg_secondary = get_color_from_hex('#FFFFFF')
            self.bg_tertiary = get_color_from_hex('#DCFCE7')
            self.text_main = get_color_from_hex('#166534')
            self.text_muted = get_color_from_hex('#15803D')
            self.text_subtle = get_color_from_hex('#22C55E')
            self.border = get_color_from_hex('#BBF7D0')
            self.primary = get_color_from_hex('#15803D')
            self.primary_hover = get_color_from_hex('#166534')

        elif t == 'red':
            self.bg_primary = get_color_from_hex('#FEF2F2')
            self.bg_secondary = get_color_from_hex('#FFFFFF')
            self.bg_tertiary = get_color_from_hex('#FEE2E2')
            self.text_main = get_color_from_hex('#991B1B')
            self.text_muted = get_color_from_hex('#B91C1C')
            self.text_subtle = get_color_from_hex('#EF4444')
            self.border = get_color_from_hex('#FECACA')
            self.primary = get_color_from_hex('#B91C1C')
            self.primary_hover = get_color_from_hex('#991B1B')

        elif t == 'high-contrast':
            self.bg_primary = get_color_from_hex('#000000')
            self.bg_secondary = get_color_from_hex('#000000')
            self.bg_tertiary = get_color_from_hex('#1E1E1E')
            self.text_main = get_color_from_hex('#FFFFFF')
            self.text_muted = get_color_from_hex('#FFFFFF')
            self.text_subtle = get_color_from_hex('#E0E0E0')
            self.border = get_color_from_hex('#FFFFFF')
            self.primary = get_color_from_hex('#FFFF00')
            self.primary_hover = get_color_from_hex('#CCCC00')

        # Constants Accents
        self.accent_cyan = get_color_from_hex('#0891B2')
        self.accent_emerald = get_color_from_hex('#059669')
        self.accent_ruby = get_color_from_hex('#E11D48')
        self.accent_amber = get_color_from_hex('#D97706')

    def set_theme(self, theme_name):
        valid_themes = ['light', 'dark', 'amoled', 'corporate', 'university', 'blue', 'purple', 'green', 'red', 'high-contrast']
        if theme_name in valid_themes:
            self.active_theme = theme_name
            self.update_colors()
            self.notify_listeners()

    def toggle_theme(self):
        valid_themes = ['light', 'dark', 'amoled', 'corporate', 'university', 'blue', 'purple', 'green', 'red', 'high-contrast']
        try:
            current_idx = valid_themes.index(self.active_theme)
        except ValueError:
            current_idx = 1 # Fallback to dark
        next_idx = (current_idx + 1) % len(valid_themes)
        self.set_theme(valid_themes[next_idx])

    def notify_listeners(self):
        for listener in self.listeners:
            try:
                listener()
            except Exception as e:
                print(f"[Theme] Listener notify failed: {e}")

    def register_listener(self, callback):
        if callback not in self.listeners:
            self.listeners.append(callback)

    def unregister_listener(self, callback):
        if callback in self.listeners:
            self.listeners.remove(callback)

# Single global manager instance
theme = ThemeManager()
