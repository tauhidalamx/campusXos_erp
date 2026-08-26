# -*- coding: utf-8 -*-
"""
CampusX Sports OS - Live Match Event Synchronization & Notary Alignment
Compares computer vision detections with official API event registries.
"""

class MatchEventSynchronizer:
    """
    Validates and reconciles CV-detected events against official stats databases.
    Flags mismatches and gaps in stats records.
    """
    def __init__(self, time_tolerance_sec=15.0):
        self.time_tolerance_sec = time_tolerance_sec

    def parse_time_to_seconds(self, time_str):
        """
        Converts match time string "MM:SS" or "MM" to integer seconds.
        """
        if not time_str:
            return 0
        try:
            parts = time_str.split(':')
            if len(parts) == 2:
                return int(parts[0]) * 60 + int(parts[1])
            return int(parts[0]) * 60
        except ValueError:
            return 0

    def align_events(self, cv_events, official_api_events):
        """
        Reconciles list of CV detections with official stats API.
        Returns: List of event entries with alignment status flags.
        """
        aligned_roster = []

        for cv_ev in cv_events:
            cv_time_sec = self.parse_time_to_seconds(cv_ev.get('match_time'))
            cv_type = cv_ev.get('event')
            cv_player = cv_ev.get('player', '').lower()

            # Find matching events in API within time tolerance window
            best_match = None
            closest_diff = float('inf')

            for api_ev in official_api_events:
                api_time_sec = self.parse_time_to_seconds(api_ev.get('time'))
                api_type = api_ev.get('type')
                
                # Check compatibility of event types
                type_match = (
                    (cv_type == 'GOAL' and api_type == 'Goal') or
                    (cv_type == 'FOUL' and api_type == 'Foul') or
                    (cv_type == 'RED_CARD' and api_type == 'Red Card') or
                    (cv_type == 'SAVE' and api_type == 'Save') or
                    (cv_type == 'YELLOW_CARD' and api_type == 'Yellow Card')
                )

                if type_match:
                    diff = abs(cv_time_sec - api_time_sec)
                    if diff <= self.time_tolerance_sec and diff < closest_diff:
                        best_match = api_ev
                        closest_diff = diff

            if best_match:
                # Reconciled! Check if details like player names mismatch
                api_player = best_match.get('player', '').lower()
                mismatched_details = False
                reason = "Matched successfully"

                if cv_player != "unknown player" and api_player and cv_player not in api_player and api_player not in cv_player:
                    mismatched_details = True
                    reason = f"Player mismatch (CV: {cv_ev.get('player')}, API: {best_match.get('player')})"

                aligned_roster.append({
                    'cv_event': cv_ev,
                    'api_event': best_match,
                    'status': 'ALIGNED_WITH_DISCREPANCY' if mismatched_details else 'ALIGNED',
                    'reason': reason,
                    'time_difference_sec': closest_diff
                })
            else:
                # No match found in official API database: CV detected ghost event
                aligned_roster.append({
                    'cv_event': cv_ev,
                    'api_event': None,
                    'status': 'MISMATCHED_CV_ONLY',
                    'reason': "Official statistics API has no record of this event inside time window",
                    'time_difference_sec': None
                })

        # Also find official events that CV failed to detect (missed events)
        for api_ev in official_api_events:
            api_time_sec = self.parse_time_to_seconds(api_ev.get('time'))
            api_type = api_ev.get('type')
            
            # Check if this API event was aligned to any CV event
            is_aligned = False
            for aligned in aligned_roster:
                if aligned['api_event'] and aligned['api_event'].get('id') == api_ev.get('id'):
                    is_aligned = True
                    break

            if not is_aligned:
                aligned_roster.append({
                    'cv_event': None,
                    'api_event': api_ev,
                    'status': 'MISMATCHED_API_ONLY',
                    'reason': "AI Computer Vision pipeline failed to detect this official event",
                    'time_difference_sec': None
                })

        return aligned_roster
