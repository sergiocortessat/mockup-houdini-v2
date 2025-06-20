import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import React from 'react';

import { AllNetworkSvg } from '@/components/Svg';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import NetworkSelectButton from '@/features/swap/components/modal-token-select/network-select-button';
import { AllChainKind } from '@/features/swap/types';
import { HoudiniChain } from '@/features/wallet/constants';
import { useSupportedChains } from '@/features/wallet/hooks/use-supported-chains';
import { cn } from '@/lib/utils';

interface NetworkSelectProps {
  onSelect: (value: string) => void;
  selectedValue: string;
}

// Define NetworkOption type for clarity and reuse
interface NetworkOption {
  name: string;
  logoUrl: string;
  shortName: string;
}

const NetworkSelect = ({ onSelect, selectedValue }: NetworkSelectProps) => {
  const t = useTranslations('swap.modal');
  const { chains } = useSupportedChains();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const groupedChainsWithAll: NetworkOption[] = useMemo(() => {
    if (!chains?.length) {
      return [
        {
          name: AllChainKind.ALL,
          shortName: AllChainKind.ALL,
          logoUrl: AllNetworkSvg,
        },
      ];
    }

    const enabledChains = chains.filter(
      (chain: HoudiniChain) => chain.enabled !== false
    );

    const query = searchQuery.trim().toLowerCase();
    const filteredChains = query
      ? enabledChains.filter(
          (chain) =>
            chain.name.toLowerCase().includes(query) ||
            chain.shortName.toLowerCase().includes(query)
        )
      : enabledChains;

    return [
      {
        name: AllChainKind.ALL,
        shortName: AllChainKind.ALL,
        logoUrl: AllNetworkSvg,
      },
      ...filteredChains.map((chain) => ({
        name: chain.name,
        shortName: chain.shortName,
        logoUrl: chain.icon || '',
      })),
    ];
  }, [chains, searchQuery]);

  const handleSelect = (value: string) => {
    onSelect(value);
    setOpen(false);
    setSearchQuery('');
  };

  const selectedChain = chains?.find(
    (chain) => chain.shortName === selectedValue
  );
  return (
    <div>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger className="flex cursor-pointer items-center gap-2 border-none bg-transparent p-0 shadow-none">
          {selectedValue === AllChainKind.ALL ? (
            <Image
              src={AllNetworkSvg}
              alt={selectedValue}
              width={24}
              height={24}
            />
          ) : selectedChain ? (
            <Image
              src={selectedChain.icon || ''}
              alt={selectedValue}
              width={24}
              height={24}
            />
          ) : (
            <Image
              src={AllNetworkSvg}
              alt={selectedValue}
              width={24}
              height={24}
            />
          )}
          <ChevronDown
            className={cn(
              'h-4 w-4 transition-transform duration-200',
              open && 'rotate-180'
            )}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="mt-4 max-h-[350px] min-w-[240px] translate-x-2 space-y-2 p-2"
        >
          <input
            type="text"
            value={searchQuery}
            placeholder="Search networks..."
            className="border-border bg-secondary placeholder:text-muted-foreground focus:border-primary w-full rounded-lg border px-3 py-2 text-sm outline-none"
            onChange={(e) => setSearchQuery(e.target.value)}
            // prevent the Input from un-focusing when type first character
            onKeyDown={(e) => e.stopPropagation()}
          />
          {groupedChainsWithAll.map((option) => (
            <NetworkSelectButton
              key={option.name}
              option={option}
              handleSelect={handleSelect}
              selectedValue={selectedValue}
              allNetworksLabel={t('allNetworks')}
            />
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NetworkSelect;
