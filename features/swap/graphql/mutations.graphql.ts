import { gql } from '@apollo/client';

export const DEX_CONFIRM_TX_MUTATION = gql`
  mutation confirmTx($id: String!, $txHash: String) {
    confirmTx(id: $id, txHash: $txHash)
  }
`;

export const DEX_EXCHANGE_MUTATION = gql`
  mutation dexExchange(
    $tokenIdFrom: String!
    $tokenIdTo: String!
    $amount: Float!
    $addressFrom: String!
    $route: JSONObject!
    $addressTo: String!
    $swap: String!
    $quoteId: String!
    $walletInfo: String
    $deviceInfo: String
    $isMobile: Boolean
    $signatures: [String!]
    $destinationTag: String
  ) {
    dexExchange(
      tokenIdFrom: $tokenIdFrom
      tokenIdTo: $tokenIdTo
      amount: $amount
      addressFrom: $addressFrom
      route: $route
      addressTo: $addressTo
      swap: $swap
      quoteId: $quoteId
      walletInfo: $walletInfo
      deviceInfo: $deviceInfo
      isMobile: $isMobile
      signatures: $signatures
      destinationTag: $destinationTag
    ) {
      order {
        id
        houdiniId
        eta
        inAmountUsd
        metadata
      }
      error {
        requestId
        userMessage
        code
      }
    }
  }
`;

export const CEX_STANDARD_EXCHANGE_MUTATION = gql`
  mutation cexStandardExchange(
    $amount: Float!
    $from: String!
    $to: String!
    $addressTo: String!
    $destinationTag: String
    $inQuoteId: String
  ) {
    exchange(
      amount: $amount
      from: $from
      to: $to
      addressTo: $addressTo
      anonymous: false
      destinationTag: $destinationTag
      inQuoteId: $inQuoteId
    ) {
      order {
        houdiniId
      }
      error {
        requestId
        userMessage
        code
      }
    }
  }
`;

export const CEX_PRIVATE_EXCHANGE_MUTATION = gql`
  mutation cexPrivateExchange(
    $amount: Float!
    $from: String!
    $to: String!
    $addressTo: String!
    $destinationTag: String
    $useXmr: Boolean
    $inQuoteId: String
    $outQuoteId: String
  ) {
    exchange(
      amount: $amount
      from: $from
      to: $to
      addressTo: $addressTo
      anonymous: true
      destinationTag: $destinationTag
      useXmr: $useXmr
      inQuoteId: $inQuoteId
      outQuoteId: $outQuoteId
    ) {
      order {
        houdiniId
      }
      error {
        requestId
        userMessage
        code
      }
    }
  }
`;

export const MULTI_EXCHANGE_MUTATION = gql`
  mutation multiExchange($orders: [OrderInput!]!) {
    multiExchange(orders: $orders) {
      order {
        multiId
      }
      error {
        requestId
        userMessage
        code
      }
    }
  }
`;

export const UPDATE_WALLETINFO_MUTATION = gql`
  mutation updateOrderWalletInfo($walletInfo: String!, $id: String!) {
    updateWalletInfo(walletInfo: $walletInfo, id: $id)
  }
`;
