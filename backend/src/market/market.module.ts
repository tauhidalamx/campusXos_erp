import { Module } from '@nestjs/common';
import { MarketService } from './market.service';
import { MarketController } from './market.controller';
import { MarketResolver } from './market.resolver';

@Module({
  imports: [],
  controllers: [MarketController],
  providers: [MarketService, MarketResolver],
  exports: [MarketService]
})
export class MarketModule {}
