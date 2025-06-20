import { solana } from '@reown/appkit/networks';
import { useAppKitAccount } from '@reown/appkit/react';
import { getMint } from '@solana/spl-token';
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import React from 'react';

import { getAlchemyRPCUrl } from '@/constants/alchemy';

interface Props {
  tokenAddress: string;
  isNative: boolean;
}

export function useSOLBalance({ tokenAddress, isNative }: Props): {
  fetchBalance: () => Promise<{
    floatBalance: number | undefined;
    bigIntBalance: bigint | undefined;
  }>;
} {
  const { address } = useAppKitAccount({ namespace: 'solana' });

  const alchemyUrl = getAlchemyRPCUrl(solana.id);
  const connection = React.useMemo(() => {
    return alchemyUrl ? new Connection(alchemyUrl) : null;
  }, [alchemyUrl]);

  const fetchBalance = React.useCallback(async () => {
    if (!address || !connection) {
      return {
        floatBalance: undefined,
        bigIntBalance: undefined,
      };
    }
    const ownerPublicKey = new PublicKey(address ?? '');
    if (isNative) {
      const nativeBalanceBigInt = await connection.getBalance(ownerPublicKey);
      const nativeBalance = nativeBalanceBigInt / LAMPORTS_PER_SOL;
      return {
        floatBalance: nativeBalance,
        bigIntBalance: nativeBalanceBigInt,
      };
    }
    const tokenMintAddress = new PublicKey(tokenAddress);
    const mintInfo = await getMint(connection, tokenMintAddress);
    const tokenInDecimals = mintInfo.decimals;

    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      ownerPublicKey,
      { mint: tokenMintAddress }
    );

    const balanceBigInt =
      tokenAccounts.value.length > 0
        ? tokenAccounts.value[0].account.data.parsed.info.tokenAmount.amount
        : 0;

    const balance = balanceBigInt / 10 ** tokenInDecimals;
    return {
      floatBalance: balance,
      bigIntBalance: balanceBigInt,
    };
  }, [address, tokenAddress, isNative]);

  return { fetchBalance };
}
