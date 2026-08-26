# -*- coding: utf-8 -*-
"""
CampusX Sports OS - Modular Video Stream Ingestion Layer
Supports HLS (.m3u8), RTSP, RTMP, and local MP4 file sources with double-buffering.
"""

import time
import threading

try:
    import cv2
    OPENCV_AVAILABLE = True
except ImportError:
    OPENCV_AVAILABLE = False


class BaseStreamIngest:
    """
    Abstract interface for streaming sources.
    """
    def __init__(self, source_path):
        self.source_path = source_path
        self.running = False
        self.frame_buffer = None
        self.lock = threading.Lock()

    def start(self):
        raise NotImplementedError

    def stop(self):
        self.running = False

    def read_frame(self):
        with self.lock:
            return self.frame_buffer


class VideoFileIngest(BaseStreamIngest):
    """
    Reads frames from local MP4 or recorded match files.
    """
    def __init__(self, source_path):
        super().__init__(source_path)
        self.cap = None
        self.thread = None

    def start(self):
        if not OPENCV_AVAILABLE:
            print("[Ingest] OpenCV not available. Local file ingest running in simulation mode.")
            return
        
        self.cap = cv2.VideoCapture(self.source_path)
        self.running = True
        self.thread = threading.Thread(target=self._capture_loop, daemon=True)
        self.thread.start()

    def _capture_loop(self):
        while self.running:
            ret, frame = self.cap.read()
            if not ret:
                # Loop video if it ends
                self.cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                continue
            
            with self.lock:
                self.frame_buffer = frame
            
            # Throttle file reading to preserve real-time frame rates (e.g. 30 FPS)
            time.sleep(0.033)

        if self.cap:
            self.cap.release()


class LiveStreamIngest(BaseStreamIngest):
    """
    Handles live feeds (RTSP, RTMP, HLS) using a double-buffered background thread.
    Drops stale frames if the CV pipeline processing is slower than incoming stream frame rates.
    """
    def __init__(self, source_path):
        super().__init__(source_path)
        self.cap = None
        self.thread = None

    def start(self):
        if not OPENCV_AVAILABLE:
            print(f"[Ingest] OpenCV not available. Live stream {self.source_path} running in simulation mode.")
            return

        self.cap = cv2.VideoCapture(self.source_path)
        self.running = True
        self.thread = threading.Thread(target=self._capture_loop, daemon=True)
        self.thread.start()

    def _capture_loop(self):
        while self.running:
            ret, frame = self.cap.read()
            if not ret:
                # Acknowledge connection drops and try reconnecting
                print("[Ingest] Live stream frame drop or timeout. Attempting reconnect...")
                time.sleep(2.0)
                self.cap.release()
                self.cap = cv2.VideoCapture(self.source_path)
                continue

            with self.lock:
                # Double-buffer: overwrite with the newest frame immediately
                self.frame_buffer = frame

            # Keep lock times short: no sleep needed here to empty the camera driver's hardware buffer
            # This is critical to prevent video frame lag on live RTSP camera feeds

        if self.cap:
            self.cap.release()


class StreamIngestFactory:
    """
    Factory pattern provider for selecting stream adapters.
    """
    @staticmethod
    def create_ingest(source_type, source_path):
        if source_type in ['local_mp4', 'file']:
            return VideoFileIngest(source_path)
        else:
            return LiveStreamIngest(source_path)
