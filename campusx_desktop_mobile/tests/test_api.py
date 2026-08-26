# -*- coding: utf-8 -*-
"""
CAMPUSX OS Kivy Client - Unit Test Cases
Tests the REST APIs, local offline cache tables, and theme listeners.
"""

import sys
import os
import unittest
import shutil

# Force offline mode for tests by pointing to dead ports
os.environ["CAMPUSX_API_URL"] = "http://localhost:5999/api"
os.environ["CAMPUSX_SPORTS_API_URL"] = "http://localhost:8999/api"

# Ensure workspace paths are imported correctly
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from api import ApiClient
from ui.theme import theme

class TestCampusXClientEngine(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Configure test DB path to avoid messing with main cache
        cls.api = ApiClient()
        cls.api.cache_db_path = "campusx_test_cache.db"
        cls.api._init_cache_db()

    @classmethod
    def tearDownClass(cls):
        # Clean up database file
        if os.path.exists("campusx_test_cache.db"):
            os.remove("campusx_test_cache.db")

    def setUp(self):
        self.api.clear_cache()

    def test_offline_login_shortcuts(self):
        """Tests that local offline fallback logins successfully authenticate and map roles."""
        # 1. Admin shortcut check
        res = self.api.login("admin@campusx.edu", "admin123")
        self.assertTrue(res["success"])
        self.assertEqual(res["user"]["role"], "admin")
        self.assertTrue(self.api.offline_mode)

        # 2. Student shortcut check
        res = self.api.login("student@campusx.edu", "student123")
        self.assertTrue(res["success"])
        self.assertEqual(res["user"]["role"], "student")
        
        # 3. Invalid check
        res = self.api.login("unknown@campusx.edu", "wrongpw")
        self.assertFalse(res["success"])

    def test_cache_engine_write_and_read(self):
        """Tests offline local database SQLite caching capabilities."""
        endpoint = "/mock/roster"
        test_payload = {"count": 12, "roster": ["Alex", "Maya", "Jackson"]}
        
        self.api.save_cached_response(endpoint, test_payload)
        cached = self.api.get_cached_response(endpoint)
        
        self.assertIsNotNone(cached)
        self.assertEqual(cached["count"], 12)
        self.assertEqual(cached["roster"][1], "Maya")

    def test_theme_manager_toggle_and_notify(self):
        """Tests dynamic design theme toggles and callbacks listeners."""
        self.notified = False
        
        def listener():
            self.notified = True
            
        theme.register_listener(listener)
        
        # Test Light state
        theme.set_theme('light')
        self.assertEqual(theme.bg_secondary, [1, 1, 1, 1]) # white
        
        # Toggle theme and ensure callback triggers
        theme.toggle_theme()
        self.assertEqual(theme.active_theme, 'dark')
        self.assertTrue(self.notified)
        
        # Test Dark state (Hex #0B0F19)
        self.assertEqual(theme.bg_primary, [11/255.0, 15/255.0, 25/255.0, 1.0])
        
        # Cleanup listener
        theme.unregister_listener(listener)

if __name__ == '__main__':
    unittest.main()
