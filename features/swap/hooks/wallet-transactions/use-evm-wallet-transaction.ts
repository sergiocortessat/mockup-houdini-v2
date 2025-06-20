import { useAppKitNetwork } from '@reown/appkit/react';
import { useTranslations } from 'next-intl';
import { erc20Abi, parseUnits } from 'viem';
import {
  useAccount,
  useSendTransaction,
  useSwitchChain,
  useWalletClient,
} from 'wagmi';

import { getViemPublicClient } from '@/features/swap/utils/evm-helpers';
import { Token } from '@/graphql/generated';

interface EVMWalletTransactionParams {
  token: Token;
  amount: number;
  toAddress: string;
  handleTransactionSent: (walletName: string | undefined) => Promise<void>;
}

export function useEVMWalletTransaction() {
  const t = useTranslations('swap.errors');
  const { address, chainId, connector } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { sendTransactionAsync } = useSendTransaction();
  const { switchChainAsync } = useSwitchChain();

  const send = async ({
    token,
    amount,
    toAddress,
    handleTransactionSent,
  }: EVMWalletTransactionParams) => {
    if (!address || !chainId) {
      throw new Error(t('walletNotConnectedOrChainNotSelected'));
    }

    if (!toAddress) {
      throw new Error(t('recipientAddressRequired'));
    }

    if (amount <= 0) {
      throw new Error(t('amountMustBeGreaterThanZero'));
    }
    if (!token.chainData.chainId) {
      throw new Error(t('tokenChainIdRequired'));
    }

    const isNativeToken = token.mainnet;
    const { publicClient, chain } = getViemPublicClient(
      token.chainData.chainId
    );
    if (token.chainData.chainId !== chainId) {
      await switchChainAsync(chain);
    }
    let tx: `0x${string}` | undefined;
    try {
      if (isNativeToken) {
        tx = await sendTransactionAsync({
          to: toAddress as `0x${string}`,
          value: parseUnits(amount.toString(), 18),
          chainId: token.chainData.chainId,
        });
        await handleTransactionSent(connector?.name);
      } else {
        // ERC20 Token Transfer
        if (!token.address) {
          throw new Error(t('tokenAddressRequired'));
        }

        const tokenAddress = token.address as `0x${string}`;
        const decimals = token.decimals;
        if (!decimals) {
          throw new Error(t('tokenDecimalsRequired'));
        }

        if (!walletClient) {
          throw new Error(t('walletClientNotInitialized'));
        }

        const value = parseUnits(amount.toString(), decimals);

        tx = await walletClient.writeContract({
          address: tokenAddress,
          abi: erc20Abi,
          functionName: 'transfer',
          args: [toAddress as `0x${string}`, value],
          chain: chain,
          account: address,
        });
      }

      await publicClient.waitForTransactionReceipt({
        hash: tx,
      });
      await handleTransactionSent(connector?.name);
      return tx;
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error instanceof Error ? error : new Error(t('transactionFailed'));
    }
  };

  return { send };
}
