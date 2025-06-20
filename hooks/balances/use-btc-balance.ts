import { useAppKitAccount } from '@reown/appkit/react';
import React from 'react';

// MEMO: https://docs.reown.com/appkit/recipes/bitcoin-send-transaction
export function useBTCBalance() {
  const { address } = useAppKitAccount({ namespace: 'bip122' });

  const fetchBalance = React.useCallback(async () => {
    if (!address) {
      return {
        floatBalance: undefined,
        bigIntBalance: undefined,
      };
    }
    const response = await fetch(
      `https://mempool.space/api/address/${address}/utxo`
    );
    const data = await response.json();

    if (!data || !Array.isArray(data)) {
      return {
        floatBalance: undefined,
        bigIntBalance: undefined,
      };
    }

    const balance = data.reduce((sum, utxo) => sum + (utxo.value || 0), 0);
    const btcBalance = balance / 100000000;
    return {
      floatBalance: btcBalance,
      bigIntBalance: balance,
    };
  }, [address]);

  return { fetchBalance };
}
