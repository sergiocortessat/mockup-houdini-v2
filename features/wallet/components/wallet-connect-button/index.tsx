'use client';

import { useDisconnect } from '@reown/appkit/react';
import { useAppKitAccount } from '@reown/appkit/react';
import { AnimatePresence, motion } from 'framer-motion';
import { LockIcon } from 'lucide-react';
import { Wallet } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import useSelectedNetworkStore from '@/features/swap/stores/use-network-store';
import { UserAddressAvatar } from '@/features/wallet/components/user-address-avatar';
import { WalletConnectionHandler } from '@/features/wallet/components/wallet-connection-handler';
import { isWidgetMode } from '@/features/widget/utils/widget-utils';
import { cn } from '@/lib/utils';
import { formatTruncatedAddress } from '@/lib/utils';
import { useUserWallets } from '@/providers/user-wallets-provider';

export const WalletConnectButton = () => {
  const searchParams = useSearchParams();
  const { disconnect } = useDisconnect();
  const { userConnectedWallets } = useUserWallets();
  const { selectedNetwork } = useSelectedNetworkStore();

  const { isConnected } = useAppKitAccount();
  const t = useTranslations('common');
  const tWallet = useTranslations('wallet');

  const selectedAccount = selectedNetwork?.kind
    ? userConnectedWallets[selectedNetwork?.kind]
    : undefined;
  const isPrivate = searchParams.get('isPrivate');

  if (isPrivate && isConnected) {
    disconnect();
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={isPrivate ? 'private' : 'public'}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
      >
        {isPrivate ? (
          <Badge
            variant="secondary"
            className="flex h-8 items-center justify-center gap-2 rounded-full md:h-[42px] md:w-[143px]"
          >
            <LockIcon className="size-4" />
            {t('privateMode')}
          </Badge>
        ) : (
          <div>
            <WalletConnectionHandler>
              {({ handleAccountConnection, handleWalletConnection }) =>
                selectedAccount?.address ? (
                  <Button
                    variant="outline"
                    onClick={() =>
                      handleAccountConnection(selectedNetwork?.kind)
                    }
                    className="flex h-10 w-10 items-center justify-center md:h-auto md:w-auto"
                  >
                    <UserAddressAvatar
                      address={selectedAccount.address}
                      size={5}
                      scale={4}
                    />
                    <span className="hidden md:block">
                      {formatTruncatedAddress(selectedAccount.address)}
                    </span>
                  </Button>
                ) : (
                  <Button
                    disabled={!selectedNetwork?.isSupportedWalletConnect}
                    variant="outline"
                    onClick={() =>
                      handleWalletConnection({
                        chainNamespace: selectedNetwork?.kind,
                      })
                    }
                  >
                    <div
                      className={cn(
                        'block md:hidden',
                        isWidgetMode && '!block'
                      )}
                    >
                      <Wallet className="h-4 w-4" />
                    </div>
                    <div
                      className={cn(
                        'hidden md:block',
                        isWidgetMode && '!hidden'
                      )}
                    >
                      {tWallet('connectWallet')}
                    </div>
                  </Button>
                )
              }
            </WalletConnectionHandler>
            {/* @ts-ignore */}
            {/* <appkit-button /> */}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default WalletConnectButton;
