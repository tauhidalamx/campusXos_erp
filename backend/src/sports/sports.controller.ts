import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { SportsService, SportsStreamData, SportsLiveCommentData } from './sports.service';

@Controller('api/sports/streams')
export class SportsController {
  constructor(private readonly sportsService: SportsService) {}

  @Post('create')
  async createStream(
    @Body() body: { matchId: string; operatorId?: string; resolution?: string; fps?: number }
  ): Promise<SportsStreamData> {
    return this.sportsService.createStream(
      body.matchId,
      body.operatorId,
      body.resolution || '1080p',
      body.fps || 60
    );
  }

  @Get('match/:matchId')
  async getStreamByMatch(@Param('matchId') matchId: string): Promise<SportsStreamData | null> {
    return this.sportsService.getStreamByMatch(matchId);
  }

  @Post(':id/keys')
  async regenerateKeys(@Param('id') id: string): Promise<SportsStreamData> {
    return this.sportsService.regenerateKeys(id);
  }

  @Post(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: 'IDLE' | 'LIVE' | 'ENDED' | 'ARCHIVED' }
  ): Promise<SportsStreamData> {
    return this.sportsService.updateStatus(id, body.status);
  }

  @Post(':id/chat')
  async addComment(
    @Param('id') id: string,
    @Body() body: { userId: string; userName: string; userRole: string; comment: string }
  ): Promise<SportsLiveCommentData> {
    return this.sportsService.addComment(
      id,
      body.userId,
      body.userName,
      body.userRole,
      body.comment
    );
  }

  @Get(':id/chat')
  async getComments(@Param('id') id: string): Promise<SportsLiveCommentData[]> {
    return this.sportsService.getComments(id);
  }

  @Post('notary')
  async anchorMatchState(
    @Body() body: { matchId: string; finalScore: string; recordingUrl: string; approver: string }
  ): Promise<any> {
    return this.sportsService.anchorMatchState(
      body.matchId,
      body.finalScore,
      body.recordingUrl,
      body.approver
    );
  }
}
