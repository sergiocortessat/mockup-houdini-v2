import { useAppKitAccount } from '@reown/appkit/react';
import React from 'react';
import { useBalance } from 'wagmi';

import { Maybe } from '@/graphql/generated';

interface Props {
  tokenAddress: string;
  chainId: Maybe<number> | undefined;
  isNative: boolean;
}

export function useEVMBalance({ tokenAddress, chainId, isNative }: Props): {
  fetchBalance: () => Promise<{
    floatBalance: number | undefined;
    bigIntBalance: bigint | undefined;
  }>;
} {
  const { address } = useAppKitAccount({ namespace: 'eip155' });
  const { refetch } = useBalance({
    address: address as `0x${string}`,
    token: isNative ? undefined : (tokenAddress as `0x${string}`),
    chainId: chainId || undefined,
  });

  const fetchBalance = React.useCallback(async () => {
    if (!address) {
      return {
        floatBalance: undefined,
        bigIntBalance: undefined,
      };
    }
    const result = await refetch();
    return {
      floatBalance: Number(result.data?.formatted) ?? undefined,
      bigIntBalance: result.data?.value ?? undefined,
    };
  }, [refetch, address]);

  return {
    fetchBalance,
  };
}
