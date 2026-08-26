# -*- coding: utf-8 -*-
import sys
import os
import unittest

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from pipeline.sequence_models import TemporalPredictionEngine

class TestSequenceModels(unittest.TestCase):
    def setUp(self):
        self.engine = TemporalPredictionEngine()

    def test_inference_format(self):
        # A sequence of 10 matches logs, each with 5 parameters
        # Parameters: [Team_A_Possession, xG_diff, WeatherFatigue, CardCountDiff, PassAccuracy]
        seq = [
            [0.55, 0.2, 1.05, 0, 0.88],
            [0.60, 0.4, 1.05, 0, 0.90],
            [0.58, 0.3, 1.10, 0, 0.85],
            [0.62, 0.5, 1.10, 0, 0.89],
            [0.65, 0.7, 1.15, -1, 0.91],
            [0.68, 0.9, 1.15, -1, 0.92],
            [0.70, 1.1, 1.20, -1, 0.93],
            [0.72, 1.2, 1.20, -1, 0.94],
            [0.75, 1.4, 1.25, -1, 0.95],
            [0.78, 1.5, 1.25, -1, 0.96]
        ]
        
        res = self.engine.run_inference(seq)
        
        self.assertIn("lstm_projection", res)
        self.assertIn("transformer_projection", res)
        self.assertIn("framework", res)
        
        lstm = res["lstm_projection"]
        trans = res["transformer_projection"]
        
        self.assertIn("win_probability_a", lstm)
        self.assertIn("win_probability_b", lstm)
        self.assertIn("latency_ms", lstm)
        
        self.assertIn("win_probability_a", trans)
        self.assertIn("win_probability_b", trans)
        self.assertIn("latency_ms", trans)
        
        # Verify probabilities are valid percentages that roughly add up to 100%
        self.assertAlmostEqual(lstm["win_probability_a"] + lstm["win_probability_b"], 100.0, places=0)
        self.assertAlmostEqual(trans["win_probability_a"] + trans["win_probability_b"], 100.0, places=0)

if __name__ == "__main__":
    unittest.main()
