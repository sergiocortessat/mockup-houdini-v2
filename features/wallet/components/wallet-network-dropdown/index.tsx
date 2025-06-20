'use client';

import { CloudCog } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useNetworkStore from '@/features/swap/stores/use-network-store';
import { ChainKind } from '@/features/swap/types';
import { WalletConnectionHandler } from '@/features/wallet/components/wallet-connection-handler';
import { WalletNetworkDropdownButton } from '@/features/wallet/components/wallet-network-dropdown/wallet-network-dropdown-button';
import { HoudiniChain } from '@/features/wallet/constants';
import { useSupportedChains } from '@/features/wallet/hooks/use-supported-chains';
import { isWidgetMode } from '@/features/widget/utils/widget-utils';

const CHAIN_GROUP_NAMES: Record<ChainKind | 'Others', string> = {
  [ChainKind.EVM]: 'EVM Networks',
  [ChainKind.TRON]: 'Tron Network',
  [ChainKind.SOLANA]: 'Solana Network',
  [ChainKind.BTC]: 'Bitcoin Network',
  [ChainKind.SUI]: 'Sui Network',
  [ChainKind.TON]: 'TON Network',
  Others: 'Other Networks',
};

const WalletNetworkDropdown = () => {
  const selectedNetwork = useNetworkStore((state) => state.selectedNetwork);
  const setSelectedNetwork = useNetworkStore(
    (state) => state.setSelectedNetwork
  );
  const [open, setOpen] = useState(false);
  const t = useTranslations('wallet');
  const { filteredAndGroupedNetworks, searchQuery, setSearchQuery } =
    useWalletNetworkDropdown();

  const handleSelectNetwork = (network: HoudiniChain) => {
    setSelectedNetwork(network);
    setOpen(false);
  };

  return (
    <WalletConnectionHandler>
      {({ handleSwitchNetwork }) => (
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger
            asChild
            className="flex h-10 w-10 items-center justify-center md:h-auto md:w-auto"
          >
            {selectedNetwork ? (
              <WalletNetworkDropdownButton
                variant="outline"
                displayName={isWidgetMode ? 'never' : 'desktop-only'}
                disabled={false}
                key={selectedNetwork?.id}
                network={selectedNetwork}
                handleSelectNetwork={(network) => {
                  handleSwitchNetwork(network);
                  handleSelectNetwork(network);
                }}
              />
            ) : (
              <Button variant="outline" className="flex items-center gap-2">
                <div className="block md:hidden">
                  <CloudCog />
                </div>
                <div className="hidden md:block">
                  <span>{t('selectNetwork')}</span>
                </div>
              </Button>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="flex h-[90vh] w-[320px] flex-col rounded-2xl p-0"
            align="start"
          >
            <div className="sticky top-0 z-10 p-2 shadow-sm">
              <input
                type="text"
                value={searchQuery}
                placeholder="Search networks..."
                className="border-border bg-secondary placeholder:text-muted-foreground focus:border-primary w-full rounded-lg border px-3 py-2 text-sm outline-none"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex-1 overflow-y-auto p-2" role="list">
              {(
                Object.entries(filteredAndGroupedNetworks) as [
                  NetworkGroupKey,
                  HoudiniChain[],
                ][]
              )
                .sort(([a], [b]) => {
                  if (a === 'Others') return 1;
                  if (b === 'Others') return -1;
                  return 0;
                })
                .map(
                  ([namespace, networks]) =>
                    networks.length > 0 && (
                      <div key={namespace} className="mb-4">
                        <h3 className="text-muted-foreground mb-2 px-2 text-sm font-medium">
                          {
                            CHAIN_GROUP_NAMES[
                              namespace as keyof typeof CHAIN_GROUP_NAMES
                            ]
                          }
                          {namespace === 'Others' && (
                            <span className="text-muted-foreground ml-1 text-xs">
                              ({t('noWalletConnectAvailable')})
                            </span>
                          )}
                        </h3>
                        <div className="flex flex-col gap-2">
                          {networks.map((network: HoudiniChain) => (
                            <WalletNetworkDropdownButton
                              variant="ghost"
                              displayName="always"
                              disabled={!network.isSupportedWalletConnect}
                              key={`${network.name}-${network.id}`}
                              network={network}
                              handleSelectNetwork={(network) => {
                                handleSwitchNetwork(network);
                                handleSelectNetwork(network);
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )
                )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </WalletConnectionHandler>
  );
};

export { WalletNetworkDropdown };

type NetworkGroupKey = ChainKind | 'Others';
type NetworkGroup = Partial<Record<NetworkGroupKey, HoudiniChain[]>>;

export function useWalletNetworkDropdown() {
  const [searchQuery, setSearchQuery] = useState('');
  const { chains, loading, error } = useSupportedChains();

  const { filteredAndGroupedNetworks } = useMemo(() => {
    if (!chains?.length) {
      return {
        filteredAndGroupedNetworks: {} as NetworkGroup,
        recentNetworks: [] as HoudiniChain[],
      };
    }

    const query = searchQuery.trim().toLowerCase();
    const filtered = query
      ? chains.filter(
          (network: HoudiniChain) =>
            network.name.toLowerCase().includes(query) ||
            network.id.toString().toLowerCase().includes(query)
        )
      : chains;

    const enabledChains = filtered.filter(
      (chain: HoudiniChain) => chain.enabled !== false
    );

    const grouped = enabledChains.reduce<NetworkGroup>(
      (acc: NetworkGroup, network: HoudiniChain) => {
        const matchedKind = Object.values(ChainKind).find(
          (kind) => kind.toLowerCase() === network.kind?.toLowerCase()
        );

        if (matchedKind) {
          if (!acc[matchedKind]) {
            acc[matchedKind] = [];
          }
          acc[matchedKind].push(network);
        } else {
          if (!acc['Others']) {
            acc['Others'] = [];
          }
          acc['Others'].push(network);
        }

        return acc;
      },
      {}
    );

    return {
      filteredAndGroupedNetworks: grouped,
    };
  }, [chains, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredAndGroupedNetworks,
    loading,
    error,
  };
}
