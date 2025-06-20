'use client';

import {
  parseAsBoolean,
  parseAsFloat,
  parseAsString,
  useQueryStates,
} from 'nuqs';

import { DEFAULT_SWAP_PARAMS } from '@/features/swap/constants';

/**
 * Custom hook for managing swap parameters via URL query states.
 */
export function useSwapUrlParams() {
  const [swapParams, setSwapParams] = useQueryStates({
    tokenIn: parseAsString.withDefault(DEFAULT_SWAP_PARAMS.tokenIn),
    amount: parseAsFloat.withDefault(DEFAULT_SWAP_PARAMS.amount),
    tokenOut: parseAsString.withDefault(DEFAULT_SWAP_PARAMS.tokenOut),
    address: parseAsString.withDefault(DEFAULT_SWAP_PARAMS.address),
    isPrivate: parseAsBoolean.withDefault(DEFAULT_SWAP_PARAMS.isPrivate),
    useXmr: parseAsBoolean.withDefault(DEFAULT_SWAP_PARAMS.useXmr),
    isMultiSwap: parseAsBoolean.withDefault(DEFAULT_SWAP_PARAMS.isMultiSwap),
    amountOut: parseAsFloat.withDefault(DEFAULT_SWAP_PARAMS.amountOut),
    memo: parseAsString.withDefault(DEFAULT_SWAP_PARAMS.memo),
  });

  const {
    tokenIn,
    amount,
    tokenOut,
    address,
    isPrivate,
    useXmr,
    isMultiSwap,
    amountOut,
    memo,
  } = swapParams;

  return {
    tokenIn,
    amount,
    tokenOut,
    address,
    isPrivate,
    useXmr,
    isMultiSwap,
    amountOut,
    setSwapParams,
    memo,
  };
}
