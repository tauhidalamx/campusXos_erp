# -*- coding: utf-8 -*-
"""
CampusX Sports OS - Computer Vision Preprocessing & Homography Modules
Designed for real-time camera calibration, line segmentation, and 2D tactical projection.
"""

import math

try:
    import cv2
    import numpy as np
    OPENCV_AVAILABLE = True
except ImportError:
    OPENCV_AVAILABLE = False

class PitchCalibrator:
    """
    Handles camera lens distortion correction, perspective transforms, and 2D homography estimation.
    Maps pixel space (u, v) to physical pitch space (X, Y) in meters (e.g. 105m x 68m).
    """
    def __init__(self, pitch_length=105.0, pitch_width=68.0):
        self.pitch_length = pitch_length
        self.pitch_width = pitch_width
        self.homography_matrix = None
        self.inv_homography_matrix = None

    def calibrate_homography(self, src_points, dst_points):
        """
        Estimates the 3x3 homography matrix H mapping image points to pitch space.
        src_points: List of 4 or more tuples/lists representing (u, v) coordinates in the image.
        dst_points: List of corresponding (X, Y) coordinates in meters on the physical pitch.
        """
        if not OPENCV_AVAILABLE:
            # Calculate dynamic bounding box scaling ratios for simulator fallbacks
            src_w = max([p[0] for p in src_points]) or 1920.0
            src_h = max([p[1] for p in src_points]) or 1080.0
            dst_w = max([p[0] for p in dst_points]) or 105.0
            dst_h = max([p[1] for p in dst_points]) or 68.0
            
            sx = dst_w / src_w
            sy = dst_h / src_h
            
            self.homography_matrix = [[sx, 0.0, 0.0], [0.0, sy, 0.0], [0.0, 0.0, 1.0]]
            self.inv_homography_matrix = [[1.0 / sx, 0.0, 0.0], [0.0, 1.0 / sy, 0.0], [0.0, 0.0, 1.0]]
            return True

        src_pts = np.array(src_points, dtype=np.float32).reshape(-1, 1, 2)
        dst_pts = np.array(dst_points, dtype=np.float32).reshape(-1, 1, 2)

        H, status = cv2.findHomography(src_pts, dst_pts, cv2.RANSAC, 5.0)
        self.homography_matrix = H
        if H is not None:
            self.inv_homography_matrix = np.linalg.inv(H)
            return True
        return False

    def project_image_to_pitch(self, u, v):
        """
        Projects an image pixel coordinate (u, v) onto the physical 2D pitch (X, Y) in meters.
        """
        if self.homography_matrix is None:
            return (u / 1920.0) * self.pitch_length, (v / 1080.0) * self.pitch_width

        if OPENCV_AVAILABLE:
            pts = np.array([[[u, v]]], dtype=np.float32)
            projected = cv2.perspectiveTransform(pts, self.homography_matrix)
            return float(projected[0][0][0]), float(projected[0][0][1])
        else:
            # Pure python fallback matrix multiplication
            h = self.homography_matrix
            w = h[2][0]*u + h[2][1]*v + h[2][2]
            w = w if w != 0 else 1.0
            x = (h[0][0]*u + h[0][1]*v + h[0][2]) / w
            y = (h[1][0]*u + h[1][1]*v + h[1][2]) / w
            return float(x), float(y)

    def project_pitch_to_image(self, X, Y):
        """
        Projects physical coordinates (X, Y) in meters back onto the image pixel coordinates (u, v).
        """
        if self.inv_homography_matrix is None:
            return int((X / self.pitch_length) * 1920), int((Y / self.pitch_width) * 1080)

        if OPENCV_AVAILABLE:
            pts = np.array([[[X, Y]]], dtype=np.float32)
            projected = cv2.perspectiveTransform(pts, self.inv_homography_matrix)
            return int(projected[0][0][0]), int(projected[0][0][1])
        else:
            h = self.inv_homography_matrix
            w = h[2][0]*X + h[2][1]*Y + h[2][2]
            w = w if w != 0 else 1.0
            u_pos = (h[0][0]*X + h[0][1]*Y + h[0][2]) / w
            v_pos = (h[1][0]*X + h[1][1]*Y + h[1][2]) / w
            return int(u_pos), int(v_pos)


class FieldLineSegmenter:
    """
    Segments green pitch grass, detects field boundary lines, and goalposts using HSV masking and Hough Transforms.
    """
    @staticmethod
    def extract_pitch_mask(frame):
        if not OPENCV_AVAILABLE:
            return frame

        hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
        lower_green = np.array([35, 40, 40])
        upper_green = np.array([85, 255, 255])
        mask = cv2.inRange(hsv, lower_green, upper_green)
        
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5))
        mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
        mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
        return mask

    @staticmethod
    def detect_field_lines(frame, mask):
        if not OPENCV_AVAILABLE:
            return []

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        edges = cv2.Canny(blurred, 50, 150)
        
        field_edges = cv2.bitwise_and(edges, edges, mask=mask)
        
        lines = cv2.HoughLinesP(field_edges, 1, np.pi/180, threshold=80, minLineLength=100, maxLineGap=20)
        detected_lines = []
        if lines is not None:
            for line in lines:
                x1, y1, x2, y2 = line[0]
                detected_lines.append(((int(x1), int(y1)), (int(x2), int(y2))))
        return detected_lines


class OffsideVisualizer:
    """
    Renders 3D perspective offside lines drawn parallel to the goal line at the last defender's position.
    """
    def __init__(self, calibrator: PitchCalibrator):
        self.calibrator = calibrator

    def generate_offside_line(self, defender_pitch_x):
        p1_img = self.calibrator.project_pitch_to_image(defender_pitch_x, 0.0)
        p2_img = self.calibrator.project_pitch_to_image(defender_pitch_x, self.calibrator.pitch_width)
        return p1_img, p2_img

    def overlay_offside_line(self, frame, defender_pitch_x, color=(0, 0, 255), thickness=2):
        if not OPENCV_AVAILABLE:
            return frame

        p1, p2 = self.generate_offside_line(defender_pitch_x)
        cv2.line(frame, p1, p2, color, thickness, cv2.LINE_AA)
        
        font = cv2.FONT_HERSHEY_SIMPLEX
        cv2.putText(frame, f"Offside Line: {defender_pitch_x:.2f}m", (p1[0] + 10, p1[1] + 20), font, 0.5, color, 1, cv2.LINE_AA)
        return frame
