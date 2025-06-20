import { useTonAddress } from '@tonconnect/ui-react';
import { useTranslations } from 'next-intl';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TonConnectedWalletView } from '@/features/wallet/components/ton-modal/ton-connected-wallet-view';

interface TonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TonModal = ({ isOpen, onClose }: TonModalProps) => {
  const tonAddress = useTonAddress();
  const t = useTranslations('wallet');

  if (!isOpen) {
    return null;
  }
  if (!tonAddress) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('walletNotConnected')}</DialogTitle>
            <DialogDescription>
              {t('walletNotConnectedDescription')}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('connectedWallet')}</DialogTitle>
          <DialogDescription>
            {t('connectedWalletDescription')}
          </DialogDescription>
        </DialogHeader>
        <TonConnectedWalletView address={tonAddress} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};
