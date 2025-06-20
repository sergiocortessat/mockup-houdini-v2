import { create } from 'zustand';

import { ChainKind } from '@/features/swap/types';
import { HoudiniChain } from '@/features/wallet/constants';

const ETHEREUM = {
  id: '6689b0d3c52f263938c44844',
  name: 'Ethereum Mainnet',
  shortName: 'ethereum',
  shortNameV1: 'ETH',
  chainId: 1,
  kind: 'evm',
  icon: 'https://api-refactor.houdiniswap.com/assets/networks/ETH.png',
  addressValidation: '^(0x)[0-9A-Za-z]{40}$',
  tokenAddressValidation: '^(0x)[0-9A-Za-z]{40}$',
  explorerUrl: 'https://etherscan.io/tx/{txHash}',
  addressUrl: 'https://etherscan.io/address/{address}',
  enabled: true,
  priority: 1,
  isSupportedWalletConnect: true,
  __typename: 'Chain',
};
interface SelectedNetworkStore {
  selectedNetwork: HoudiniChain | undefined;
  setSelectedNetwork: (network: HoudiniChain) => void;
  setSelectedNetworkByChainIdAndKind: (
    chainId: number | undefined | null,
    kind: ChainKind
  ) => void;
  allSupportedNetworks: HoudiniChain[];
  setAllSupportedNetworks: (networks: HoudiniChain[]) => void;
}

const useSelectedNetworkStore = create<SelectedNetworkStore>((set) => ({
  selectedNetwork: ETHEREUM as HoudiniChain,
  setSelectedNetwork: (network) => set({ selectedNetwork: network }),
  setSelectedNetworkByChainIdAndKind: (chainId, kind) => {
    set((state) => ({
      selectedNetwork: state.allSupportedNetworks.find((network) => {
        const isEvm = kind === ChainKind.EVM;

        return (
          (isEvm && chainId && network.chainId === chainId) ||
          (!isEvm && network.kind === kind)
        );
      }),
    }));
  },
  allSupportedNetworks: [],
  setAllSupportedNetworks: (networks) =>
    set({ allSupportedNetworks: networks }),
}));

export default useSelectedNetworkStore;
