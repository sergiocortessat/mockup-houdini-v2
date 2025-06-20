import { generalErrorMappings } from '@/features/swap/utils/error-helpers/error-mapping/general-error-mapping';
import { ErrorMapping } from '@/features/swap/utils/error-helpers/types';

export const suiErrorMappings: ErrorMapping[] = [
  ...generalErrorMappings,
  {
    key: 'InsufficientBalance',
    pattern: /insufficient.*balance|not enough coins/i,
    translationKey: 'errors.sui.insufficientBalance',
  },
  {
    key: 'InvalidAddress',
    pattern: /invalid.*address|malformed address/i,
    translationKey: 'errors.sui.invalidAddress',
  },
  {
    key: 'ExecutionError',
    pattern: /execution.*failed|transaction execution failed/i,
    translationKey: 'errors.sui.executionError',
  },
  {
    key: 'NetworkError',
    pattern: /network.*error|connection failed|network unavailable/i,
    translationKey: 'errors.sui.networkError',
  },
  {
    key: 'InvalidSignature',
    pattern: /invalid.*signature|signature verification failed/i,
    translationKey: 'errors.sui.invalidSignature',
  },
  {
    key: 'ObjectNotFound',
    pattern: /object not found|cannot find object/i,
    translationKey: 'errors.sui.objectNotFound',
  },
  {
    key: 'PackageNotFound',
    pattern: /package not found|cannot find package/i,
    translationKey: 'errors.sui.packageNotFound',
  },
  {
    key: 'ModuleNotFound',
    pattern: /module not found|cannot find module/i,
    translationKey: 'errors.sui.moduleNotFound',
  },
  {
    key: 'FunctionNotFound',
    pattern: /function not found|entry function.*not found/i,
    translationKey: 'errors.sui.functionNotFound',
  },
  {
    key: 'GasComputationError',
    pattern: /gas computation.*error|error computing gas/i,
    translationKey: 'errors.sui.gasComputationError',
  },
  {
    key: 'InsufficientGas',
    pattern: /insufficient gas|not enough gas/i,
    translationKey: 'errors.sui.insufficientGas',
  },
  {
    key: 'InvalidTransactionData',
    pattern: /invalid.*transaction.*data|malformed transaction/i,
    translationKey: 'errors.sui.invalidTransactionData',
  },
  {
    key: 'ConsensusError',
    pattern: /consensus.*error|consensus validation failed/i,
    translationKey: 'errors.sui.consensusError',
  },
  {
    key: 'WalletNotConnected',
    pattern: /wallet not connected|no wallet/i,
    translationKey: 'errors.sui.walletNotConnected',
  },
  {
    key: 'InvalidObjectOwner',
    pattern: /invalid.*object.*owner|incorrect object owner/i,
    translationKey: 'errors.sui.invalidObjectOwner',
  },
  {
    key: 'ObjectVersionNotFound',
    pattern: /object version not found|version mismatch/i,
    translationKey: 'errors.sui.objectVersionNotFound',
  },
  {
    key: 'InvalidObjectType',
    pattern: /invalid.*object.*type|incorrect object type/i,
    translationKey: 'errors.sui.invalidObjectType',
  },
  {
    key: 'InvalidObjectId',
    pattern: /invalid.*object.*id|malformed object id/i,
    translationKey: 'errors.sui.invalidObjectId',
  },
];
