import { Wallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import Image from 'next/image';

import { Button } from '@/components/ui/button';

interface TronWalletListViewProps {
  wallets: Wallet[];
  onSelectWallet: (wallet: Wallet) => void;
}

export const TronWalletListView = ({
  wallets,
  onSelectWallet,
}: TronWalletListViewProps) => {
  return (
    <div className="flex w-full flex-col gap-4">
      {wallets.map((wallet) => (
        <Button
          key={wallet.adapter.name}
          onClick={() => onSelectWallet(wallet)}
          variant="outline"
          className="flex w-full items-center justify-between space-x-2"
        >
          <div className="flex items-center space-x-2">
            <Image
              src={wallet.adapter.icon}
              alt={wallet.adapter.name}
              width={20}
              height={20}
            />
            <span>{wallet.adapter.name}</span>
          </div>
          <WalletStatus state={wallet.adapter.state} />
        </Button>
      ))}
    </div>
  );
};

interface WalletStatusProps {
  state: string;
}

const WalletStatus = ({ state }: WalletStatusProps) => {
  const getStatusColor = () => {
    switch (state) {
      case 'Connected':
        return 'text-green-500';
      case 'Disconnected':
        return 'text-gray-500';
      case 'NotFound':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  return <span className={`text-sm ${getStatusColor()}`}>{state}</span>;
};
