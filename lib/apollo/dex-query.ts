import { gql } from '@apollo/client';

export const TOKEN_DATA_QUERY = gql`
  query tokenData($id: String!) {
    token(id: $id) {
      symbol
      chain
      name
      icon
      chain
      cexTokenId
      price
      cgRaw
      marketCap
      volume
      change
      modified
    }
  }
`;

export const TOKEN_PAIR_QUERY = gql`
  query pairs($page: Float, $limit: Float, $filters: PairFilters) {
    pairs(page: $page, limit: $limit, filters: $filters) {
      pairs {
        symbol
        chain
        name
        icon
        chain
        cexTokenId
        price
        cgRaw
        marketCap
        volume
        change
      }
    }
  }
`;
