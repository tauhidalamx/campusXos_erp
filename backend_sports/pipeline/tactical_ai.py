# -*- coding: utf-8 -*-
"""
CampusX Sports OS - Tactical AI & Sequence Projections
Extracts team formations, low/high block states, compactness, and possession telemetry.
"""

import math

class TacticalAI:
    """
    Computes real-time tactical overlays, coordinates, and forecasts from 2D coordinates.
    """
    def __init__(self, pitch_length=105.0, pitch_width=68.0):
        self.pitch_length = pitch_length
        self.pitch_width = pitch_width

    def _mean(self, coords, default_val):
        if not coords:
            return default_val
        xs = [c[0] for c in coords]
        ys = [c[1] for c in coords]
        return [sum(xs) / len(coords), sum(ys) / len(coords)]

    def _std(self, coords):
        if len(coords) <= 1:
            return 15.0
        # Spread calculation of individual coordinates
        flat = [val for pt in coords for val in pt]
        mean_val = sum(flat) / len(flat)
        variance = sum((x - mean_val) ** 2 for x in flat) / len(flat)
        return math.sqrt(variance)

    def compute_team_centroids(self, tracks):
        """
        Calculates the centroid (average X, Y) for both teams in meters.
        """
        team_a_coords = []
        team_b_coords = []

        for t in tracks:
            if t['class_id'] == 0:  # player
                bbox = t['bbox']
                cx = (bbox[0] + bbox[2]) / 2.0
                cy = (bbox[1] + bbox[3]) / 2.0
                
                mx = (cx / 1920.0) * self.pitch_length
                my = (cy / 1080.0) * self.pitch_width

                if t['team_id'] == 1:
                    team_a_coords.append((mx, my))
                elif t['team_id'] == 2:
                    team_b_coords.append((mx, my))

        centroid_a = self._mean(team_a_coords, [self.pitch_length * 0.35, self.pitch_width * 0.5])
        centroid_b = self._mean(team_b_coords, [self.pitch_length * 0.65, self.pitch_width * 0.5])

        return centroid_a, centroid_b, team_a_coords, team_b_coords

    def analyze_tactics(self, tracks):
        """
        Extracts strategic formations, high-press flags, wing usage, and compactness metrics.
        """
        centroid_a, centroid_b, team_a, team_b = self.compute_team_centroids(tracks)

        compactness_a = self._std(team_a)
        compactness_b = self._std(team_b)

        # 2. Defensive Block classification
        # Centroid X closer to defense goal represents a Low/Mid Block. Centroid X high represents High Press.
        # Assuming Goal A is at X=0, Goal B is at X=105
        block_a = "Mid Block"
        if centroid_a[0] < self.pitch_length * 0.3:
            block_a = "Low Block"
        elif centroid_a[0] > self.pitch_length * 0.5:
            block_a = "High Press"

        block_b = "Mid Block"
        if centroid_b[0] > self.pitch_length * 0.7:
            block_b = "Low Block"
        elif centroid_b[0] < self.pitch_length * 0.5:
            block_b = "High Press"

        # 3. Possession and Momentum Trends (simulate attack forecasts)
        # Find which team is closest to the ball
        ball_track = next((t for t in tracks if t['class_id'] == 2), None)
        possession_team = 0
        if ball_track and (team_a or team_b):
            bb = ball_track['bbox']
            bcx = (bb[0] + bb[2]) / 2.0
            bcy = (bb[1] + bb[3]) / 2.0
            bmx = (bcx / 1920.0) * self.pitch_length
            bmy = (bcy / 1080.0) * self.pitch_width

            dist_a = min([math.hypot(p[0] - bmx, p[1] - bmy) for p in team_a]) if team_a else 999.0
            dist_b = min([math.hypot(p[0] - bmx, p[1] - bmy) for p in team_b]) if team_b else 999.0
            possession_team = 1 if dist_a < dist_b else 2

        # 4. Mock AI Win/Draw/Goal Projections based on centring dynamics
        win_prob_a = 0.45 + (centroid_a[0] - centroid_b[0]) / 200.0
        win_prob_a = max(0.05, min(0.95, win_prob_a))
        win_prob_b = 0.90 - win_prob_a
        draw_prob = 0.10

        return {
            'centroids': {
                'team_a': centroid_a,
                'team_b': centroid_b
            },
            'compactness': {
                'team_a': compactness_a,
                'team_b': compactness_b
            },
            'tactics': {
                'team_a': block_a,
                'team_b': block_b
            },
            'possession_team': possession_team,
            'predictions': {
                'win_probability_a': round(win_prob_a * 100, 1),
                'win_probability_b': round(win_prob_b * 100, 1),
                'draw_probability': round(draw_prob * 100, 1),
                'expected_goals_a': round(win_prob_a * 1.8, 2),
                'expected_goals_b': round(win_prob_b * 1.8, 2)
            }
        }
