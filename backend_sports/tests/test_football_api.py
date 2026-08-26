# -*- coding: utf-8 -*-
import sys
import os
import unittest
import shutil

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from pipeline.football_api import FootballAPIClientFactory

class TestFootballAPI(unittest.TestCase):
    def setUp(self):
        self.test_cache_dir = "cache/sports_test_cache"
        os.makedirs(self.test_cache_dir, exist_ok=True)

    def tearDown(self):
        if os.path.exists(self.test_cache_dir):
            shutil.rmtree(self.test_cache_dir)

    def test_factory_creation(self):
        client = FootballAPIClientFactory.create_client("football-data.org", "mock_key")
        self.assertEqual(client.__class__.__name__, "FootballDataOrgClient")

        client_apif = FootballAPIClientFactory.create_client("api-football", "mock_key")
        self.assertEqual(client_apif.__class__.__name__, "APIFootballClient")

    def test_simulation_data_retrieval(self):
        client = FootballAPIClientFactory.create_client("football-data.org", "mock_key", cache_dir=self.test_cache_dir)
        standings = client.get_standings("PL")
        self.assertEqual(len(standings), 3)
        self.assertEqual(standings[0]["team"], "CampusX United FC")

        events = client.get_match_events("match_101")
        self.assertGreater(len(events), 0)
        self.assertEqual(events[0]["type"], "Goal")

    def test_caching_mechanism(self):
        client = FootballAPIClientFactory.create_client("football-data.org", "mock_key", cache_dir=self.test_cache_dir)
        
        # Initial read (caches mock data)
        _ = client.get_standings("PL")
        cache_file = os.path.join(self.test_cache_dir, "fd_standings_PL.json")
        self.assertTrue(os.path.exists(cache_file))

        # Modify cached file manually to check if cache read is triggered
        with open(cache_file, "r") as f:
            data = json_load = eval(f.read())
        
        data[0]["team"] = "Cached United"
        
        import json
        with open(cache_file, "w") as f:
            json.dump(data, f)
            
        # Second read (hits cache and fetches updated team name)
        cached_standings = client.get_standings("PL")
        self.assertEqual(cached_standings[0]["team"], "Cached United")

if __name__ == "__main__":
    unittest.main()
