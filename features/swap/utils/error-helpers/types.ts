import { ChainKind } from '@/features/swap/types';

export interface NormalizedError {
  chain: ChainKind;
  translationKey: string;
  message: string; // message from the error, if we don't have a translation key, we use this message
  raw?: unknown;
}

export interface ErrorMapping {
  key: string;
  pattern: string | RegExp;
  translationKey: string;
}
