# -*- coding: utf-8 -*-
"""
CampusX Sports OS - Weather Intelligence Engine
Integrates weather data interfaces (OpenWeatherMap, WeatherAPI, Tomorrow.io)
and computes tactical heuristics (ball wind-drift vectors, rain pitch slippage, heat fatigue).
"""

import os
import math
import random
from typing import Dict, Any, Optional

class BaseWeatherClient:
    """
    Abstract interface for retrieving weather telemetry from providers.
    """
    def __init__(self, api_key: Optional[str] = None, units: str = "metric"):
        self.api_key = api_key
        self.units = units

    def get_weather(self, lat: float, lon: float) -> Dict[str, Any]:
        raise NotImplementedError


class OpenWeatherMapClient(BaseWeatherClient):
    """
    Concrete adapter for OpenWeatherMap API.
    """
    def get_weather(self, lat: float, lon: float) -> Dict[str, Any]:
        # Implementation pattern for requests.get
        # Fallback to simulated conditions if API key is mock or unavailable
        if not self.api_key or self.api_key.startswith("mock"):
            return self._simulate(lat, lon)
        
        # Real integration format
        import requests
        url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={self.api_key}&units={self.units}"
        try:
            r = requests.get(url, timeout=5)
            if r.status_code == 200:
                data = r.json()
                return {
                    "temperature": data.get("main", {}).get("temp", 20.0),
                    "humidity": data.get("main", {}).get("humidity", 50.0),
                    "wind_speed": data.get("wind", {}).get("speed", 0.0),
                    "wind_deg": data.get("wind", {}).get("deg", 0),
                    "rain_1h": data.get("rain", {}).get("1h", 0.0),
                    "uv_index": 3.0, # Not in basic response
                    "provider": "OpenWeatherMap"
                }
        except Exception:
            pass
        return self._simulate(lat, lon)

    def _simulate(self, lat: float, lon: float) -> Dict[str, Any]:
        # Deterministic mock based on coordinates
        seed = int((lat + 90.0) * 1000 + (lon + 180.0))
        random.seed(seed)
        return {
            "temperature": round(15.0 + random.random() * 20.0, 1),
            "humidity": round(40.0 + random.random() * 50.0, 1),
            "wind_speed": round(random.random() * 12.0, 2), # m/s
            "wind_deg": random.randint(0, 359),
            "rain_1h": round(max(0.0, (random.random() - 0.7) * 10.0), 1),
            "uv_index": round(random.random() * 10.0, 1),
            "provider": "OpenWeatherMap (Simulated)"
        }


class WeatherAPIClient(BaseWeatherClient):
    """
    Concrete adapter for WeatherAPI.com.
    """
    def get_weather(self, lat: float, lon: float) -> Dict[str, Any]:
        if not self.api_key or self.api_key.startswith("mock"):
            return self._simulate(lat, lon)

        import requests
        url = f"https://api.weatherapi.com/v1/current.json?key={self.api_key}&q={lat},{lon}"
        try:
            r = requests.get(url, timeout=5)
            if r.status_code == 200:
                data = r.json()
                curr = data.get("current", {})
                return {
                    "temperature": curr.get("temp_c", 20.0),
                    "humidity": curr.get("humidity", 50.0),
                    "wind_speed": curr.get("wind_kph", 0.0) / 3.6, # Convert to m/s
                    "wind_deg": curr.get("wind_degree", 0),
                    "rain_1h": curr.get("precip_mm", 0.0),
                    "uv_index": curr.get("uv", 3.0),
                    "provider": "WeatherAPI"
                }
        except Exception:
            pass
        return self._simulate(lat, lon)

    def _simulate(self, lat: float, lon: float) -> Dict[str, Any]:
        return OpenWeatherMapClient(self.api_key)._simulate(lat, lon)


class TomorrowIOClient(BaseWeatherClient):
    """
    Concrete adapter for Tomorrow.io API.
    """
    def get_weather(self, lat: float, lon: float) -> Dict[str, Any]:
        if not self.api_key or self.api_key.startswith("mock"):
            return self._simulate(lat, lon)

        import requests
        url = f"https://api.tomorrow.io/v4/weather/realtime?location={lat},{lon}&apikey={self.api_key}"
        try:
            r = requests.get(url, timeout=5)
            if r.status_code == 200:
                data = r.json()
                vals = data.get("data", {}).get("values", {})
                return {
                    "temperature": vals.get("temperature", 20.0),
                    "humidity": vals.get("humidity", 50.0),
                    "wind_speed": vals.get("windSpeed", 0.0),
                    "wind_deg": vals.get("windDirection", 0),
                    "rain_1h": vals.get("precipitationIntensity", 0.0),
                    "uv_index": vals.get("uvIndex", 3.0),
                    "provider": "Tomorrow.io"
                }
        except Exception:
            pass
        return self._simulate(lat, lon)

    def _simulate(self, lat: float, lon: float) -> Dict[str, Any]:
        return OpenWeatherMapClient(self.api_key)._simulate(lat, lon)


class WeatherImpactCalculator:
    """
    Translates weather features into tactical coefficients.
    
    Mathematics:
    1. Ball Wind Drag Drift vector:
       F_drag = -0.5 * Cd * rho * A * (v_ball - v_wind) * |v_ball - v_wind|
       We compute drift offset scaling linearly with wind speed and angle projection.
    
    2. Passing Accuracy Coefficient:
       Acc_multiplier = 1.0 - (0.015 * WindSpeed) - (0.025 * RainIntensity)
       Slick pitch surfaces reduce initial pass friction but decrease reception capture success.
    
    3. Player Stamina Decay multiplier:
       Fatigue_rate = 1.0 + max(0, Temp - 26) * 0.04 + max(0, Humidity - 65) * 0.015
    """
    def __init__(self):
        # Aerodynamic and environment constants
        self.Cd = 0.45       # Football drag coefficient
        self.rho = 1.20      # Air density (kg/m^3) at sea level
        self.radius = 0.11   # Football radius (meters)
        self.mass = 0.43     # Football mass (kg)
        self.area = math.pi * (self.radius ** 2)

    def calculate_impacts(self, weather_data: Dict[str, Any]) -> Dict[str, Any]:
        temp = weather_data.get("temperature", 20.0)
        humidity = weather_data.get("humidity", 50.0)
        wind_speed = weather_data.get("wind_speed", 0.0) # in m/s
        wind_deg = weather_data.get("wind_deg", 0)       # angle in degrees
        rain = weather_data.get("rain_1h", 0.0)          # mm/h
        uv = weather_data.get("uv_index", 3.0)

        # 1. Stamina fatigue drain rate (Base = 1.0)
        fatigue_multiplier = 1.0
        if temp > 26.0:
            fatigue_multiplier += (temp - 26.0) * 0.04
        if humidity > 65.0:
            fatigue_multiplier += (humidity - 65.0) * 0.012
        if uv > 7.0:
            fatigue_multiplier += (uv - 7.0) * 0.02

        # 2. Passing accuracy & pitch friction coefficient
        # Rain makes pitch slicker (friction drops, slide increases)
        pitch_friction = max(0.4, 0.9 - (rain * 0.05))
        passing_accuracy_multiplier = max(0.6, 1.0 - (wind_speed * 0.012) - (rain * 0.03))

        # 3. Wind force vector on pitch (2D projection: x = length 105m, y = width 68m)
        # Assuming wind degree is meteorological (0 = North/from top, 90 = East/from right)
        # Convert to radians and project
        wind_rad = math.radians(wind_deg)
        wind_vec_x = -wind_speed * math.sin(wind_rad)
        wind_vec_y = -wind_speed * math.cos(wind_rad)

        # 4. Trajectory skew factor per second of flight time
        # s_drift = 0.5 * a_wind * t^2
        # where acceleration a = F_wind / mass_ball = 0.5 * Cd * rho * Area * v_wind^2 / mass
        acc_x = 0.5 * self.Cd * self.rho * self.area * (wind_vec_x * abs(wind_vec_x)) / self.mass
        acc_y = 0.5 * self.Cd * self.rho * self.area * (wind_vec_y * abs(wind_vec_y)) / self.mass

        return {
            "fatigue_drain_multiplier": round(fatigue_multiplier, 3),
            "passing_accuracy_multiplier": round(passing_accuracy_multiplier, 3),
            "pitch_surface_friction": round(pitch_friction, 2),
            "wind_vector": {
                "x": round(wind_vec_x, 3),
                "y": round(wind_vec_y, 3)
            },
            "ball_acceleration_drift": {
                "x_m_s2": round(acc_x, 4),
                "y_m_s2": round(acc_y, 4)
            },
            "weather_descriptor": self._get_descriptor(temp, wind_speed, rain)
        }

    def _get_descriptor(self, temp: float, wind: float, rain: float) -> str:
        if rain > 5.0:
            return "Heavy Rain & Slick Pitch"
        elif rain > 0.1:
            return "Damp Surface / Wet Rain"
        elif wind > 8.0:
            return "Gale Wind Alert"
        elif temp > 30.0:
            return "Extreme Heat Precautions"
        return "Optimal Match Play conditions"


class WeatherEngineFactory:
    """
    Factory pattern provider for selecting and loading the preferred Weather Client.
    """
    @staticmethod
    def create_client(provider: str, api_key: Optional[str] = None) -> BaseWeatherClient:
        p = provider.lower().strip()
        if p == "weatherapi":
            return WeatherAPIClient(api_key)
        elif p == "tomorrowio" or p == "tomorrow.io":
            return TomorrowIOClient(api_key)
        else:
            return OpenWeatherMapClient(api_key)
