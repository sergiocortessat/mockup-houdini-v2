import { gql } from '@apollo/client';

export const GET_CONFIG = gql`
  query getConfig($key: String!) {
    config(key: $key) {
      key
      value
      created
      modified
      id
    }
  }
`;

export const PARTNER_URL_QUERY = gql`
  query partnerUrlByNickname($nickname: String!) {
    partnerUrlByNickname(nickname: $nickname)
  }
`;
