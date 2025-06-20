import { ChainKind } from '@/features/swap/types';
import { getErrorMapping } from '@/features/swap/utils/error-helpers/error-mapping/get-error-mapping';
import { NormalizedError } from '@/features/swap/utils/error-helpers/types';

export const parseTronError = (error: any): NormalizedError | undefined => {
  const errorMessage = typeof error === 'string' ? error : error?.message || '';
  const errorMapping = getErrorMapping(errorMessage, ChainKind.TRON);
  if (errorMapping) {
    return {
      chain: ChainKind.TRON,
      message: errorMessage,
      translationKey: errorMapping.translationKey,
    };
  }
};
