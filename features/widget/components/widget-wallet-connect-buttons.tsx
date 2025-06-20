import WalletConnectButton from '@/features/wallet/components/wallet-connect-button';
import { WalletNetworkDropdown } from '@/features/wallet/components/wallet-network-dropdown';

const WidgetWalletConnectButtons = () => {
  return (
    <div className="flex items-center gap-2">
      <WalletConnectButton />
      <WalletNetworkDropdown />
    </div>
  );
};

export default WidgetWalletConnectButtons;
