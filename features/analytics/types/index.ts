export interface TokenInfo {
  symbol: string;
  icon: React.ReactNode;
}

export interface StatCardData {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  token?: TokenInfo;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}
