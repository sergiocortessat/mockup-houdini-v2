import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import { SUI_TYPE_ARG } from '@mysten/sui/utils';
import { useCallback } from 'react';

interface Props {
  tokenAddress: string;
  isNative: boolean;
}

export function useSUIBalance({ tokenAddress, isNative }: Props) {
  const client = useSuiClient();
  const account = useCurrentAccount();

  const fetchBalance = useCallback(async () => {
    if (!account?.address) {
      return {
        floatBalance: undefined,
        bigIntBalance: undefined,
      };
    }

    if (isNative) {
      const nativeBalance = await client.getBalance({
        owner: account?.address,
        coinType: SUI_TYPE_ARG,
      });
      const totalNativeBalanceBigInt = nativeBalance.totalBalance;
      const totalNativeBalance = Number(totalNativeBalanceBigInt) / 10 ** 9;
      return {
        floatBalance: totalNativeBalance,
        bigIntBalance: BigInt(totalNativeBalanceBigInt),
      };
    }

    const balance = await client.getBalance({
      owner: account?.address,
      coinType: tokenAddress,
    });
    const tokenInfo = await client.getCoinMetadata({
      coinType: tokenAddress,
    });
    const tokenDecimals = tokenInfo?.decimals;
    if (!tokenDecimals) {
      return {
        floatBalance: undefined,
        bigIntBalance: undefined,
      };
    }
    const balanceBigInt = balance.totalBalance;
    const tokenBalance = Number(balanceBigInt) / 10 ** tokenDecimals;
    return {
      floatBalance: tokenBalance,
      bigIntBalance: BigInt(balanceBigInt),
    };
  }, [client, tokenAddress, account, isNative]);

  return { fetchBalance };
}
