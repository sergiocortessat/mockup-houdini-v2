'use client';

import { ConnectModal } from '@mysten/dapp-kit';

interface SuiWalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SuiWalletConnectModal({
  isOpen,
  onClose,
}: SuiWalletConnectModalProps) {
  if (!isOpen) {
    return null;
  }
  return <ConnectModal trigger={<></>} open={isOpen} onOpenChange={onClose} />;
}
