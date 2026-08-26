# -*- coding: utf-8 -*-
"""
CampusX Sports OS - Pipeline Unit & Integration Tests
Validates OpenCV homography projections, tracker association IoU, and tactical analytics.
"""

import sys
import os
import unittest

# Adjust python import paths to resolve pipeline scripts
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from pipeline.cv_modules import PitchCalibrator
from pipeline.tracker import FootballTracker, compute_iou
from pipeline.tactical_ai import TacticalAI


class TestPitchCalibrator(unittest.TestCase):
    def setUp(self):
        self.calibrator = PitchCalibrator()
        # Seed basic mapping: corners of image mapped to 105m x 68m pitch
        self.calibrator.calibrate_homography(
            src_points=[[0, 0], [1920, 0], [0, 1080], [1920, 1080]],
            dst_points=[[0.0, 0.0], [105.0, 0.0], [0.0, 68.0], [105.0, 68.0]]
        )

    def test_forward_projection(self):
        """
        Tests forward perspective projection from image space to pitch meters space.
        """
        # Center of image should project to center of pitch
        X, Y = self.calibrator.project_image_to_pitch(960, 540)
        self.assertAlmostEqual(X, 105.0 / 2, places=1)
        self.assertAlmostEqual(Y, 68.0 / 2, places=1)

    def test_inverse_projection(self):
        """
        Tests backward projection from pitch meters back to image coordinates.
        """
        u, v = self.calibrator.project_pitch_to_image(52.5, 34.0)
        self.assertAlmostEqual(u, 960, delta=10)
        self.assertAlmostEqual(v, 540, delta=10)


class TestTrackerAssociation(unittest.TestCase):
    def test_iou_calculation(self):
        """
        Tests intersection over union calculation between bounding boxes.
        """
        boxA = [100, 100, 200, 200]
        boxB = [150, 150, 250, 250]
        
        iou = compute_iou(boxA, boxB)
        # Expected intersection area = 50 * 50 = 2500
        # Expected union area = (100*100) + (100*100) - 2500 = 17500
        # Expected IoU = 2500 / 17500 = 0.142857
        self.assertAlmostEqual(iou, 0.142857, places=5)

    def test_tracker_updates(self):
        """
        Verifies that tracker matches incoming objects and maintains ID persistence.
        """
        tracker = FootballTracker(max_age=5, iou_threshold=0.3)
        
        # Frame 1: Initial player detection
        dets_f1 = [
            {'bbox': [100, 100, 150, 200], 'class_id': 0, 'label': 'player', 'confidence': 0.95}
        ]
        tracks_f1 = tracker.update(dets_f1)
        self.assertEqual(len(tracks_f1), 1)
        track_id = tracks_f1[0]['track_id']

        # Frame 2: Player slightly moved
        dets_f2 = [
            {'bbox': [105, 102, 155, 202], 'class_id': 0, 'label': 'player', 'confidence': 0.94}
        ]
        tracks_f2 = tracker.update(dets_f2)
        self.assertEqual(len(tracks_f2), 1)
        # ID must persist
        self.assertEqual(tracks_f2[0]['track_id'], track_id)


class TestTacticalAI(unittest.TestCase):
    def test_centroid_calculations(self):
        """
        Validates centroids calculation and block state classification.
        """
        tactics = TacticalAI()
        
        # Spawn mock track data representing Team A on left and Team B on right
        tracks = [
            {'class_id': 0, 'bbox': [100, 300, 140, 400], 'team_id': 1, 'confidence': 0.9},
            {'class_id': 0, 'bbox': [120, 400, 160, 500], 'team_id': 1, 'confidence': 0.9},
            {'class_id': 0, 'bbox': [1500, 300, 1540, 400], 'team_id': 2, 'confidence': 0.9},
            {'class_id': 0, 'bbox': [1600, 400, 1640, 500], 'team_id': 2, 'confidence': 0.9}
        ]
        
        analysis = tactics.analyze_tactics(tracks)
        centroids = analysis['centroids']
        
        # Centroid A should be on the left half of the pitch (< 52.5m)
        self.assertTrue(centroids['team_a'][0] < 52.5)
        # Centroid B should be on the right half of the pitch (> 52.5m)
        self.assertTrue(centroids['team_b'][0] > 52.5)
        
        # Test predicted wins
        self.assertIn('win_probability_a', analysis['predictions'])


class TestEventSynchronization(unittest.TestCase):
    def test_event_alignment(self):
        """
        Validates event synchronization matching logic and mismatch alerts.
        """
        from pipeline.sync import MatchEventSynchronizer
        sync = MatchEventSynchronizer(time_tolerance_sec=15)
        
        cv_events = [
            {"id": "b1", "event": "GOAL", "match_time": "72:45", "player": "Jackson Cole"},
            {"id": "b2", "event": "FOUL", "match_time": "32:15", "player": "Carlos Santana"}
        ]
        official_events = [
            {"id": "api_1", "type": "Goal", "time": "72:40", "player": "Jackson Cole"},
            {"id": "api_2", "type": "Foul", "time": "32:10", "player": "Marcus Vance"}
        ]
        
        aligned = sync.align_events(cv_events, official_events)
        
        self.assertEqual(len(aligned), 2)
        goal_match = next(x for x in aligned if x['cv_event'] and x['cv_event']['event'] == 'GOAL')
        self.assertEqual(goal_match['status'], 'ALIGNED')
        
        foul_match = next(x for x in aligned if x['cv_event'] and x['cv_event']['event'] == 'FOUL')
        self.assertEqual(foul_match['status'], 'ALIGNED_WITH_DISCREPANCY')


class TestStreamingIngest(unittest.TestCase):
    def test_factory_creation(self):
        """
        Checks that stream factory returns the correct adapter type.
        """
        from pipeline.ingest import StreamIngestFactory, VideoFileIngest, LiveStreamIngest
        ingest_file = StreamIngestFactory.create_ingest('local_mp4', 'match.mp4')
        self.assertIsInstance(ingest_file, VideoFileIngest)
        
        ingest_live = StreamIngestFactory.create_ingest('rtsp', 'rtsp://test')
        self.assertIsInstance(ingest_live, LiveStreamIngest)


if __name__ == '__main__':
    unittest.main()
