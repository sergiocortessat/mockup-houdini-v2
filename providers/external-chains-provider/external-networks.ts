// Not part of the Reown ecosystem
import { defineChain } from '@reown/appkit/networks';

export const tron = defineChain({
  id: 728126428,
  // @ts-ignore
  caipNetworkId: 'tron:728126428',
  // @ts-ignore
  chainNamespace: 'tron',
  name: 'Tron',
  icon: 'https://assets.coingecko.com/coins/images/1094/standard/tron-logo.png?1696502193',
  nativeCurrency: { decimals: 18, name: 'TRX', symbol: 'TRX' },
  rpcUrls: {
    default: {
      http: ['https://api.trongrid.io/jsonrpc'],
    },
  },
  blockExplorers: {
    default: { name: 'Tronscan', url: 'https://tronscan.org/#/home' },
  },
  assets: {
    imageId: 'tron',
    imageUrl:
      'https://assets.coingecko.com/coins/images/1094/standard/tron-logo.png?1696502193',
  },
});

export const ton = {
  id: 460,
  name: 'The Open Network',
  caipNetworkId: 'ton:460',
  chainNamespace: 'tron',
  icon: 'https://assets.coingecko.com/coins/images/1094/standard/tron-logo.png?1696502193',
  nativeCurrency: { decimals: 18, name: 'TON', symbol: 'TON' },
  rpcUrls: {
    default: {
      http: ['https://ton-mainnet.g.alchemy.com/v2/demo'],
    },
  },
  blockExplorers: {
    default: { name: 'TONScan', url: 'https://tonscan.org/' },
  },
  assets: {
    imageId: 'ton',
    imageUrl:
      'https://assets.coingecko.com/coins/images/1094/standard/tron-logo.png?1696502193',
  },
};
