import { ChainKind } from '@/features/swap/types';
import { parseBtcError } from '@/features/swap/utils/error-helpers/btc-error-helpers';
import { parseEvmError } from '@/features/swap/utils/error-helpers/evm-error-helpers';
import { parseSolanaError } from '@/features/swap/utils/error-helpers/solana-error-helpers';
import { parseSuiError } from '@/features/swap/utils/error-helpers/sui-error-helpers';
import { parseTonError } from '@/features/swap/utils/error-helpers/ton-error-helpers';
import { parseTronError } from '@/features/swap/utils/error-helpers/tron-error-helpers';
import { NormalizedError } from '@/features/swap/utils/error-helpers/types';
import { Token } from '@/graphql/generated';

const MAP_CHAIN_KIND_TO_ERROR_HELPER: {
  [key in ChainKind]: ((props: any) => NormalizedError | undefined) | undefined;
} = {
  [ChainKind.SOLANA]: parseSolanaError,
  [ChainKind.EVM]: parseEvmError,
  [ChainKind.BTC]: parseBtcError,
  [ChainKind.SUI]: parseSuiError,
  [ChainKind.TRON]: parseTronError,
  [ChainKind.TON]: parseTonError,
};

export const parseRpcError = ({
  chainData,
  error,
  tSwap,
}: {
  chainData: Token['chainData'] | undefined;
  error: any;
  tSwap: (key: string, options?: any) => string;
}): {
  message: string;
  rawMessage: string;
} => {
  if (!chainData) {
    return {
      message: error?.message || tSwap('errors.unknown'),
      rawMessage: error?.message,
    };
  }

  const errorHelper =
    MAP_CHAIN_KIND_TO_ERROR_HELPER[chainData.kind as ChainKind];

  if (!errorHelper) {
    return {
      message: error?.message || tSwap('errors.unknown'),
      rawMessage: error?.message,
    };
  }
  const normalizedError = errorHelper(error);
  if (!normalizedError) {
    return {
      message: error?.message || tSwap('errors.unknown'),
      rawMessage: error?.message,
    };
  }

  const isTranslationError = normalizedError.translationKey.includes('errors.');

  const isChainSwitchError =
    normalizedError?.translationKey.includes('chainSwitchError');
  if (isChainSwitchError) {
    return {
      message: tSwap(normalizedError.translationKey, {
        network: chainData?.name ?? '',
      }),
      rawMessage: error?.message,
    };
  }

  return {
    message: isTranslationError
      ? tSwap(normalizedError.translationKey)
      : normalizedError?.message ||
        (error as any)?.message ||
        tSwap('errors.unknown'),
    rawMessage: error?.message,
  };
};
