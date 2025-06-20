import { ChainKind } from '@/features/swap/types';
import { btcErrorMappings } from '@/features/swap/utils/error-helpers/error-mapping/btc-error-mapping';
import { getErrorMapping } from '@/features/swap/utils/error-helpers/error-mapping/get-error-mapping';
import { NormalizedError } from '@/features/swap/utils/error-helpers/types';

export const parseBtcError = (error: any): NormalizedError | undefined => {
  const errorMessage = typeof error === 'string' ? error : error?.message || '';
  const errorMapping = getErrorMapping(errorMessage, ChainKind.BTC);
  if (errorMapping) {
    return {
      chain: ChainKind.BTC,
      message: errorMessage,
      translationKey: errorMapping.translationKey,
    };
  }
};
