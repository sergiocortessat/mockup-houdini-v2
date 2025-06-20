import { ChainKind } from '@/features/swap/types';
import { getErrorMapping } from '@/features/swap/utils/error-helpers/error-mapping/get-error-mapping';
import { NormalizedError } from '@/features/swap/utils/error-helpers/types';

export const parseSuiError = (error: any): NormalizedError | undefined => {
  const errorMessage = typeof error === 'string' ? error : error?.message || '';
  const errorMapping = getErrorMapping(errorMessage, ChainKind.SUI);
  if (errorMapping) {
    return {
      chain: ChainKind.SUI,
      message: errorMessage,
      translationKey: errorMapping.translationKey,
    };
  }
};
