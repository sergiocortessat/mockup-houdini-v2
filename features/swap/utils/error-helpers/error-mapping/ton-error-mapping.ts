import { generalErrorMappings } from '@/features/swap/utils/error-helpers/error-mapping/general-error-mapping';
import { ErrorMapping } from '@/features/swap/utils/error-helpers/types';

export const tonErrorMappings: ErrorMapping[] = [
  ...generalErrorMappings,
  {
    key: 'InvalidAddress',
    pattern: /invalid.*address|incorrect address format/i,
    translationKey: 'errors.ton.invalidAddress',
  },
  {
    key: 'ContractExecutionError',
    pattern: /contract execution|execution failed/i,
    translationKey: 'errors.ton.contractExecutionError',
  },
  {
    key: 'MessageExpired',
    pattern: /message expired|expired message/i,
    translationKey: 'errors.ton.messageExpired',
  },
  {
    key: 'CellUnderflow',
    pattern: /cell underflow/i,
    translationKey: 'errors.ton.cellUnderflow',
  },
  {
    key: 'CellOverflow',
    pattern: /cell overflow/i,
    translationKey: 'errors.ton.cellOverflow',
  },
  {
    key: 'InvalidSeqno',
    pattern: /invalid seqno|wrong seqno/i,
    translationKey: 'errors.ton.invalidSeqno',
  },
  {
    key: 'InvalidSignature',
    pattern: /invalid signature|signature mismatch/i,
    translationKey: 'errors.ton.invalidSignature',
  },
  {
    key: 'AccountNotFound',
    pattern: /account not found|account not initialized/i,
    translationKey: 'errors.ton.accountNotFound',
  },
  {
    key: 'NetworkError',
    pattern: /network error|connection failed/i,
    translationKey: 'errors.ton.networkError',
  },
  {
    key: 'TransactionExpired',
    pattern: /transaction expired|tx expired/i,
    translationKey: 'errors.ton.transactionExpired',
  },
  {
    key: 'BouncedTransaction',
    pattern: /bounced transaction|tx bounced/i,
    translationKey: 'errors.ton.bouncedTransaction',
  },
  {
    key: 'InvalidFees',
    pattern: /insufficient fees|not enough fees/i,
    translationKey: 'errors.ton.invalidFees',
  },
  {
    key: 'WalletNotConnected',
    pattern: /wallet not connected|no wallet/i,
    translationKey: 'errors.ton.walletNotConnected',
  },
];
