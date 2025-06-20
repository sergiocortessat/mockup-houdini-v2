import { gql } from '@apollo/client';

import {
  CHAIN_DATA_FRAGMENT,
  SWAPS_TOKEN_FRAGMENT,
  TOKEN_FRAGMENT,
} from '@/graphql/fragments.graphql';

export const GET_TOKEN_BY_ID = gql`
  query getTokenById($id: String!) {
    token(id: $id) {
      ...TokenFields
    }
  }
  ${TOKEN_FRAGMENT}
  ${SWAPS_TOKEN_FRAGMENT}
  ${CHAIN_DATA_FRAGMENT}
`;

export const GET_SWAP_TOKENS_BY_IDS = gql`
  query GetSwapTokensByIds($tokenInId: String!, $tokenOutId: String!) {
    tokenIn: token(id: $tokenInId) {
      ...TokenFields
    }
    tokenOut: token(id: $tokenOutId) {
      ...TokenFields
    }
  }
  ${TOKEN_FRAGMENT}
  ${SWAPS_TOKEN_FRAGMENT}
  ${CHAIN_DATA_FRAGMENT}
`;

export const DEX_APPROVE_QUERY = gql`
  query approve(
    $tokenIdFrom: String!
    $tokenIdTo: String!
    $addressFrom: String!
    $route: JSONObject!
    $swap: String!
    $amount: Float!
  ) {
    approve(
      amount: $amount
      tokenIdFrom: $tokenIdFrom
      tokenIdTo: $tokenIdTo
      addressFrom: $addressFrom
      route: $route
      swap: $swap
    ) {
      approvals {
        data
        to
        from
        fromChain {
          chainId
        }
      }
      signatures {
        data {
          domain {
            name
            version
            chainId
            verifyingContract
            salt
          }
          types
          primaryType
          message
        }
        type
        totalSteps
        step
        isComplete
        key
      }
    }
  }
`;

export const DEX_CHAIN_SIGNATURES_QUERY = gql`
  query chainSignatures(
    $tokenIdFrom: String!
    $tokenIdTo: String!
    $addressFrom: String!
    $route: JSONObject!
    $swap: String!
    $previousSignature: String!
    $signatureKey: String!
    $signatureStep: Float!
  ) {
    chainSignatures(
      tokenIdFrom: $tokenIdFrom
      tokenIdTo: $tokenIdTo
      addressFrom: $addressFrom
      route: $route
      swap: $swap
      previousSignature: $previousSignature
      signatureKey: $signatureKey
      signatureStep: $signatureStep
    ) {
      data {
        domain {
          name
          version
          chainId
          verifyingContract
          salt
        }
        types
        primaryType
        message
      }
      type
      totalSteps
      step
      isComplete
      key
    }
  }
`;

export const GET_TOKEN_BY_SEARCH_TERM = gql`
  query getTokenBySearchTerm($search: String!, $hasCex: Boolean) {
    tokenSearch(term: $search, limit: 50, hasCex: $hasCex) {
      ...TokenFields
    }
  }
  ${TOKEN_FRAGMENT}
  ${SWAPS_TOKEN_FRAGMENT}
  ${CHAIN_DATA_FRAGMENT}
`;

export const GET_POPULAR_TOKENS = gql`
  query getPopularTokens(
    $chain: String = ""
    $days: Float = 7
    $limit: Float = 20
  ) {
    getPopularTokens(chain: $chain, days: $days, limit: $limit) {
      id
      symbol
      address
      chain
      name
      icon
      cexTokenId
      rank
      priority
    }
  }
  ${TOKEN_FRAGMENT}
  ${SWAPS_TOKEN_FRAGMENT}
  ${CHAIN_DATA_FRAGMENT}
`;

export const GET_ALL_QUOTE = gql`
  query getAllQuote(
    $amount: Float!
    $tokenIdFrom: String!
    $tokenIdTo: String!
    $cexTokenIdFrom: String!
    $cexTokenIdTo: String!
    $clientId: String!
    $slippage: Float
    $toAddress: String
    $fromAddress: String
    $useXmr: Boolean
    $quoteRequestId: String
  ) {
    dexQuote(
      quoteRequestId: $quoteRequestId
      tokenIdFrom: $tokenIdFrom
      tokenIdTo: $tokenIdTo
      amount: $amount
      clientId: $clientId
      slippage: $slippage
      toAddress: $toAddress
      fromAddress: $fromAddress
    ) {
      error {
        userMessage
      }
      routes {
        ...RouteFields
      }
    }
    dexMinMax: minMax(
      from: $tokenIdFrom
      to: $tokenIdTo
      anonymous: false
      cexOnly: false
    )
    standardCexQuote: quote(
      quoteRequestId: $quoteRequestId
      to: $cexTokenIdTo
      from: $cexTokenIdFrom
      amount: $amount
      anonymous: false
      clientId: $clientId
    ) {
      quote {
        ...QuoteFields
      }
      error {
        message
        type
        requestId
        userMessage
        code
      }
    }
    standardCexMinMax: minMax(
      from: $cexTokenIdFrom
      to: $cexTokenIdTo
      anonymous: false
      cexOnly: true
    )
    privateCexQuote: quote(
      quoteRequestId: $quoteRequestId
      to: $cexTokenIdTo
      from: $cexTokenIdFrom
      amount: $amount
      anonymous: true
      useXmr: $useXmr
      clientId: $clientId
    ) {
      quote {
        ...QuoteFields
      }
      error {
        message
        type
        requestId
        userMessage
      }
    }
    privateCexMinMax: minMax(
      from: $cexTokenIdFrom
      to: $cexTokenIdTo
      anonymous: true
      cexOnly: true
    )
  }
`;

export const CHECK_DESTINATION_ADDRESS = gql`
  query checkDestinationAddress(
    $isDex: Boolean!
    $chainId: Float!
    $kind: String!
    $address: String!
  ) {
    checkDestinationAddress(
      isDex: $isDex
      chainId: $chainId
      kind: $kind
      address: $address
    )
  }
`;

export const GET_SWAPS = gql`
  query getSwaps {
    swaps {
      dexes {
        name
        isDex
        logoUrl
        enabled
      }
      cexes {
        name
        isDex
        logoUrl
        enabled
      }
    }
  }
`;
