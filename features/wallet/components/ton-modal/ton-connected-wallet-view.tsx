import { useTonConnectUI } from '@tonconnect/ui-react';

import { ConnectedWalletView } from '@/features/wallet/components/common/connected-wallet-view';

interface TonConnectedWalletViewProps {
  address: string;
  onClose: () => void;
}

export const TonConnectedWalletView = ({
  address,
  onClose,
}: TonConnectedWalletViewProps) => {
  const [tonConnectUI] = useTonConnectUI();

  const handleDisconnect = () => {
    tonConnectUI.disconnect();
    onClose();
  };

  return (
    <ConnectedWalletView address={address} onDisconnect={handleDisconnect} />
  );
};
