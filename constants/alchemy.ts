import { mainnet, polygon, solana } from '@reown/appkit/networks';
import {
  arbitrum,
  arbitrumGoerli,
  arbitrumSepolia,
  astar,
  base,
  baseGoerli,
  baseSepolia,
  goerli,
  optimism,
  optimismGoerli,
  optimismSepolia,
  polygonAmoy,
  polygonMumbai,
  polygonZkEvm,
  polygonZkEvmTestnet,
  sepolia,
} from '@reown/appkit/networks';

export const alchemyRPCSupportedChains = [
  mainnet,
  goerli,
  sepolia,
  optimism,
  optimismGoerli,
  optimismSepolia,
  arbitrum,
  arbitrumGoerli,
  arbitrumSepolia,
  polygon,
  polygonMumbai,
  polygonAmoy,
  astar,
  polygonZkEvm,
  polygonZkEvmTestnet,
  base,
  baseGoerli,
  baseSepolia,
  solana,
];

export const RPC_ALCHEMY_SUPPORTED_CHAIN_NAMES: Record<
  number | string,
  string
> = {
  [mainnet.id]: 'eth-mainnet',
  [goerli.id]: 'eth-goerli',
  [sepolia.id]: 'eth-sepolia',
  [optimism.id]: 'opt-mainnet',
  [optimismGoerli.id]: 'opt-goerli',
  [optimismSepolia.id]: 'opt-sepolia',
  [arbitrum.id]: 'arb-mainnet',
  [arbitrumGoerli.id]: 'arb-goerli',
  [arbitrumSepolia.id]: 'arb-sepolia',
  [polygon.id]: 'polygon-mainnet',
  [polygonMumbai.id]: 'polygon-mumbai',
  [polygonAmoy.id]: 'polygon-amoy',
  [astar.id]: 'astar-mainnet',
  [polygonZkEvm.id]: 'polygonzkevm-mainnet',
  [polygonZkEvmTestnet.id]: 'polygonzkevm-testnet',
  [base.id]: 'base-mainnet',
  [baseGoerli.id]: 'base-goerli',
  [baseSepolia.id]: 'base-sepolia',
  [solana.id]: 'solana-mainnet',
};

export const getAlchemyRPCUrl = (chainId: number | string) => {
  const alchemyRpcApiKey = process.env.NEXT_PUBLIC_ALCHEMY_RPC_API;
  if (!alchemyRpcApiKey) {
    throw new Error('Alchemy RPC API key is not set');
  }
  return `https://${RPC_ALCHEMY_SUPPORTED_CHAIN_NAMES[chainId]}.g.alchemy.com/v2/${alchemyRpcApiKey}`;
};
