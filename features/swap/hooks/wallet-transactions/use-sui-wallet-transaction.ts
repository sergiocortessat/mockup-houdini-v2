import {
  useCurrentAccount,
  useCurrentWallet,
  useSignAndExecuteTransaction,
  useSuiClient,
} from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { useTranslations } from 'next-intl';

import { Token } from '@/graphql/generated';

interface SuiWalletTransactionParams {
  token: Token;
  amount: number;
  toAddress: string;
  handleTransactionSent: (walletName: string | undefined) => Promise<void>;
}

export function useSuiWalletTransaction() {
  const t = useTranslations('swap.errors');

  const currentAccount = useCurrentAccount();
  const currentWallet = useCurrentWallet();
  const client = useSuiClient();

  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction({
    execute: async ({ bytes, signature }) =>
      await client.executeTransactionBlock({
        transactionBlock: bytes,
        signature,
        options: {
          showRawEffects: true,
          showObjectChanges: true,
        },
      }),
  });

  const send = async ({
    token,
    amount,
    toAddress,
    handleTransactionSent,
  }: SuiWalletTransactionParams) => {
    if (!toAddress) {
      throw new Error(t('recipientAddressRequired'));
    }

    if (amount <= 0) {
      throw new Error(t('amountMustBeGreaterThanZero'));
    }

    if (!currentAccount?.address) {
      throw new Error(t('walletNotConnectedOrChainNotSelected'));
    }

    const tx = new Transaction();
    try {
      const isNativeToken = token.mainnet;

      if (isNativeToken) {
        const mistAmount = Math.floor(amount * 1e9).toString();
        // Split from gas (native SUI)
        const [coin] = tx.splitCoins(tx.gas, [mistAmount]);

        // Transfer to recipient
        tx.transferObjects([coin], tx.pure.address(toAddress));
      } else {
        // Token transfer
        if (!token.address) {
          throw new Error(t('tokenAddressRequired'));
        }

        const coins = await client.getCoins({
          owner: currentAccount.address,
          coinType: token.address,
        });
        const inputCoins = coins.data.map((coin) =>
          tx.object(coin.coinObjectId)
        );
        const primaryCoin = inputCoins[0];

        if (inputCoins.length > 1) {
          tx.mergeCoins(primaryCoin, inputCoins.slice(1));
        }

        const decimals = token.decimals;
        if (!decimals) {
          throw new Error(t('tokenDecimalsRequired'));
        }
        const amountInSmallestUnit = BigInt(
          Math.floor(amount * 10 ** decimals)
        );
        // Step 3: Split the amount to send
        const [coinToSend] = tx.splitCoins(primaryCoin, [amountInSmallestUnit]);

        // Step 4: Transfer to recipient
        tx.transferObjects([coinToSend], tx.pure.address(toAddress));
      }
      return new Promise((resolve, reject) => {
        signAndExecuteTransaction(
          {
            transaction: tx,
            chain: 'sui:mainnet',
          },
          {
            onSuccess: async (result) => {
              await handleTransactionSent(currentWallet?.currentWallet?.name);
              resolve(result.digest);
            },
            onError: (error) => {
              reject(error);
            },
          }
        );
      });
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  };

  return { send };
}
