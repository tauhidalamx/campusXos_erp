# -*- coding: utf-8 -*-
import sys
import os
import unittest

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from pipeline.weather_engine import WeatherEngineFactory, WeatherImpactCalculator

class TestWeatherEngine(unittest.TestCase):
    def setUp(self):
        self.calculator = WeatherImpactCalculator()

    def test_factory_creation(self):
        client = WeatherEngineFactory.create_client("openweathermap", "mock_key")
        self.assertEqual(client.__class__.__name__, "OpenWeatherMapClient")

        client_api = WeatherEngineFactory.create_client("weatherapi", "mock_key")
        self.assertEqual(client_api.__class__.__name__, "WeatherAPIClient")

        client_tom = WeatherEngineFactory.create_client("tomorrow.io", "mock_key")
        self.assertEqual(client_tom.__class__.__name__, "TomorrowIOClient")

    def test_default_simulation_payload(self):
        client = WeatherEngineFactory.create_client("openweathermap")
        res = client.get_weather(40.7128, -74.0060)
        self.assertIn("temperature", res)
        self.assertIn("wind_speed", res)
        self.assertIn("humidity", res)
        self.assertTrue(res["provider"].startswith("OpenWeatherMap"))

    def test_impact_calculations_standard(self):
        # Optimal day: 20C, 50% hum, 0 wind, 0 rain
        w_data = {
            "temperature": 20.0,
            "humidity": 50.0,
            "wind_speed": 0.0,
            "wind_deg": 0,
            "rain_1h": 0.0,
            "uv_index": 3.0
        }
        res = self.calculator.calculate_impacts(w_data)
        self.assertEqual(res["fatigue_drain_multiplier"], 1.0)
        self.assertEqual(res["passing_accuracy_multiplier"], 1.0)
        self.assertEqual(res["pitch_surface_friction"], 0.9)
        self.assertEqual(res["wind_vector"]["x"], 0.0)
        self.assertEqual(res["wind_vector"]["y"], 0.0)

    def test_impact_calculations_extreme(self):
        # Extreme hot windy rain day
        w_data = {
            "temperature": 35.0, # fatigue drain penalty
            "humidity": 80.0,    # fatigue drain penalty
            "wind_speed": 10.0,  # passing accuracy penalty
            "wind_deg": 90,      # wind projects along x axis
            "rain_1h": 6.0,      # heavy rain, friction drops, accuracy drops
            "uv_index": 8.0
        }
        res = self.calculator.calculate_impacts(w_data)
        self.assertGreater(res["fatigue_drain_multiplier"], 1.0)
        self.assertLess(res["passing_accuracy_multiplier"], 0.8)
        self.assertLess(res["pitch_surface_friction"], 0.9)
        self.assertLess(res["wind_vector"]["x"], -5.0) # wind from right (90 deg) is negative x direction
        self.assertGreater(abs(res["ball_acceleration_drift"]["x_m_s2"]), 0.0)

if __name__ == "__main__":
    unittest.main()
