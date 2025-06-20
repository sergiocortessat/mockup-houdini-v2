import { ChainKind } from '@/features/swap/types';
import { btcErrorMappings } from '@/features/swap/utils/error-helpers/error-mapping/btc-error-mapping';
import { evmErrorMappings } from '@/features/swap/utils/error-helpers/error-mapping/evm-error-mapping';
import { solanaErrorMappings } from '@/features/swap/utils/error-helpers/error-mapping/solana-error-mapping';
import { suiErrorMappings } from '@/features/swap/utils/error-helpers/error-mapping/sui-error-mapping';
import { tonErrorMappings } from '@/features/swap/utils/error-helpers/error-mapping/ton-error-mapping';
import { tronErrorMappings } from '@/features/swap/utils/error-helpers/error-mapping/tron-error-mapping';
import { ErrorMapping } from '@/features/swap/utils/error-helpers/types';

const errorMappings: Record<ChainKind, ErrorMapping[]> = {
  [ChainKind.SOLANA]: solanaErrorMappings,
  [ChainKind.EVM]: evmErrorMappings,
  [ChainKind.BTC]: btcErrorMappings,
  [ChainKind.SUI]: suiErrorMappings,
  [ChainKind.TRON]: tronErrorMappings,
  [ChainKind.TON]: tonErrorMappings,
};

export function getErrorMapping(
  errorString: string,
  chainKind: ChainKind
):
  | {
      key: string;
      translationKey: string;
    }
  | undefined {
  for (const mapping of errorMappings[chainKind]) {
    if (typeof mapping.pattern === 'string') {
      if (errorString.toLowerCase().includes(mapping.pattern.toLowerCase())) {
        return { key: mapping.key, translationKey: mapping.translationKey };
      }
    } else if (mapping.pattern instanceof RegExp) {
      if (mapping.pattern.test(errorString.toLowerCase())) {
        return { key: mapping.key, translationKey: mapping.translationKey };
      }
    }
  }
}
