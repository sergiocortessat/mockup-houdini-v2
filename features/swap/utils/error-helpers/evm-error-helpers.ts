import { ChainKind } from '@/features/swap/types';
import { getErrorMapping } from '@/features/swap/utils/error-helpers/error-mapping/get-error-mapping';
import { NormalizedError } from '@/features/swap/utils/error-helpers/types';

// Partially based on https://kentcdodds.com/blog/get-a-catch-block-error-message-with-typescript
// Also reviewed https://github.com/MetaMask/eth-rpc-errors, PancakeSwap code and Uniswap code
// e.g. https://github.com/Uniswap/interface/blob/main/src/utils/swapErrorToUserReadableMessage.tsx
interface ErrorWithCodeAndMessage {
  message: string;
  name: string | undefined;
  code: number | string | undefined;
}

interface ErrorEthereumRPC {
  message: string;
  code: number;
  data: {
    code?: number;
    message?: string;
    details?: string;
  };
}

function isErrorWithCodeAndMessage(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string' &&
    'code' in error
  );
}
function getOriginalRPCMessage(error: unknown): string | undefined {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    'data' in error
  ) {
    const errorRPC = error as ErrorEthereumRPC;
    return errorRPC?.data?.message || errorRPC?.data?.details;
  } else {
    return undefined;
  }
}
function toErrorWithCodeAndMessage(
  maybeError: unknown
): ErrorWithCodeAndMessage {
  if (isErrorWithCodeAndMessage(maybeError)) {
    // If it's an error coded by Metamask, we get the metamask message directly
    const errorTyped = maybeError as ErrorWithCodeAndMessage;
    const message = getOriginalRPCMessage(maybeError);

    if (message === undefined) {
      // Not a deeper message
      return {
        code: errorTyped.code,
        message: errorTyped.message,
        name: errorTyped.name,
      }; // So Put an outer message
    } else {
      return {
        code: errorTyped.code,
        name: errorTyped.name,
        message,
      }; // Put a deeper message (data.message)
    }
  } else {
    // Transform the error into a known structure with code and message
    let message;
    if (maybeError instanceof Error) {
      message = maybeError.message;
    } else {
      message = String(maybeError);
    }
    return {
      code: undefined,
      name: undefined,
      message,
    }; // Code undefined because it doesn't have a code
  }
}

export const parseEvmError = (error: unknown): NormalizedError | undefined => {
  const errorWithCodeAndMessage = toErrorWithCodeAndMessage(error); // Convert the exception to an error with code and message

  const errorMapping = getErrorMapping(
    errorWithCodeAndMessage.message,
    ChainKind.EVM
  );
  return {
    chain: ChainKind.EVM,
    message: errorWithCodeAndMessage.message,
    translationKey: errorMapping?.translationKey || 'errors.unknown',
  };
};
