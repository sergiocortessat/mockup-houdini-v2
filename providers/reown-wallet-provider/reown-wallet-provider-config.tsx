import { BitcoinAdapter } from '@reown/appkit-adapter-bitcoin';
import { SolanaAdapter } from '@reown/appkit-adapter-solana';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { mainnet, sepolia, solana } from '@reown/appkit/networks';
import { fallback } from 'viem';
import { http } from 'viem';
import { cookieStorage, createStorage } from 'wagmi';

import { networks } from '@/providers/reown-wallet-provider/reown-wallet-provider-networks';

const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID;

if (!projectId) {
  throw new Error('NEXT_PUBLIC_REOWN_PROJECT_ID is not defined');
}

const SOLANA_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL;
const EVM_RPC_URL = process.env.NEXT_PUBLIC_EVM_RPC_URL;
const SUI_RPC_URL = process.env.NEXT_PUBLIC_SUI_RPC_URL;

if (!SOLANA_RPC_URL) {
  throw new Error('NEXT_PUBLIC_SOLANA_RPC_URL is not defined');
}

if (!SUI_RPC_URL) {
  throw new Error('NEXT_PUBLIC_SUI_RPC_URL is not defined');
}

const transports = {
  [mainnet.id]: fallback([
    http(EVM_RPC_URL, { batch: true }),
    http('https://eth.llamarpc.com'),
    http('https://cloudflare-eth.com'),
    http('https://ethereum-rpc.publicnode.com'),
  ]),

  [sepolia.id]: http('https://public-nodes.tradersclub.app/sepolia/rpc'),
  [solana.id]: http(SOLANA_RPC_URL, { batch: true }),
};

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  projectId,
  networks,
  transports,
  ssr: true,
});

export const solanaAdapter = new SolanaAdapter({
  connectionSettings: {
    httpAgent: false,
    commitment: 'confirmed',
    wsEndpoint: SOLANA_RPC_URL,
  },
});

export const bitcoinAdapter = new BitcoinAdapter({
  projectId,
});

// export const suiAdapter = new SuiAdapter({
//   projectId,
//   networks: [suiMainnet],
//   connectionSettings: {
//     httpAgent: false,
//     commitment: 'immediate',
//     endpoint: SUI_RPC_URL,
//   },
// });
