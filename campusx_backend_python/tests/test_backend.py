# -*- coding: utf-8 -*-
"""
CAMPUSX OS Python Backend - Automated Unit Test Cases
Tests password hashing matching, router routes, and AI grade predicting.
"""

import sys
import os
import unittest
from fastapi.testclient import TestClient

# Ensure workspace paths are imported correctly
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from campusx_backend_python.main import app
from campusx_backend_python.routers.auth import hash_password

class TestCampusXBackendEngine(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_js_compatible_password_hash(self):
        """Tests that password hashing matches the JS base36 format."""
        # admin123 hash value should match JS h$ absolute values
        self.assertEqual(hash_password("admin123"), "h$g10hvh")
        self.assertEqual(hash_password("student123"), "h$h2pckp")
        self.assertEqual(hash_password("faculty123"), "h$rwy182")

    def test_auth_login_endpoints(self):
        """Tests that the auth endpoint provisions demo credentials successfully."""
        res = self.client.post("/api/auth/login", json={
            "email": "admin@campusx.edu",
            "password": "admin123"
        })
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data["success"])
        self.assertIn("token", data)
        self.assertEqual(data["user"]["role"], "admin")

    def test_erp_timetables_and_admissions(self):
        """Tests student list directories and admissions application lists."""
        res = self.client.get("/api/admissions/applications")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(len(data) >= 2)
        self.assertEqual(data[0]["name"], "Alice Johnson")

    def test_connect_forum_feed(self):
        """Tests connect posts feed listing."""
        res = self.client.get("/api/posts")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(len(data) >= 3)
        self.assertEqual(data[0]["user_name"], "Dean Evelyn Sterling")

    def test_chain_notary_verifications(self):
        """Tests SBT hash notary verification verifiers."""
        res = self.client.post("/api/chain/verify", json={
            "hash": "0x9f3c2c1a8b9412fdbce7a81204d8"
        })
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data["verified"])
        self.assertEqual(data["status"], "INTEGRITY VERIFIED")

    def test_ai_outcomes_predictor(self):
        """Tests AI grade outcome risk modeling logic matching calculations."""
        res = self.client.post("/api/ai/predict-outcome", json={
            "cgpa": 3.8,
            "attendance": 92.0,
            "midterm": 85.0
        })
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["predicted_grade"], "A+")
        self.assertEqual(data["risk_level"], "LOW")
        
        # Test attendance default warning override
        res_warn = self.client.post("/api/ai/predict-outcome", json={
            "cgpa": 3.8,
            "attendance": 65.0,
            "midterm": 85.0
        })
        self.assertEqual(res_warn.json()["predicted_grade"], "F")
        self.assertEqual(res_warn.json()["risk_level"], "HIGH_ATTENDANCE_WARN")

if __name__ == '__main__':
    unittest.main()
