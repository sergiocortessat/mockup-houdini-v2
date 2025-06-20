'use client';

import { Wallet, useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { useTranslations } from 'next-intl';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ChainKind } from '@/features/swap/types';
import { TronConnectedWalletView } from '@/features/wallet/components/tron-account-modal/tron-connected-wallet-view';
import { TronWalletListView } from '@/features/wallet/components/tron-account-modal/tron-wallet-list-view';
import { useUserWallets } from '@/providers/user-wallets-provider';

interface TronAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TronAccountModal({ isOpen, onClose }: TronAccountModalProps) {
  const { wallets, select } = useWallet();
  const t = useTranslations('wallet');
  const { userConnectedWallets } = useUserWallets();
  const connectedTronWallet = userConnectedWallets[ChainKind.TRON];

  const handleSelectWallet = async (wallet: Wallet) => {
    try {
      select(wallet.adapter.name);
      await wallet.adapter.connect();
      onClose();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };
  const isConnected = Boolean(connectedTronWallet?.address);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isConnected ? t('connectedWallet') : t('connectWallet')}
          </DialogTitle>
          <DialogDescription>
            {isConnected
              ? t('connectedWalletDescription')
              : t('connectWalletDescription')}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-6 py-4">
          {isConnected && connectedTronWallet?.address ? (
            <>
              <TronConnectedWalletView
                address={connectedTronWallet.address}
                onClose={onClose}
              />
            </>
          ) : (
            <TronWalletListView
              wallets={wallets}
              onSelectWallet={handleSelectWallet}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
