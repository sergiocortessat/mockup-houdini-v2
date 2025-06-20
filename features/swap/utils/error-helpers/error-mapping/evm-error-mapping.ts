import { generalErrorMappings } from '@/features/swap/utils/error-helpers/error-mapping/general-error-mapping';
import { ErrorMapping } from '@/features/swap/utils/error-helpers/types';

export const evmErrorMappings: ErrorMapping[] = [
  ...generalErrorMappings,
  {
    key: 'WalletConnectionError',
    pattern: 'has not been authorized by the user.',
    translationKey: 'errors.evm.disconnectAndReconnect',
  },
  {
    key: 'GasRequiredExceedsAllowance',
    pattern: 'gas required exceeds allowance',
    translationKey: 'errors.evm.gasRequiredExceedsAllowance',
  },
  {
    key: 'NotEnoughNativeForFees',
    pattern: 'not enough native for fees',
    translationKey: 'errors.evm.notEnoughNativeForFees',
  },
  {
    key: 'FailSwapNotEnoughFee',
    pattern: 'fail swap, not enough fee',
    translationKey: 'errors.evm.failSwapNotEnoughFee',
  },
  {
    key: 'InsufficientNativeCurrencySent',
    pattern: 'insufficient native currency sent',
    translationKey: 'errors.evm.insufficientNativeCurrencySent',
  },
  {
    key: 'InsufficientFundsForGas',
    pattern: 'insufficient funds for gas',
    translationKey: 'errors.evm.insufficientFundsForGas',
  },
  {
    key: 'RPCError',
    pattern: 'Internal JSON-RPC error',
    translationKey: 'errors.evm.rpcError',
  },
  // MEMO: https://www.quicknode.com/docs/ethereum/error-references
  {
    key: 'HeaderNotFound',
    pattern: /header not found|could not find block/i,
    translationKey: 'errors.evm.headerNotFound',
  },
  {
    key: 'StackLimitReached',
    pattern: /stack limit reached/i,
    translationKey: 'errors.evm.stackLimitReached',
  },
  {
    key: 'MethodHandlerCrashed',
    pattern: /method handler crashed/i,
    translationKey: 'errors.evm.methodHandlerCrashed',
  },
  {
    key: 'ExecutionTimeout',
    pattern: /execution timeout/i,
    translationKey: 'errors.evm.executionTimeout',
  },
  {
    key: 'NonceTooLow',
    pattern: /nonce too low/i,
    translationKey: 'errors.evm.nonceTooLow',
  },
  {
    key: 'FilterNotFound',
    pattern: /filter not found/i,
    translationKey: 'errors.evm.filterNotFound',
  },
  {
    key: 'ResourceNotFound',
    pattern: /-32001|Resource Not Found/i,
    translationKey: 'errors.evm.resourceNotFound',
  },
  {
    key: 'ResourceUnavailable',
    pattern: /-32002|Resource Unavailable/i,
    translationKey: 'errors.evm.resourceUnavailable',
  },
  {
    key: 'TransactionRejected',
    pattern: /-32003|Transaction Rejected/i,
    translationKey: 'errors.evm.transactionRejected',
  },
  {
    key: 'MethodNotSupported',
    pattern: /-32004|Method Not Supported/i,
    translationKey: 'errors.evm.methodNotSupported',
  },
  {
    key: 'LimitExceeded',
    pattern: /-32005|Limit Exceeded/i,
    translationKey: 'errors.evm.limitExceeded',
  },
  {
    key: 'JsonRpcVersionNotSupported',
    pattern: /-32006|JSON-RPC Version Not Supported/i,
    translationKey: 'errors.evm.jsonRpcVersionNotSupported',
  },
  {
    key: 'TraceRequestsLimited',
    pattern: /-32009|trace requests limited/i,
    translationKey: 'errors.evm.traceRequestsLimited',
  },
  {
    key: 'TransactionCostExceedsLimit',
    pattern: /-32010|Transaction cost exceeds current gas limit/i,
    translationKey: 'errors.evm.transactionCostExceedsLimit',
  },
  {
    key: 'NetworkError',
    pattern: /-32011|network error/i,
    translationKey: 'errors.evm.networkError',
  },
  {
    key: 'VMExecutionError',
    pattern: /-32015|VM execution error/i,
    translationKey: 'errors.evm.vmExecutionError',
  },
  {
    key: 'InvalidRequest',
    pattern: /-32600|Invalid request/i,
    translationKey: 'errors.evm.invalidRequest',
  },
  {
    key: 'MethodNotFound',
    pattern: /-32601|method not found/i,
    translationKey: 'errors.evm.methodNotFound',
  },
  {
    key: 'FailedToParseRequest',
    pattern: /failed to parse request/i,
    translationKey: 'errors.evm.failedToParseRequest',
  },
  {
    key: 'InvalidHexPrefix',
    pattern: /cannot unmarshal hex string without 0x prefix/i,
    translationKey: 'errors.evm.invalidHexPrefix',
  },
  {
    key: 'LogRangeLimited',
    pattern: /eth_getLogs.*limited to a 10,000 blocks range/i,
    translationKey: 'errors.evm.logRangeLimited',
  },
  {
    key: 'InternalJsonRpcError',
    pattern: /-32603|Internal JSON-RPC error/i,
    translationKey: 'errors.evm.internalJsonRpcError',
  },
  {
    key: 'CustomTracesBlocked',
    pattern: /-32612|custom traces are blocked/i,
    translationKey: 'errors.evm.customTracesBlocked',
  },
  {
    key: 'CustomTraceNotAllowed',
    pattern: /-32613|custom trace not found in allowed custom traces/i,
    translationKey: 'errors.evm.customTraceNotAllowed',
  },
  {
    key: 'ParseError',
    pattern: /-32700|Parse error/i,
    translationKey: 'errors.evm.parseError',
  },
  {
    key: 'ExecutionReverted',
    pattern: /execution reverted/i,
    translationKey: 'errors.evm.executionReverted',
  },
  {
    key: 'ChainSwitchError',
    pattern: /attempting to switch chain/i,
    translationKey: 'errors.evm.chainSwitchError',
  },
];
