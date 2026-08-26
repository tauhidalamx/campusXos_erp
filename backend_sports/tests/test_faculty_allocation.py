# -*- coding: utf-8 -*-
import sys
import os
import unittest
import urllib.request
import urllib.error
import json
import random

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

class TestFacultyAllocationSystem(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.course_code = f"CS{random.randint(500, 999)}"
        cls.section_name = "X"
        cls.session_name = "Spring 2026"
        cls.faculty_id = "FAC001" # Professor Sterling

    def setUp(self):
        self.gateway_url = "http://localhost:5000"

    def test_01_create_course_offering(self):
        url = f"{self.gateway_url}/api/faculty-allocation/offerings"
        payload = {
            "course_code": self.course_code,
            "course_name": "Next-Gen Quantum Compiler Design",
            "credits": 4,
            "theory_hours": 3,
            "lab_hours": 2,
            "tutorial_hours": 1,
            "department": "CS",
            "semester": "Semester 7",
            "program": "B.Tech CSE",
            "academic_session": self.session_name,
            "max_students": 50,
            "classroom_req": "LH-205",
            "lab_req": "Lab-Quantum"
        }
        
        req = urllib.request.Request(
            url, 
            data=json.dumps(payload).encode('utf-8'),
            headers={'Content-Type': 'application/json'}
        )
        try:
            with urllib.request.urlopen(req) as r:
                res = json.loads(r.read().decode('utf-8'))
                self.assertTrue(res.get("success"))
                offering = res.get("offering")
                self.assertIsNotNone(offering)
                self.assertEqual(offering.get("course_code"), self.course_code)
        except urllib.error.HTTPError as e:
            self.fail(f"Failed to create course offering: {e.read().decode('utf-8')}")
        except Exception as e:
            self.fail(f"Failed to create course offering: {e}")

    def test_02_create_section(self):
        url = f"{self.gateway_url}/api/faculty-allocation/sections"
        payload = {
            "section_name": self.section_name,
            "batch": "2023",
            "student_count": 45,
            "mentor_id": self.faculty_id,
            "course_code": self.course_code,
            "theory_faculty_id": self.faculty_id,
            "lab_faculty_id": "FAC007",
            "classroom": "LH-205",
            "lab_classroom": "Lab-Quantum",
            "academic_session": self.session_name
        }
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode('utf-8'),
            headers={'Content-Type': 'application/json'}
        )
        try:
            with urllib.request.urlopen(req) as r:
                res = json.loads(r.read().decode('utf-8'))
                self.assertTrue(res.get("success"))
                sec = res.get("section")
                self.assertIsNotNone(sec)
                self.assertEqual(sec.get("section_name"), self.section_name)
        except urllib.error.HTTPError as e:
            self.fail(f"Failed to allocate section: {e.read().decode('utf-8')}")

    def test_03_submit_allocation_and_validate_workload(self):
        url = f"{self.gateway_url}/api/faculty-allocation/allocations"
        payload = {
            "course_code": self.course_code,
            "faculty_id": self.faculty_id,
            "section_name": self.section_name,
            "assigned_hours": 3,
            "role": "LECTURER",
            "status": "PENDING"
        }
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode('utf-8'),
            headers={'Content-Type': 'application/json'}
        )
        try:
            with urllib.request.urlopen(req) as r:
                res = json.loads(r.read().decode('utf-8'))
                self.assertTrue(res.get("success"))
                self.assertIn("overloaded", res)
                self.assertIn("currentLoad", res)
                
                allocation = res.get("allocation")
                self.assertIsNotNone(allocation)
                self.assertEqual(allocation.get("course_code"), self.course_code)
                self.assertEqual(allocation.get("faculty_id"), self.faculty_id)
        except urllib.error.HTTPError as e:
            self.fail(f"Failed to submit allocation: {e.read().decode('utf-8')}")

    def test_04_ai_recommender(self):
        url = f"{self.gateway_url}/api/faculty-allocation/ai-recommendations?courseCode={self.course_code}"
        try:
            with urllib.request.urlopen(url) as r:
                res = json.loads(r.read().decode('utf-8'))
                self.assertTrue(res.get("success"))
                recs = res.get("recommendations")
                self.assertIsNotNone(recs)
                self.assertGreater(len(recs), 0)
                
                # Check for top match has keys
                first = recs[0]
                self.assertIn("facultyId", first)
                self.assertIn("confidenceScore", first)
                self.assertIn("reason", first)
        except urllib.error.HTTPError as e:
            self.fail(f"Failed to get AI recommendations: {e.read().decode('utf-8')}")

    def test_05_workflow_signoff_pipeline(self):
        # 1. Fetch pending allocations to find the created ID
        url_get = f"{self.gateway_url}/api/faculty-allocation/allocations"
        try:
            with urllib.request.urlopen(url_get) as r:
                res_get = json.loads(r.read().decode('utf-8'))
                self.assertTrue(res_get.get("success"))
                allocs = res_get.get("allocations")
                test_alloc = next((a for a in allocs if a.get("course_code") == self.course_code), None)
                self.assertIsNotNone(test_alloc)
                alloc_id = test_alloc.get("id")

                # 2. HOD signoff approval
                url_app = f"{self.gateway_url}/api/faculty-allocation/approve"
                payload_hod = {
                    "id": alloc_id,
                    "role": "hod",
                    "action": "APPROVE"
                }
                req_hod = urllib.request.Request(url_app, data=json.dumps(payload_hod).encode('utf-8'), headers={'Content-Type': 'application/json'})
                with urllib.request.urlopen(req_hod) as r_hod:
                    self.assertTrue(json.loads(r_hod.read().decode('utf-8')).get("success"))

                # 3. Dean signoff approval
                payload_dean = {
                    "id": alloc_id,
                    "role": "dean",
                    "action": "APPROVE"
                }
                req_dean = urllib.request.Request(url_app, data=json.dumps(payload_dean).encode('utf-8'), headers={'Content-Type': 'application/json'})
                with urllib.request.urlopen(req_dean) as r_dean:
                    self.assertTrue(json.loads(r_dean.read().decode('utf-8')).get("success"))

                # 4. Registrar signoff approval
                payload_reg = {
                    "id": alloc_id,
                    "role": "registrar",
                    "action": "APPROVE"
                }
                req_reg = urllib.request.Request(url_app, data=json.dumps(payload_reg).encode('utf-8'), headers={'Content-Type': 'application/json'})
                with urllib.request.urlopen(req_reg) as r_reg:
                    self.assertTrue(json.loads(r_reg.read().decode('utf-8')).get("success"))

                # 5. Publish Matrix (resolves slots, blockchain notarization proof)
                url_pub = f"{self.gateway_url}/api/faculty-allocation/publish"
                payload_pub = {
                    "academic_session": self.session_name
                }
                req_pub = urllib.request.Request(url_pub, data=json.dumps(payload_pub).encode('utf-8'), headers={'Content-Type': 'application/json'})
                with urllib.request.urlopen(req_pub) as r_pub:
                    res_pub = json.loads(r_pub.read().decode('utf-8'))
                    self.assertTrue(res_pub.get("success"))
                    self.assertGreaterEqual(res_pub.get("publishedCount"), 1)
                    self.assertGreaterEqual(len(res_pub.get("txHashes")), 1)
                    
                    # Verify first txHash is mock ledger proof
                    tx = res_pub.get("txHashes")[0]
                    self.assertTrue(tx.startswith("0xalloc_proof_"))

        except urllib.error.HTTPError as e:
            self.fail(f"Failed in workflow signoff sequence: {e.read().decode('utf-8')}")

    def test_06_analytics_feed(self):
        url = f"{self.gateway_url}/api/faculty-allocation/analytics"
        try:
            with urllib.request.urlopen(url) as r:
                res = json.loads(r.read().decode('utf-8'))
                self.assertTrue(res.get("success"))
                self.assertIn("workloads", res)
                self.assertIn("sectionsSummary", res)
                self.assertIn("classroomUtilization", res)
        except urllib.error.HTTPError as e:
            self.fail(f"Failed to load analytics: {e.read().decode('utf-8')}")

if __name__ == "__main__":
    unittest.main()
