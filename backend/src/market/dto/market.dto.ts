export class ExecuteTradeDto {
  symbol: string;
  assetType: 'STOCK' | 'ETF' | 'CRYPTO';
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  notes?: string;
}

export class CreateAlertDto {
  symbol: string;
  type: 'PRICE' | 'PERCENT_CHANGE' | 'VOLUME' | 'EARNINGS' | 'DIVIDEND' | 'NEWS';
  condition: 'ABOVE' | 'BELOW';
  value: number;
  channels: string; // comma-separated: in-app, email, push
}

export class CreateWatchlistDto {
  name: string;
}

export class AddWatchlistSymbolDto {
  symbol: string;
  assetType: 'STOCK' | 'ETF' | 'CRYPTO' | 'INDEX';
}

export class NotarizeResearchDto {
  researchId: string;
  researchHash: string;
}
