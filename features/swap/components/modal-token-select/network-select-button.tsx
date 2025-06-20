import { Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React from 'react';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { AllChainKind } from '@/features/swap/types';

interface NetworkOption {
  name: string;
  shortName: string;
  logoUrl: string;
}

interface NetworkSelectButtonProps {
  option: NetworkOption;
  handleSelect: (name: string) => void;
  selectedValue: string;
  allNetworksLabel?: string;
}

const NetworkSelectButton = ({
  option,
  handleSelect,
  selectedValue,
  allNetworksLabel,
}: NetworkSelectButtonProps) => {
  const t = useTranslations('swap.modal');
  const isSelected = option.shortName === selectedValue;
  const isAll = option.shortName === AllChainKind.ALL;

  return (
    <DropdownMenuItem
      key={option.name}
      onClick={() => handleSelect(option.shortName)}
      className="flex items-center justify-between gap-2"
      aria-selected={isSelected}
      tabIndex={0}
      data-testid={`network-select-item-${option.name}`}
    >
      <div className="flex items-center gap-5">
        <Image src={option.logoUrl} alt={option.name} width={32} height={32} />
        <span className="text-label-sm capitalize">
          {isAll ? (allNetworksLabel ?? t('allNetworks')) : option.name}
        </span>
      </div>
      {isSelected && <Check className="text-primary h-4 w-4" />}
    </DropdownMenuItem>
  );
};

export default React.memo(NetworkSelectButton);
