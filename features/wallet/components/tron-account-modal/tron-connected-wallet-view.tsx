import { Wallet, useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';

import { ConnectedWalletView } from '@/features/wallet/components/common/connected-wallet-view';

interface TronConnectedWalletViewProps {
  address: string;
  onClose: () => void;
}

export const TronConnectedWalletView = ({
  address,
  onClose,
}: TronConnectedWalletViewProps) => {
  const { disconnect, wallets } = useWallet();

  const handleDisconnect = async () => {
    const connectedWallet = wallets.find(
      (wallet) => wallet.adapter.address === address
    );
    if (connectedWallet) {
      await connectedWallet.adapter.disconnect();
    }
    disconnect();
    onClose();
  };

  return (
    <ConnectedWalletView address={address} onDisconnect={handleDisconnect} />
  );
};
