# -*- coding: utf-8 -*-
"""
dmgbuild settings for CAMPUSX OS DMG Installer Package
Configures window sizes, positions, backgrounds, and applications shortcuts.
"""

import os

# Volume settings
volume_name = 'CAMPUSX OS Installer'
format = 'UDZO'

# Window layout sizing
window_rect = ((200, 200), (600, 400))
background = 'builtin-arrow'

# Icon attributes
icon_size = 128
icon_locations = {
    'CampusXOS.app': (150, 200),
    'Applications': (450, 200)
}

# Symlinks definition
symlinks = {
    'Applications': '/Applications'
}
