import { useEffect, useMemo } from 'react';

import useNetworkStore from '@/features/swap/stores/use-network-store';
import { ChainKind } from '@/features/swap/types';
import { HoudiniChain, houdiniChains } from '@/features/wallet/constants';
import { useSupportedChainsQuery } from '@/graphql/generated';

export function useSupportedChains() {
  const { data, loading, error, refetch } = useSupportedChainsQuery();
  const setAllSupportedNetworks = useNetworkStore(
    (state) => state.setAllSupportedNetworks
  );
  const chains = useMemo(() => {
    return data?.supportedChains?.map((apiChain): HoudiniChain => {
      const localChain = houdiniChains.find(
        (chain) =>
          chain.id === (apiChain.chainId || apiChain.id) ||
          chain.name.toLowerCase() === apiChain.name.toLowerCase()
      );

      if (!localChain) {
        return {
          ...apiChain,
          block: '',
          customRpc: '',
          isSupportedWalletConnect: false,
          kind: apiChain.kind as ChainKind,
        } as HoudiniChain;
      }

      return {
        ...localChain,
        ...apiChain,
        customRpc: '',
        isSupportedWalletConnect: true,
        kind: apiChain.kind as ChainKind,
      } as HoudiniChain;
    });
  }, [data?.supportedChains]);
  useEffect(() => {
    if (chains) {
      setAllSupportedNetworks(chains);
    }
  }, [chains, setAllSupportedNetworks]);

  return {
    chains,
    loading,
    error,
    refetch,
  };
}
