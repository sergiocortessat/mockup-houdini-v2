import { gql } from '@apollo/client';

export const TOKEN_FRAGMENT = gql`
  fragment TokenFields on Token {
    _id
    id
    symbol
    address
    chain
    name
    icon
    hasCex
    hasDex
    mainnet
    cexTokenId
    price
    rank
    priority
    ...ChainDataFields
  }
`;

export const SWAPS_TOKEN_FRAGMENT = gql`
  fragment SwapsTokenFields on Token {
    swapsToken {
      swap
      disabled
      token
    }
  }
`;

export const CHAIN_DATA_FRAGMENT = gql`
  fragment ChainDataFields on Token {
    chainData {
      chainId
      addressValidation
      icon
      name
      memoNeeded
      kind
      addressUrl
      explorerUrl
    }
  }
`;

export const ORDER_STATUS_FIELDS_FRAGMENT = gql`
  fragment OrderStatusFields on OrderStatusResult {
    id
    houdiniId
    created
    modified
    senderAddress
    receiverAddress
    status
    anonymous
    expires
    hashUrl
    transactionHash
    senderTag
    receiverTag
    notified
    nonRefundable
    inAmount
    inSymbol
    inCreated
    outAmount
    outSymbol
    outCreated
    eta
    inAmountUsd
    xmrAmountUsd
    multiId
    quote {
      amountIn
      amountOut
      min
      max
    }
    metadata
    isDex
    fallbackAmount
    fallbackTokenAddress
    actionRequired
    inStatus
    outStatus
    swapName
    outSwapName
    inToken {
      symbol
      icon
      address
      decimals
      mainnet
      chainData {
        name
        chainId
        kind
        addressUrl
      }
    }
    outToken {
      symbol
      icon
      chainData {
        name
        addressUrl
      }
    }
  }
`;

export const TRACK_ORDER_STATUS_FRAGMENT = gql`
  fragment TrackOrderStatusFields on TrackOrderStatus {
    id
    created
    modified
    receiverAddress
    status
    anonymous
    expires
    hashUrl
    transactionHash
    receiverTag
    notified
    inAmount
    inSymbol
    inCreated
    outAmount
    outSymbol
    outCreated
    eta
    inAmountUsd
    xmrAmountUsd
    multiId
    isDex
    fallbackAmount
    fallbackTokenAddress
  }
`;

export const QUOTE_FRAGMENT = gql`
  fragment QuoteFields on Quote {
    amountIn
    amountOut
    min
    max
    duration
    amountOutUsd
    swap
    quoteId
    outSwap
    outQuoteId
    type
    swapName
    logoUrl
    inQuoteId
  }
`;

export const ROUTE_FRAGMENT = gql`
  fragment RouteFields on Route {
    swap
    quoteId
    path
    duration
    gas
    gasUsd
    amountOut
    amountOutUsd
    feeUsd
    bridgeFeeUsd
    raw
    netAmountOut
    supportsSignatures
    error
    swapName
    type
    filtered
    supportsSignatures
    logoUrl
  }
`;
