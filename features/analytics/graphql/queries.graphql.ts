import { gql } from '@apollo/client';

export const PRICEUSD_QUERY = gql`
  query priceUsd {
    priceUsd
  }
`;

export const PERFORMANCE_STATS_QUERY = gql`
  query performanceStats {
    totalVolume: totalVolume {
      count
      totalTransactedUSD
      totalBuyback
      totalBuybackUSD
    }
    lastMonth: totalVolume(lastMonth: true) {
      count
      totalTransactedUSD
      totalBuyback
      totalBuybackUSD
    }
    lastWeek: totalVolume(lastWeek: true) {
      count
      totalTransactedUSD
      totalBuyback
      totalBuybackUSD
    }
    nextBurnAmount: config(key: "burn_amount") {
      value
    }
    nextBurnDate: config(key: "burn_date") {
      value
    }
  }
`;

export const EARNED_HISTORY_QUERY = gql`
  query earnedHistory($address: String!) {
    earnedHistory(address: $address) {
      label
      values
    }
  }
`;

export const HISTORY_QUERY = gql`
  query history($address: String!) {
    history(address: $address) {
      block
      name
      hash
      chain
      user
      value
      timestamp
    }
  }
`;
