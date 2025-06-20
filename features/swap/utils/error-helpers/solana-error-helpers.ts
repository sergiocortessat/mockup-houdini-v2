import { ChainKind } from '@/features/swap/types';
import { getErrorMapping } from '@/features/swap/utils/error-helpers/error-mapping/get-error-mapping';
import { getSolanaCustomProgramErrorMessage } from '@/features/swap/utils/error-helpers/error-mapping/solana-error-mapping';
import { NormalizedError } from '@/features/swap/utils/error-helpers/types';

export const parseSolanaError = (error: any): NormalizedError => {
  const normalizedError: NormalizedError = {
    chain: ChainKind.SOLANA,
    translationKey: '',
    raw: error,
    message: error?.message || '',
  };
  // This error occur when the blockhash included in a transaction is not deemed to be valid
  // when a validator processes a transaction. We can retry the simulation to get a valid blockhash.
  if (error.err === 'BlockhashNotFound') {
    const errorMapping = getErrorMapping('BlockhashNotFound', ChainKind.SOLANA);
    normalizedError.translationKey =
      errorMapping?.translationKey || 'errors.solana.blockhashNotFound';
    normalizedError.message = 'Blockhash not found';
  }

  // Check for Jupiter custom program errors
  if (error.err && typeof error.err === 'object' && 'custom' in error.err) {
    const customError = error.err.custom;
    const errorMapping = getSolanaCustomProgramErrorMessage(
      customError as string
    );
    normalizedError.translationKey =
      errorMapping?.translationKey || 'errors.solana.unknownProgramError';
    normalizedError.message = customError;
  }

  // Check the response logs for any known errors
  if (error.logs) {
    for (const line of error.logs) {
      const errorMapping = getErrorMapping(line, ChainKind.SOLANA);
      normalizedError.translationKey =
        errorMapping?.translationKey || 'errors.solana.unknownProgramError';
      normalizedError.message = line;
      break; // Stop processing after the first match
    }
  }

  return normalizedError;
};
