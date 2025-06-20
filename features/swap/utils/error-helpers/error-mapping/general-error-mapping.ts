import { ErrorMapping } from '@/features/swap/utils/error-helpers/types';

// Common errors for all chains
export const generalErrorMappings: ErrorMapping[] = [
  // User Rejected
  {
    key: 'UserRejected',
    pattern: 'user rejected',
    translationKey: 'errors.transactionRejected',
  },
  {
    key: 'UserRejected',
    pattern: 'User rejected the request',
    translationKey: 'errors.transactionRejected',
  },
  {
    key: 'UserRejected',
    pattern: 'user rejected',
    translationKey: 'errors.transactionRejected',
  },
  {
    key: 'UserRejected',
    pattern: 'Reject request',
    translationKey: 'errors.transactionRejected',
  },
  {
    key: 'UserRejected',
    pattern: 'Confirmation declined by user',
    translationKey: 'errors.transactionRejected',
  },
  // Insufficient Funds
  {
    key: 'InsufficientFunds',
    pattern: 'Insufficient funds',
    translationKey: 'errors.insufficientFunds',
  },
  {
    key: 'InsufficientFunds',
    pattern: /insufficient.*balance|not enough tokens/i,
    translationKey: 'errors.insufficientFunds',
  },
  {
    key: 'InsufficientBalance',
    pattern: 'insufficient balance',
    translationKey: 'errors.insufficientFunds',
  },
  {
    key: 'TransactionFailed',
    pattern: 'transaction failed',
    translationKey: 'errors.transactionFailed',
  },
  {
    key: 'TransactionTimeout',
    pattern: 'transaction timeout',
    translationKey: 'errors.transactionConfirmationFailed',
  },
  {
    key: 'recipientAddressRequired',
    pattern: 'recipient address is required',
    translationKey: 'errors.recipientAddressRequired',
  },
  {
    key: 'amountMustBeGreaterThanZero',
    pattern: 'amount must be greater than 0',
    translationKey: 'errors.amountMustBeGreaterThanZero',
  },
  {
    key: 'tokenChainIdRequired',
    pattern: 'token chain id is required',
    translationKey: 'errors.tokenChainIdRequired',
  },
  {
    key: 'tokenAddressRequired',
    pattern: 'token address is required',
    translationKey: 'errors.tokenAddressRequired',
  },
  {
    key: 'tokenDecimalsRequired',
    pattern: 'token decimals is required',
    translationKey: 'errors.tokenDecimalsRequired',
  },
  {
    key: 'walletNotConnectedOrChainNotSelected',
    pattern: 'wallet not connected or chain not selected',
    translationKey: 'errors.walletNotConnectedOrChainNotSelected',
  },
  {
    key: 'feeRateUnavailable',
    pattern: 'fee rate unavailable',
    translationKey: 'errors.feeRateUnavailable',
  },
  {
    key: 'utxoFetchFailed',
    pattern: 'utxo fetch failed',
    translationKey: 'errors.utxoFetchFailed',
  },
  {
    key: 'psbtSigningFailed',
    pattern: 'psbt signing failed',
    translationKey: 'errors.psbtSigningFailed',
  },
  {
    key: 'invalidSignedPSBT',
    pattern: 'invalid signed psbt',
    translationKey: 'errors.invalidSignedPSBT',
  },
  {
    key: 'missingExchangeParams',
    pattern: 'missing exchange params',
    translationKey: 'errors.missingExchangeParams',
  },
  {
    key: 'exchangeOrderFailed',
    pattern: 'exchange order failed',
    translationKey: 'errors.exchangeOrderFailed',
  },
  {
    key: 'invalidAmount',
    pattern: 'invalid amount',
    translationKey: 'errors.invalidAmount',
  },
];
