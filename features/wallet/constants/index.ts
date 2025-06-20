import { AppKitNetwork } from '@reown/appkit/networks';

import { ChainKind } from '@/features/swap/types';
import { Chain } from '@/graphql/generated';
import {
  ton,
  tron,
} from '@/providers/external-chains-provider/external-networks';
import { networks } from '@/providers/reown-wallet-provider/reown-wallet-provider-networks';
import { sui } from '@/providers/reown-wallet-provider/sui/utils/chains';

export type HoudiniChain = Partial<AppKitNetwork> &
  Chain & {
    isSupportedWalletConnect: boolean;
    kind: ChainKind;
  };

export type HandleWalletConnectionProps = {
  chainNamespace: ChainKind | undefined;
  evmChainId?: number | undefined;
};

export const houdiniChains: AppKitNetwork[] = [...networks, tron, sui, ton];
