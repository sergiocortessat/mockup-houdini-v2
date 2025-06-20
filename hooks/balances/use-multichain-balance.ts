import React, { useEffect, useState } from 'react';

import { ChainKind } from '@/features/swap/types';
import { useBTCBalance } from '@/hooks/balances/use-btc-balance';
import { useEVMBalance } from '@/hooks/balances/use-evm-balance';
import { useSOLBalance } from '@/hooks/balances/use-sol-balance';
import { useSUIBalance } from '@/hooks/balances/use-sui-balance';
import { useTONBalance } from '@/hooks/balances/use-ton-balance';

interface Props {
  tokenAddress: string;
  chainId: number | null | undefined;
  chainKind: ChainKind;
  isNative: boolean;
}

export const useMultichainBalance = ({
  tokenAddress,
  chainId,
  chainKind,
  isNative,
}: Props) => {
  const [balance, setBalance] = useState<string | undefined>();
  const [bigIntBalance, setBigIntBalance] = useState<bigint | undefined>();
  const { fetchBalance: fetchEVMBalance } = useEVMBalance({
    tokenAddress,
    chainId,
    isNative,
  });

  const { fetchBalance: fetchSOLBalance } = useSOLBalance({
    tokenAddress,
    isNative,
  });

  const { fetchBalance: fetchSUIBalance } = useSUIBalance({
    tokenAddress,
    isNative,
  });
  const { fetchBalance: fetchBTCCBalance } = useBTCBalance();
  const { fetchBalance: fetchTONBalance } = useTONBalance({
    isNative,
    tokenAddress,
  });
  const fetchBalance = React.useCallback(async () => {
    try {
      switch (chainKind) {
        case ChainKind.SOLANA: {
          const { floatBalance, bigIntBalance } = await fetchSOLBalance();
          setBalance(floatBalance?.toString());
          setBigIntBalance(bigIntBalance);
          break;
        }
        case ChainKind.EVM: {
          const evmBalance = await fetchEVMBalance();
          setBalance(evmBalance.floatBalance?.toString());
          setBigIntBalance(evmBalance.bigIntBalance);
          break;
        }
        case ChainKind.SUI: {
          const suiBalance = await fetchSUIBalance();
          setBalance(suiBalance.floatBalance?.toString());
          setBigIntBalance(suiBalance.bigIntBalance);
          break;
        }
        case ChainKind.BTC: {
          const btcBalance = await fetchBTCCBalance();
          setBalance(btcBalance.floatBalance?.toString());
          setBigIntBalance(btcBalance.bigIntBalance);
          break;
        }
        case ChainKind.TRON: {
          setBalance(undefined);
          setBigIntBalance(undefined);
          break;
        }
        case ChainKind.TON: {
          const tonBalance = await fetchTONBalance();
          setBalance(tonBalance.floatBalance?.toString());
          setBigIntBalance(tonBalance.bigIntBalance);
          break;
        }
        default:
          break;
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
      setBalance(undefined);
      setBigIntBalance(undefined);
    }
  }, [
    chainKind,
    fetchSOLBalance,
    fetchEVMBalance,
    fetchSUIBalance,
    fetchBTCCBalance,
    fetchTONBalance,
  ]);

  useEffect(() => {
    fetchBalance();
  }, [chainId, tokenAddress, fetchBalance, chainKind]);

  return { balance, bigIntBalance };
};
