import { ChainKind } from '@/features/swap/types';
import { getErrorMapping } from '@/features/swap/utils/error-helpers/error-mapping/get-error-mapping';
import { NormalizedError } from '@/features/swap/utils/error-helpers/types';

export const parseTonError = (error: any): NormalizedError | undefined => {
  const errorMessage = typeof error === 'string' ? error : error?.message || '';
  const errorMapping = getErrorMapping(errorMessage, ChainKind.TON);
  if (errorMapping) {
    return {
      chain: ChainKind.TON,
      message: errorMessage,
      translationKey: errorMapping.translationKey,
    };
  }
};
