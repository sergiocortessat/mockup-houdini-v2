'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';

import { Button, ButtonProps } from '@/components/ui/button';
import { HoudiniChain } from '@/features/wallet/constants';
import { cn } from '@/lib/utils';

type NetworkNameDisplay = 'always' | 'desktop-only' | 'never';

interface WalletNetworkDropdownButtonProps extends ButtonProps {
  network: HoudiniChain;
  handleSelectNetwork: (network: HoudiniChain) => void;
  displayName?: NetworkNameDisplay;
  disabled?: boolean;
}

export const WalletNetworkDropdownButton = ({
  network,
  handleSelectNetwork,
  displayName = 'always',
  disabled = false,
  className,
  ...props
}: WalletNetworkDropdownButtonProps) => {
  const t = useTranslations('wallet');
  const onClickNetwork = () => {
    handleSelectNetwork(network);
  };

  const renderNetworkName = () => {
    switch (displayName) {
      case 'never':
        return null;
      case 'desktop-only':
        return <span className="hidden md:block">{network.name}</span>;
      case 'always':
      default:
        return <span>{network.name}</span>;
    }
  };

  return (
    <Button
      key={network.id}
      onClick={onClickNetwork}
      className={cn(
        'flex flex-col gap-2',
        displayName === 'never' && 'items-center justify-center',
        displayName !== 'never' && 'items-start justify-start',
        className
      )}
      disabled={disabled}
      {...props}
    >
      <div className="flex items-center justify-start gap-2">
        {network.icon ? (
          <Image
            src={network.icon}
            alt={network.name}
            width={20}
            height={20}
            className="shrink-0"
          />
        ) : (
          <div className="h-5 w-5 shrink-0" />
        )}
        {renderNetworkName()}
      </div>
    </Button>
  );
};
