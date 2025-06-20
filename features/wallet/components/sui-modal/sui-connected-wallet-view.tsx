import { useDisconnectWallet } from '@mysten/dapp-kit';

import { ConnectedWalletView } from '@/features/wallet/components/common/connected-wallet-view';

interface SuiConnectedWalletViewProps {
  address: string;
  onClose: () => void;
}

export const SuiConnectedWalletView = ({
  address,
  onClose,
}: SuiConnectedWalletViewProps) => {
  const { mutate: disconnect } = useDisconnectWallet();

  const handleDisconnect = () => {
    disconnect();
    onClose();
  };

  return (
    <ConnectedWalletView address={address} onDisconnect={handleDisconnect} />
  );
};
