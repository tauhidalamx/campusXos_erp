import { Injectable } from '@nestjs/common';

export interface SportsStreamData {
  id: string;
  matchId: string;
  streamOperatorId?: string;
  streamKey: string;
  backupStreamKey: string;
  ingestUrl: string;
  playbackUrl?: string;
  resolution: string;
  fps: number;
  bitrate: string;
  audioChannels: string;
  noiseSuppression: boolean;
  echoCancellation: boolean;
  streamStatus: 'IDLE' | 'LIVE' | 'ENDED' | 'ARCHIVED';
  durationSec: number;
  viewerCount: number;
  recordingUrl?: string;
  archiveUrl?: string;
  metadata?: string;
  createdAt: Date;
}

export interface SportsLiveCommentData {
  id: string;
  streamId: string;
  userId: string;
  userName: string;
  userRole: string;
  comment: string;
  timestamp: Date;
}

@Injectable()
export class SportsService {
  private mockStreams: Map<string, SportsStreamData> = new Map();
  private mockComments: Map<string, SportsLiveCommentData[]> = new Map();

  async createStream(
    matchId: string,
    operatorId?: string,
    resolution: string = '1080p',
    fps: number = 60
  ): Promise<SportsStreamData> {
    const streamId = 'stream_' + Date.now().toString(36);
    const keySuffix = Math.random().toString(16).substring(2, 8);
    const streamKey = `live_${matchId}_${keySuffix}`;
    const backupStreamKey = `live_${matchId}_backup_${keySuffix}`;
    const ingestUrl = `rtmp://ingest.campusx.university/live`;
    const playbackUrl = `https://stream.campusx.university/hls/${streamKey}.m3u8`;

    const stream: SportsStreamData = {
      id: streamId,
      matchId,
      streamOperatorId: operatorId,
      streamKey,
      backupStreamKey,
      ingestUrl,
      playbackUrl,
      resolution,
      fps,
      bitrate: 'ABR',
      audioChannels: 'Stereo',
      noiseSuppression: true,
      echoCancellation: true,
      streamStatus: 'IDLE',
      durationSec: 0,
      viewerCount: 0,
      createdAt: new Date()
    };

    this.mockStreams.set(streamId, stream);
    this.mockStreams.set(matchId, stream); // index by matchId too
    return stream;
  }

  async getStreamByMatch(matchId: string): Promise<SportsStreamData | null> {
    return this.mockStreams.get(matchId) || null;
  }

  async regenerateKeys(streamId: string): Promise<SportsStreamData> {
    const stream = this.mockStreams.get(streamId);
    if (!stream) {
      throw new Error('Stream not found');
    }

    const keySuffix = Math.random().toString(16).substring(2, 8);
    stream.streamKey = `live_${stream.matchId}_${keySuffix}`;
    stream.backupStreamKey = `live_${stream.matchId}_backup_${keySuffix}`;
    stream.ingestUrl = `rtmp://ingest.campusx.university/live`;
    stream.playbackUrl = `https://stream.campusx.university/hls/${stream.streamKey}.m3u8`;

    this.mockStreams.set(streamId, stream);
    this.mockStreams.set(stream.matchId, stream);
    return stream;
  }

  async updateStatus(streamId: string, status: 'IDLE' | 'LIVE' | 'ENDED' | 'ARCHIVED'): Promise<SportsStreamData> {
    const stream = this.mockStreams.get(streamId);
    if (!stream) {
      throw new Error('Stream not found');
    }

    stream.streamStatus = status;
    if (status === 'ENDED') {
      stream.recordingUrl = `s3://campusx-sports-recordings/season-2026/${stream.matchId}.mp4`;
      stream.archiveUrl = `https://storage.campusx.university/archives/2026/${stream.matchId}.mp4`;
    }

    this.mockStreams.set(streamId, stream);
    this.mockStreams.set(stream.matchId, stream);
    return stream;
  }

  async addComment(
    streamId: string,
    userId: string,
    userName: string,
    userRole: string,
    comment: string
  ): Promise<SportsLiveCommentData> {
    const commentId = 'cmt_' + Date.now().toString(36) + Math.random().toString(16).substring(2, 5);
    const newComment: SportsLiveCommentData = {
      id: commentId,
      streamId,
      userId,
      userName,
      userRole,
      comment,
      timestamp: new Date()
    };

    const streamComments = this.mockComments.get(streamId) || [];
    streamComments.push(newComment);
    this.mockComments.set(streamId, streamComments);

    return newComment;
  }

  async getComments(streamId: string): Promise<SportsLiveCommentData[]> {
    return this.mockComments.get(streamId) || [];
  }

  async anchorMatchState(
    matchId: string,
    finalScore: string,
    recordingUrl: string,
    approver: string
  ): Promise<any> {
    const finalScoreHash = '0x' + Math.random().toString(16).substring(2, 10);
    const recordingHash = '0x' + Math.random().toString(16).substring(2, 10);
    const txHash = '0xnotary_hash_' + Math.random().toString(16).substring(2, 10);

    return {
      matchId,
      finalScore,
      finalScoreHash,
      recordingHash,
      recordingUrl,
      officialApproval: approver,
      txHash,
      timestamp: new Date()
    };
  }
}
