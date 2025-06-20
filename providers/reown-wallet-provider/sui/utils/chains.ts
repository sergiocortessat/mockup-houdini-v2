import { getFullnodeUrl } from '@mysten/sui/client';
import { SUI_DECIMALS } from '@mysten/sui/utils';
import { SUI_MAINNET_CHAIN } from '@mysten/wallet-standard';
import { defineChain } from '@reown/appkit/networks';

export const sui = defineChain({
  id: 1999, // Custom chain ID for Sui
  // @ts-ignore
  caipNetworkId: 'sui:1999',
  // @ts-ignore
  chainNamespace: 'sui',
  name: 'SUI',
  icon: 'https://assets.coingecko.com/coins/images/26375/standard/sui-ocean-square.png',
  nativeCurrency: { decimals: SUI_DECIMALS, name: 'SUI', symbol: 'SUI' },
  rpcUrls: {
    default: {
      http: [
        'https://sui-rpc.publicnode.com/',
        'https://sui-mainnet-endpoint.blockvision.org',
        getFullnodeUrl('mainnet'),
      ],
    },
  },
  blockExplorers: {
    default: { name: 'Sui Explorer', url: 'https://suiscan.xyz/mainnet/' },
  },
  assets: {
    imageId: 'sui',
    imageUrl:
      'https://assets.coingecko.com/coins/images/26375/standard/sui-ocean-square.png',
  },
});

export const networks = [sui];

export const chains = { [SUI_MAINNET_CHAIN]: sui };
