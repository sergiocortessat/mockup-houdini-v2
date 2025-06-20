import { MarketData, TokenData } from '@/features/exchange/types';

/**
 * Safely accesses nested market data from a token object
 * @param token The token object containing market data
 * @returns An object with default values if market data is not available
 */
export const safeMarketData = (token: TokenData): MarketData => {
  return (
    token?.cgRaw?.market_data || {
      circulating_supply: 0,
      market_cap_change_24h: 0,
    }
  );
};
