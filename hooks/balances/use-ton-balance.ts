import { useTonConnectUI } from '@tonconnect/ui-react';
import React from 'react';

interface Props {
  tokenAddress?: string;
  isNative: boolean;
}

export function useTONBalance({ isNative, tokenAddress }: Props) {
  const [tonConnect] = useTonConnectUI();
  const fetchBalance = React.useCallback(async () => {
    if (!tonConnect.connected || !tonConnect.account) {
      return {
        floatBalance: undefined,
        bigIntBalance: undefined,
      };
    }

    try {
      // Currently only supporting native TON balance
      // MEMO: https://toncenter.com/api/v2/
      if (!isNative) {
        return {
          floatBalance: undefined,
          bigIntBalance: undefined,
        };
      }

      const response = await fetch(
        `/api/balance/ton?address=${tonConnect.account.address}`
      );
      const data = await response.json();

      if (!data.ok) {
        throw new Error('Failed to fetch balance');
      }

      const balanceBigInt = data.result;

      // TON uses 9 decimals
      const TON_DECIMALS = 9;
      const balance = Number(balanceBigInt) / 10 ** TON_DECIMALS;

      return {
        floatBalance: balance,
        bigIntBalance: balanceBigInt,
      };
    } catch (error) {
      console.error('Error fetching TON balance:', error);
      return {
        floatBalance: undefined,
        bigIntBalance: undefined,
      };
    }
  }, [tonConnect.connected, tonConnect.account, isNative]);

  return { fetchBalance };
}
