import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { MarketService } from './market.service';
import { ExecuteTradeDto, NotarizeResearchDto } from './dto/market.dto';

@Controller('api/market')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Get('quotes')
  async getQuotes() {
    return this.marketService.getQuotes();
  }

  @Get('portfolio')
  async getPortfolio(@Query('userId') userId: string) {
    return this.marketService.getPortfolio(userId);
  }

  @Post('portfolio/transaction')
  async executeTrade(@Query('userId') userId: string, @Body() tradeDto: ExecuteTradeDto) {
    return this.marketService.executeTrade(userId, tradeDto);
  }

  @Get('portfolio/risk-metrics')
  async getRiskMetrics(@Query('userId') userId: string) {
    return this.marketService.calculateRiskMetrics(userId);
  }

  @Post('research/verify')
  async notarizeResearch(@Query('userId') userId: string, @Body() notarizeDto: NotarizeResearchDto) {
    return this.marketService.notarizeResearch(userId, notarizeDto);
  }
}
