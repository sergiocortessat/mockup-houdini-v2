import { gql } from '@apollo/client';

export const DEX_QUOTE_SUBSCRIPTION = gql`
  subscription dexQuoteSubscription($quoteRequestIds: [String!]) {
    dexQuoteSub(quoteRequestIds: $quoteRequestIds) {
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
      error
      swapName
      type
      filtered
      supportsSignatures
      logoUrl
    }
  }
`;

export const CEX_STANDARD_QUOTE_SUBSCRIPTION = gql`
  subscription cexStandardQuoteSub(
    $anonymous: Boolean = false
    $quoteRequestIds: [String!]
  ) {
    cexQuoteSub(anonymous: $anonymous, quoteRequestIds: $quoteRequestIds) {
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
  }
`;

export const CEX_PRIVATE_QUOTE_SUBSCRIPTION = gql`
  subscription cexPrivateQuoteSub(
    $anonymous: Boolean = true
    $quoteRequestIds: [String!]
  ) {
    cexQuoteSub(anonymous: $anonymous, quoteRequestIds: $quoteRequestIds) {
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
      logoUrl
      inQuoteId
    }
  }
`;
