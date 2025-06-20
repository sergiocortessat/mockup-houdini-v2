'use client';

import { useCurrentAccount } from '@mysten/dapp-kit';
import { useTranslations } from 'next-intl';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { SuiConnectedWalletView } from '@/features/wallet/components/sui-modal/sui-connected-wallet-view';
import { SuiWalletConnectModal } from '@/features/wallet/components/sui-modal/sui-wallet-connect-modal';

interface SuiModalProps {
  isOpenConnectModal: boolean;
  isOpenConnectedModal: boolean;
  onCloseConnectModal: () => void;
  onCloseConnectedModal: () => void;
}

export function SuiModal({
  isOpenConnectModal,
  isOpenConnectedModal,
  onCloseConnectModal,
  onCloseConnectedModal,
}: SuiModalProps) {
  const currentAccount = useCurrentAccount(); // SUI
  const t = useTranslations('wallet');

  const isConnected = currentAccount?.address !== undefined;
  if (!isConnected) {
    return (
      <SuiWalletConnectModal
        isOpen={isOpenConnectModal}
        onClose={onCloseConnectModal}
      />
    );
  }
  return (
    <Dialog open={isOpenConnectedModal} onOpenChange={onCloseConnectedModal}>
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
          <SuiConnectedWalletView
            address={currentAccount?.address}
            onClose={onCloseConnectedModal}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
