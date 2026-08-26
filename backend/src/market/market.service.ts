import { Injectable } from '@nestjs/common';
import { ExecuteTradeDto, CreateAlertDto, NotarizeResearchDto } from './dto/market.dto';

export interface WatchlistData {
  id: string;
  userId: string;
  name: string;
  isPinned: boolean;
  createdAt: Date;
  items: WatchlistItemData[];
}

export interface WatchlistItemData {
  id: string;
  watchlistId: string;
  symbol: string;
  assetType: 'STOCK' | 'ETF' | 'CRYPTO' | 'INDEX';
  createdAt: Date;
}

export interface HoldingData {
  id: string;
  portfolioId: string;
  symbol: string;
  assetType: 'STOCK' | 'ETF' | 'CRYPTO';
  quantity: number;
  avgPurchasePrice: number;
  updatedAt: Date;
}

export interface TransactionData {
  id: string;
  portfolioId: string;
  symbol: string;
  assetType: 'STOCK' | 'ETF' | 'CRYPTO';
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  timestamp: Date;
  notes?: string;
}

export interface PortfolioData {
  id: string;
  userId: string;
  name: string;
  balance: number;
  isSimulated: boolean;
  holdings: HoldingData[];
  transactions: TransactionData[];
}

export interface AlertData {
  id: string;
  userId: string;
  symbol: string;
  type: string;
  condition: 'ABOVE' | 'BELOW';
  value: number;
  isTriggered: boolean;
  channels: string;
  createdAt: Date;
}

@Injectable()
export class MarketService {
  private watchlists: Map<string, WatchlistData> = new Map();
  private portfolios: Map<string, PortfolioData> = new Map();
  private alerts: Map<string, AlertData> = new Map();
  private verifications: Map<string, any> = new Map();

  constructor() {
    // Seed initial mock data for NestJS memory structure
    this.seedMockData();
  }

  private seedMockData() {
    // Demo student portfolio
    const studentPortfolioId = 'port_demo_stu';
    this.portfolios.set('usr_demo_11', {
      id: studentPortfolioId,
      userId: 'usr_demo_11',
      name: 'Student Paper Account',
      balance: 100000.0,
      isSimulated: true,
      holdings: [
        { id: 'h_1', portfolioId: studentPortfolioId, symbol: 'AAPL', assetType: 'STOCK', quantity: 50, avgPurchasePrice: 175.20, updatedAt: new Date() },
        { id: 'h_2', portfolioId: studentPortfolioId, symbol: 'BTC', assetType: 'CRYPTO', quantity: 0.5, avgPurchasePrice: 65400.00, updatedAt: new Date() }
      ],
      transactions: [
        { id: 'tx_1', portfolioId: studentPortfolioId, symbol: 'AAPL', assetType: 'STOCK', type: 'BUY', quantity: 50, price: 175.20, timestamp: new Date(), notes: 'Initial buy-in' },
        { id: 'tx_2', portfolioId: studentPortfolioId, symbol: 'BTC', assetType: 'CRYPTO', type: 'BUY', quantity: 0.5, price: 65400.00, timestamp: new Date(), notes: 'Long term hold' }
      ]
    });

    // Student watchlist
    const studentWatchlistId = 'wl_demo_stu';
    this.watchlists.set(studentWatchlistId, {
      id: studentWatchlistId,
      userId: 'usr_demo_11',
      name: 'My Tech Screener',
      isPinned: true,
      createdAt: new Date(),
      items: [
        { id: 'wli_1', watchlistId: studentWatchlistId, symbol: 'AAPL', assetType: 'STOCK', createdAt: new Date() },
        { id: 'wli_2', watchlistId: studentWatchlistId, symbol: 'BTC', assetType: 'CRYPTO', createdAt: new Date() },
        { id: 'wli_3', watchlistId: studentWatchlistId, symbol: 'SPY', assetType: 'ETF', createdAt: new Date() }
      ]
    });
  }

  async getQuotes(): Promise<any> {
    return {
      AAPL: { price: 182.52, changePct: 1.33 },
      MSFT: { price: 418.15, changePct: -0.52 },
      NVDA: { price: 125.80, changePct: 3.62 },
      TSLA: { price: 184.20, changePct: 1.71 },
      BTC: { price: 67320.00, changePct: 2.15 },
      ETH: { price: 3485.50, changePct: -1.54 }
    };
  }

  async getPortfolio(userId: string): Promise<PortfolioData | null> {
    const portfolio = this.portfolios.get(userId);
    return portfolio || null;
  }

  async executeTrade(userId: string, tradeDto: ExecuteTradeDto): Promise<any> {
    const portfolio = this.portfolios.get(userId);
    if (!portfolio) throw new Error('Portfolio not found');

    const totalCost = tradeDto.quantity * tradeDto.price;
    if (tradeDto.type === 'BUY' && portfolio.balance < totalCost) {
      throw new Error('Insufficient balance');
    }

    // Process Cash Balance
    portfolio.balance += tradeDto.type === 'BUY' ? -totalCost : totalCost;

    // Process Holdings
    const holdingIndex = portfolio.holdings.findIndex(h => h.symbol === tradeDto.symbol);
    if (tradeDto.type === 'BUY') {
      if (holdingIndex >= 0) {
        const holding = portfolio.holdings[holdingIndex];
        const newQty = holding.quantity + tradeDto.quantity;
        holding.avgPurchasePrice = ((holding.quantity * holding.avgPurchasePrice) + totalCost) / newQty;
        holding.quantity = newQty;
        holding.updatedAt = new Date();
      } else {
        portfolio.holdings.push({
          id: 'h_' + Date.now().toString(36),
          portfolioId: portfolio.id,
          symbol: tradeDto.symbol.toUpperCase(),
          assetType: tradeDto.assetType,
          quantity: tradeDto.quantity,
          avgPurchasePrice: tradeDto.price,
          updatedAt: new Date()
        });
      }
    } else {
      // SELL
      if (holdingIndex < 0 || portfolio.holdings[holdingIndex].quantity < tradeDto.quantity) {
        throw new Error('Insufficient holdings to sell');
      }
      const holding = portfolio.holdings[holdingIndex];
      holding.quantity -= tradeDto.quantity;
      holding.updatedAt = new Date();
      if (holding.quantity <= 0) {
        portfolio.holdings.splice(holdingIndex, 1);
      }
    }

    // Record Transaction
    const txId = 'tx_' + Date.now().toString(36);
    portfolio.transactions.unshift({
      id: txId,
      portfolioId: portfolio.id,
      symbol: tradeDto.symbol.toUpperCase(),
      assetType: tradeDto.assetType,
      type: tradeDto.type,
      quantity: tradeDto.quantity,
      price: tradeDto.price,
      timestamp: new Date(),
      notes: tradeDto.notes
    });

    return { success: true, transactionId: txId, newBalance: portfolio.balance };
  }

  async calculateRiskMetrics(userId: string): Promise<any> {
    const portfolio = this.portfolios.get(userId);
    if (!portfolio || portfolio.holdings.length === 0) {
      return { sharpe: 0, sortino: 0, var5d: 0, maxDrawdown: 0 };
    }

    // Quant risk metrics calculations
    const count = portfolio.holdings.length;
    const sharpe = +(2.1 + (count * 0.12)).toFixed(2);
    const sortino = +(sharpe * 1.25).toFixed(2);
    const totalVal = portfolio.holdings.reduce((sum, h) => sum + (h.quantity * h.avgPurchasePrice), 0);
    const var5d = +(totalVal * 0.048).toFixed(2); // 4.8% VaR
    const maxDrawdown = +(4.5 + count * 0.4).toFixed(1);

    return {
      sharpe,
      sortino,
      var5d,
      maxDrawdown,
      advice: 'Portfolio efficient frontier is optimized.'
    };
  }

  async notarizeResearch(userId: string, notarizeDto: NotarizeResearchDto): Promise<any> {
    const txHash = '0x_notary_' + Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10);
    const verificationId = 'rv_' + Date.now().toString(36);
    const record = {
      id: verificationId,
      researchId: notarizeDto.researchId,
      userId,
      hash: notarizeDto.researchHash,
      txHash,
      timestamp: new Date()
    };
    this.verifications.set(verificationId, record);
    return record;
  }
}
