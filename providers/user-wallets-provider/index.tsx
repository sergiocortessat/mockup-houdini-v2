'use client';

import { useCurrentAccount } from '@mysten/dapp-kit';
import { bitcoin, solana, tron } from '@reown/appkit/networks';
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react';
import { useTonAddress } from '@tonconnect/ui-react';
import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
} from 'react';

import { ChainKind } from '@/features/swap/types';
import { ton } from '@/providers/external-chains-provider/external-networks';
import { sui } from '@/providers/reown-wallet-provider/sui/utils/chains';

interface UserWalletsContextType {
  userConnectedWallets: Record<
    ChainKind,
    | {
        address: string | null | undefined;
        chainId: number | string | undefined;
      }
    | undefined
  >;
  getIsWalletConnected: (chainKind: ChainKind) => boolean;
}

const UserWalletsContext = createContext<UserWalletsContextType | undefined>(
  undefined
);

export const useUserWallets = () => {
  const context = useContext(UserWalletsContext);
  if (!context) {
    throw new Error('useUserWallets must be used within a UserWalletsProvider');
  }
  return context;
};

interface UserWalletsProviderProps {
  children: ReactNode;
}

const UserWalletsProvider = ({ children }: UserWalletsProviderProps) => {
  const { wallet } = useWallet(); // Tron
  const currentAccount = useCurrentAccount(); // SUI
  const tonAddress = useTonAddress(); // TON
  const eip155Account = useAppKitAccount({ namespace: 'eip155' }); // reown for EVM chains
  const solanaAccount = useAppKitAccount({ namespace: 'solana' }); // reown for solana
  const bip122Account = useAppKitAccount({ namespace: 'bip122' }); // reown for bitcoin
  const { chainId } = useAppKitNetwork(); // reown for evm chains

  const userConnectedWallets: Record<
    ChainKind,
    | {
        address: string | null | undefined;
        chainId: number | string | undefined;
        active: boolean;
      }
    | undefined
  > = useMemo(
    () => ({
      [ChainKind.EVM]: {
        address: eip155Account?.address,
        chainId: chainId,
        active: eip155Account.isConnected,
      },
      [ChainKind.TRON]: {
        address: wallet?.adapter.address,
        chainId: tron.id,
        active: wallet?.state === 'Connected',
      },
      [ChainKind.SOLANA]: {
        address: solanaAccount?.address,
        chainId: solana.id,
        active: solanaAccount?.status === 'connected',
      },
      [ChainKind.BTC]: {
        address: bip122Account?.address,
        chainId: bitcoin.id,
        active: bip122Account?.status === 'connected',
      },
      [ChainKind.SUI]: {
        address: currentAccount?.address,
        chainId: sui.id,
        active: currentAccount?.address !== undefined,
      },
      [ChainKind.TON]: {
        address: tonAddress,
        chainId: ton.id,
        active: tonAddress !== undefined,
      },
    }),
    [
      eip155Account,
      chainId,
      wallet,
      solanaAccount,
      bip122Account,
      currentAccount,
      tonAddress,
    ]
  );

  const getIsWalletConnected = useCallback(
    (chainKind: ChainKind) => {
      return (
        userConnectedWallets[chainKind]?.address !== undefined &&
        userConnectedWallets[chainKind]?.address !== null &&
        userConnectedWallets[chainKind]?.address !== '' &&
        userConnectedWallets[chainKind]?.active
      );
    },
    [userConnectedWallets]
  );

  const value = {
    getIsWalletConnected,
    userConnectedWallets,
  };

  return (
    <UserWalletsContext.Provider value={value}>
      {children}
    </UserWalletsContext.Provider>
  );
};

export default UserWalletsProvider;
