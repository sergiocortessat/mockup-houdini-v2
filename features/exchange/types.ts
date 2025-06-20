export interface MarketData {
  circulating_supply: number;
  market_cap_change_24h: number;
}

export interface TokenData {
  symbol: string;
  name: string;
  price: number;
  icon: string;
  chain?: string;
  change: number;
  volume: number;
  modified?: string;
  cexTokenId: string;
  cgRaw?: {
    market_data?: MarketData;
  };
}

export type MessageSegment = {
  type: 'text' | 'hashtag' | 'mention';
  content: string;
};

export type TokenPair = {
  cexTokenId: string;
  icon: string;
  symbol: string;
  name: string;
};
