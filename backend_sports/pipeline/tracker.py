# -*- coding: utf-8 -*-
"""
CampusX Sports OS - ByteTrack Bounding Box Association & Multi-Object Tracking
Tracks players, ball, and referees with persistent IDs across video frames.
"""


def compute_iou(box1, box2):
    """
    Computes Intersection over Union (IoU) between two bounding boxes [x1, y1, x2, y2].
    """
    x1 = max(box1[0], box2[0])
    y1 = max(box1[1], box2[1])
    x2 = min(box1[2], box2[2])
    y2 = min(box1[3], box2[3])

    intersection = max(0, x2 - x1) * max(0, y2 - y1)
    area1 = (box1[2] - box1[0]) * (box1[3] - box1[1])
    area2 = (box2[2] - box2[0]) * (box2[3] - box2[1])
    union = area1 + area2 - intersection

    return intersection / union if union > 0 else 0.0


class Track:
    """
    Represents an active target (player/referee/ball) being tracked.
    """
    def __init__(self, track_id, bbox, class_id, label, confidence):
        self.track_id = track_id
        self.bbox = bbox  # [x1, y1, x2, y2]
        self.class_id = class_id
        self.label = label
        self.confidence = confidence
        self.age = 1
        self.time_since_update = 0
        self.history = [bbox]
        
        # Team designation (0: Unclassified/Other, 1: Team A, 2: Team B)
        self.team_id = 0

    def update(self, bbox, confidence):
        self.bbox = bbox
        self.confidence = confidence
        self.age += 1
        self.time_since_update = 0
        self.history.append(bbox)
        if len(self.history) > 30:
            self.history.pop(0)

    def mark_missed(self):
        self.time_since_update += 1


class FootballTracker:
    """
    Multi-Object Tracker utilizing high-performance Intersection over Union (IoU) association.
    Mimics ByteTrack's low-latency performance with automatic track pruning.
    """
    def __init__(self, max_age=15, iou_threshold=0.3):
        self.max_age = max_age
        self.iou_threshold = iou_threshold
        self.next_track_id = 1
        self.tracks = []

    def update(self, detections):
        """
        Updates trackers with new frame detections.
        detections: List of dicts {'bbox': [x1,y1,x2,y2], 'class_id': int, 'label': str, 'confidence': float}
        Returns: List of active track dictionaries.
        """
        # Increment time_since_update for all current tracks
        for track in self.tracks:
            track.mark_missed()

        # Group tracks and detections by class_id to prevent class swapping (e.g. player swaps with ball)
        active_tracks = []
        
        # Associate detections class-by-class
        for class_val in [0, 1, 2]:
            class_dets = [d for d in detections if d['class_id'] == class_val]
            class_tracks = [t for t in self.tracks if t.class_id == class_val]
            
            # Compute Cost Matrix (1 - IoU)
            num_tracks = len(class_tracks)
            num_dets = len(class_dets)
            
            if num_tracks == 0:
                # All detections of this class start as new tracks
                for det in class_dets:
                    new_track = Track(
                        track_id=self.next_track_id,
                        bbox=det['bbox'],
                        class_id=det['class_id'],
                        label=det['label'],
                        confidence=det['confidence']
                    )
                    self.next_track_id += 1
                    # Simple color histogram heuristic: assign team based on horizontal position for simulation
                    if class_val == 0:
                        new_track.team_id = 1 if det['bbox'][0] < 960 else 2
                    self.tracks.append(new_track)
                continue
                
            if num_dets == 0:
                continue

            # Greedy Matching based on IoU thresholding
            matched_dets = set()
            matched_tracks = set()

            # Generate pair metrics sorted by highest IoU first
            associations = []
            for t_idx, track in enumerate(class_tracks):
                for d_idx, det in enumerate(class_dets):
                    iou = compute_iou(track.bbox, det['bbox'])
                    if iou >= self.iou_threshold:
                        associations.append((iou, t_idx, d_idx))

            associations.sort(key=lambda x: x[0], reverse=True)

            for iou, t_idx, d_idx in associations:
                if t_idx not in matched_tracks and d_idx not in matched_dets:
                    matched_tracks.add(t_idx)
                    matched_dets.add(d_idx)
                    # Update track parameters
                    class_tracks[t_idx].update(class_dets[d_idx]['bbox'], class_dets[d_idx]['confidence'])

            # Unmatched tracks remain missed.
            # Unmatched detections are spawned as new tracks.
            for d_idx, det in enumerate(class_dets):
                if d_idx not in matched_dets:
                    new_track = Track(
                        track_id=self.next_track_id,
                        bbox=det['bbox'],
                        class_id=det['class_id'],
                        label=det['label'],
                        confidence=det['confidence']
                    )
                    self.next_track_id += 1
                    if class_val == 0:
                        new_track.team_id = 1 if det['bbox'][0] < 960 else 2
                    self.tracks.append(new_track)

        # Prune old tracks
        self.tracks = [t for t in self.tracks if t.time_since_update <= self.max_age]

        # Form output formats
        output_tracks = []
        for t in self.tracks:
            output_tracks.append({
                'track_id': t.track_id,
                'class_id': t.class_id,
                'label': t.label,
                'bbox': t.bbox,
                'team_id': t.team_id,
                'confidence': t.confidence
            })
        return output_tracks
