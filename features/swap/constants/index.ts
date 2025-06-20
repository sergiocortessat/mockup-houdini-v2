import { CombinedRoute } from '@/features/swap/types';
import { QuoteType } from '@/graphql/generated';

export const HARDHAT_CHAIN_ID = 31337;
export const BSC_CHAIN_ID = 56;
export const DEFAULT_GAS = 1_000_000;
export const TOKEN_SEARCH_DEBOUNCE_MS = 500;

export const MAX_RETRIES = 12;

export const QUOTE_QUERY_MAX_RETRIES = 3;
export const QUOTE_QUERY_RETRY_DELAY_MS = 5 * 1000;

export const GAS_BUFFER_PERCENTAGE = 110; // 10% buffer (110% of estimated gas)

// Transaction confirmation constants
export const TX_CONFIRMATION_MAX_RETRIES = 10;
export const TX_CONFIRMATION_RETRY_DELAY_MS = 3000;
export const APPROVAL_POLLING_INTERVAL_MS = 3000;

export const DEBOUNCE_DELAY_MS = 500;

export const DEFAULT_SWAP_PARAMS = {
  tokenIn: 'ETH',
  amount: 0,
  tokenOut: 'SOL',
  address: '',
  isPrivate: false,
  useXmr: false,
  isMultiSwap: false,
  amountOut: 0,
  memo: '',
};

export const SWAP_PRICE_BUFFER_PERCENTAGE = 0.007;
export const SWAP_PRICE_BUFFER_PERCENTAGE_PRIVATE = 0.015;

export enum SlippageValue {
  AUTO = 'auto',
  HALF = '0.5',
  ONE = '1',
  CUSTOM = 'custom',
}

export const SLIPPAGE_OPTIONS = [
  { label: 'Auto', value: SlippageValue.AUTO },
  { label: '0.5%', value: SlippageValue.HALF },
  { label: '1%', value: SlippageValue.ONE },
] as const;

export const ROUTES_TO_SHOW_INITIALLY = 3;

export const SKELETON_ROUTES: CombinedRoute[] = [
  {
    quoteId: 'skeleton-1',
    type: QuoteType.Private,
    amountOut: 0,
    duration: 0,
    outQuoteId: 'skeleton-1',
    swap: '',
    swapName: QuoteType.Private,
  },
  {
    quoteId: 'skeleton-2',
    type: QuoteType.Dex,
    amountOut: 0,
    duration: 0,
    netAmountOut: 0,
    path: [],
    swap: '',
    swapName: QuoteType.Dex,
    gasUsd: 0,
  },
  {
    quoteId: 'skeleton-3',
    type: QuoteType.Standard,
    amountOut: 0,
    duration: 0,
    outQuoteId: 'skeleton-3',
    swap: 'No Wallet Connect',
    swapName: 'No Wallet Connect',
  },
];
