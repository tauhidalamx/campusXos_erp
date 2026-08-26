# -*- coding: utf-8 -*-
import sys
import os
import unittest
import urllib.request
import urllib.error
import json

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

class TestBroadcastingSystem(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        import random
        cls.match_id = f"test_match_{random.randint(100000, 999999)}"

    def setUp(self):
        self.gateway_url = "http://localhost:5000"

    def test_01_create_match(self):
        # 1. Register a match event
        url = f"{self.gateway_url}/api/sports/matches"
        payload = {
            "id": self.match_id,
            "tournament_id": "test_tour_99",
            "sport": "Football",
            "team_a": "CampusX United",
            "team_b": "Consortium Athletic",
            "schedule": "2026-06-25T19:30:00Z",
            "venue": "CampusX Arena"
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
                self.assertEqual(res.get("id"), self.match_id)
        except urllib.error.HTTPError as e:
            err_body = e.read().decode('utf-8')
            self.fail(f"Failed to create match: {e} - Response body: {err_body}")
        except Exception as e:
            self.fail(f"Failed to create match: {e}")

    def test_02_create_stream_and_rotate_keys(self):
        # 2. Configure a live stream for this match
        url_create = f"{self.gateway_url}/api/sports/streams/create"
        payload_create = {
            "matchId": self.match_id,
            "resolution": "1080p",
            "fps": 60
        }
        req_create = urllib.request.Request(
            url_create,
            data=json.dumps(payload_create).encode('utf-8'),
            headers={'Content-Type': 'application/json'}
        )
        
        try:
            with urllib.request.urlopen(req_create) as r:
                res_create = json.loads(r.read().decode('utf-8'))
                self.assertTrue(res_create.get("success"))
                stream = res_create.get("stream")
                self.assertIsNotNone(stream)
                stream_id = stream.get("id")
                initial_key = stream.get("streamKey")
                self.assertIsNotNone(stream_id)
                self.assertIsNotNone(initial_key)

                # Rotate stream keys
                url_rotate = f"{self.gateway_url}/api/sports/streams/{stream_id}/keys"
                req_rotate = urllib.request.Request(url_rotate, data=b"{}", headers={'Content-Type': 'application/json'})
                with urllib.request.urlopen(req_rotate) as r_rot:
                    res_rot = json.loads(r_rot.read().decode('utf-8'))
                    self.assertTrue(res_rot.get("success"))
                    new_key = res_rot.get("stream_key")
                    self.assertNotEqual(initial_key, new_key)

        except urllib.error.HTTPError as e:
            err_body = e.read().decode('utf-8')
            self.fail(f"Failed in stream key rotations: {e} - Response body: {err_body}")
        except Exception as e:
            self.fail(f"Failed in stream key rotations: {e}")

    def test_03_blockchain_notary(self):
        # 3. Verify match notary anchoring
        url = f"{self.gateway_url}/api/sports/streams/notary"
        payload = {
            "matchId": self.match_id,
            "finalScore": "3 - 2",
            "recordingUrl": f"s3://campusx-sports-recordings/season-2026/{self.match_id}.mp4",
            "approver": "Director John"
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
                self.assertIsNotNone(res.get("txHash"))
                self.assertTrue(res.get("txHash").startswith("0xnotary_proof_"))
        except urllib.error.HTTPError as e:
            err_body = e.read().decode('utf-8')
            self.fail(f"Failed to certify match state: {e} - Response body: {err_body}")
        except Exception as e:
            self.fail(f"Failed to certify match state: {e}")

    def test_04_upload_and_set_video(self):
        # 1. Create a dummy text/mp4 file payload to test upload API
        boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW'
        body = (
            f"--{boundary}\r\n"
            f'Content-Disposition: form-data; name="video"; filename="test_match.mp4"\r\n'
            f"Content-Type: video/mp4\r\n\r\n"
            f"dummy-video-data-content"
            f"\r\n--{boundary}--\r\n"
        )
        url_upload = f"{self.gateway_url}/api/sports/streams/upload"
        req_upload = urllib.request.Request(
            url_upload,
            data=body.encode('utf-8'),
            headers={
                'Content-Type': f'multipart/form-data; boundary={boundary}'
            }
        )
        
        try:
            with urllib.request.urlopen(req_upload) as r:
                res_upload = json.loads(r.read().decode('utf-8'))
                self.assertTrue(res_upload.get("success"))
                video_url = res_upload.get("videoUrl")
                self.assertIsNotNone(video_url)
                self.assertTrue(video_url.startswith("/uploads/"))

                # 2. Get the stream ID for the match
                url_get = f"{self.gateway_url}/api/sports/streams/match/{self.match_id}"
                with urllib.request.urlopen(url_get) as r_get:
                    res_get = json.loads(r_get.read().decode('utf-8'))
                    self.assertTrue(res_get.get("success"))
                    stream_id = res_get.get("stream").get("id")

                # 3. Associate the uploaded video with the stream metadata
                url_video = f"{self.gateway_url}/api/sports/streams/{stream_id}/video"
                payload_video = {"videoUrl": video_url}
                req_video = urllib.request.Request(
                    url_video,
                    data=json.dumps(payload_video).encode('utf-8'),
                    headers={'Content-Type': 'application/json'}
                )
                with urllib.request.urlopen(req_video) as r_video:
                    res_video = json.loads(r_video.read().decode('utf-8'))
                    self.assertTrue(res_video.get("success"))
                    self.assertEqual(res_video.get("metadata").get("uploaded_video_url"), video_url)

                # 4. Re-fetch match stream to check parsed metadata
                with urllib.request.urlopen(url_get) as r_get_again:
                    res_get_again = json.loads(r_get_again.read().decode('utf-8'))
                    self.assertTrue(res_get_again.get("success"))
                    fetched_metadata = res_get_again.get("stream").get("metadata")
                    self.assertEqual(fetched_metadata.get("uploaded_video_url"), video_url)

        except urllib.error.HTTPError as e:
            err_body = e.read().decode('utf-8')
            self.fail(f"Failed to upload or configure match video: {e} - Response body: {err_body}")
        except Exception as e:
            self.fail(f"Failed to upload or configure match video: {e}")

    def test_05_active_live_streams(self):
        # 1. Update stream status of the test match to LIVE
        url_get = f"{self.gateway_url}/api/sports/streams/match/{self.match_id}"
        try:
            with urllib.request.urlopen(url_get) as r_get:
                res_get = json.loads(r_get.read().decode('utf-8'))
                self.assertTrue(res_get.get("success"))
                stream_id = res_get.get("stream").get("id")

            url_status = f"{self.gateway_url}/api/sports/streams/{stream_id}/status"
            payload_status = {"status": "LIVE"}
            req_status = urllib.request.Request(
                url_status,
                data=json.dumps(payload_status).encode('utf-8'),
                headers={'Content-Type': 'application/json'}
            )
            with urllib.request.urlopen(req_status) as r_status:
                res_status = json.loads(r_status.read().decode('utf-8'))
                self.assertTrue(res_status.get("success"))
                self.assertEqual(res_status.get("status"), "LIVE")

            # 2. Check the active live streams endpoint
            url_active = f"{self.gateway_url}/api/sports/streams/live-active"
            with urllib.request.urlopen(url_active) as r_active:
                res_active = json.loads(r_active.read().decode('utf-8'))
                self.assertTrue(res_active.get("success"))
                streams = res_active.get("streams")
                self.assertIsNotNone(streams)
                self.assertTrue(len(streams) > 0)
                
                # Check that our stream is in the active list
                test_stream = next((s for s in streams if s.get("id") == stream_id), None)
                self.assertIsNotNone(test_stream)
                self.assertEqual(test_stream.get("stream_status"), "LIVE")

        except urllib.error.HTTPError as e:
            err_body = e.read().decode('utf-8')
            self.fail(f"Failed to verify active live streams: {e} - Response body: {err_body}")
        except Exception as e:
            self.fail(f"Failed to verify active live streams: {e}")

if __name__ == "__main__":
    unittest.main()
