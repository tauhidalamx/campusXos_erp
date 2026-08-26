import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { MarketService } from './market.service';
import { ExecuteTradeDto, NotarizeResearchDto } from './dto/market.dto';

@Resolver('Market')
export class MarketResolver {
  constructor(private readonly marketService: MarketService) {}

  @Query('marketQuotes')
  async getQuotes() {
    return this.marketService.getQuotes();
  }

  @Query('userPortfolio')
  async getPortfolio(@Args('userId') userId: string) {
    return this.marketService.getPortfolio(userId);
  }

  @Query('portfolioRiskMetrics')
  async getRiskMetrics(@Args('userId') userId: string) {
    return this.marketService.calculateRiskMetrics(userId);
  }

  @Mutation('executeTrade')
  async executeTrade(
    @Args('userId') userId: string,
    @Args('tradeInput') tradeDto: ExecuteTradeDto
  ) {
    return this.marketService.executeTrade(userId, tradeDto);
  }

  @Mutation('notarizeResearch')
  async notarizeResearch(
    @Args('userId') userId: string,
    @Args('notarizeInput') notarizeDto: NotarizeResearchDto
  ) {
    return this.marketService.notarizeResearch(userId, notarizeDto);
  }
}
