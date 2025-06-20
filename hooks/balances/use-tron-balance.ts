import React from 'react';

import { ChainKind } from '@/features/swap/types';
import { useUserWallets } from '@/providers/user-wallets-provider';

// MEMO: didn't find a best way to fetch TRON balance yet
export function useTronBalance() {
  const { userConnectedWallets } = useUserWallets();
  const connectedTronWallet = userConnectedWallets[ChainKind.TRON];
  const address = connectedTronWallet?.address;

  const fetchBalance = React.useCallback(async () => {
    return {
      floatBalance: undefined,
      bigIntBalance: undefined,
    };
    // if (!address) {
    //   return '0';
    // }
    // try {
    //   const tronWeb = new TronWeb({
    //     fullHost: 'https://api.trongrid.io',
    //   });
    //   const balanceInSun = await tronWeb.trx.getBalance(address);
    //   console.log('balanceInSun', balanceInSun);
    //   const balanceInTrx = tronWeb.fromSun(balanceInSun);
    //   return balanceInTrx.toString();
    // } catch (error) {
    //   console.error('Error fetching TRON balance:', error);
    //   return '0';
    // }
  }, [address]);

  return { fetchBalance };
}
