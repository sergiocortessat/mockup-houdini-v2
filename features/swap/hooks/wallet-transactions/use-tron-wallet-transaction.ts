import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { useTranslations } from 'next-intl';

import { Token } from '@/graphql/generated';

interface TronWalletTransactionParams {
  token: Token;
  amount: number;
  toAddress: string;
  senderTag: string | undefined | null;
  handleTransactionSent: (walletName: string | undefined) => Promise<void>;
}

export function useTronWalletTransaction() {
  const t = useTranslations('swap.errors');
  const { wallet, select } = useWallet();
  const send = async ({
    token,
    amount,
    toAddress,
    senderTag,
    handleTransactionSent,
  }: TronWalletTransactionParams) => {
    const tronWeb = window.tronWeb;
    if (!tronWeb) {
      throw new Error('TronWeb is not initialized');
    }
    if (!toAddress) {
      throw new Error(t('recipientAddressRequired'));
    }

    if (amount <= 0) {
      throw new Error(t('amountMustBeGreaterThanZero'));
    }

    if (!wallet?.adapter.address) {
      throw new Error(t('walletNotConnectedOrChainNotSelected'));
    }
    if (wallet?.adapter.name) {
      select(wallet?.adapter.name);
    }
    try {
      const isNativeToken = token.mainnet;
      let signedTransaction;
      if (isNativeToken) {
        const unsignedTransaction = await tronWeb.transactionBuilder.sendTrx(
          toAddress,
          amount * Math.pow(10, 6),
          wallet?.adapter.address,
          {
            blockHeader: {
              data: senderTag,
            },
          }
        );

        signedTransaction =
          await wallet?.adapter.signTransaction(unsignedTransaction);
        const txHash = await tronWeb.trx.sendRawTransaction(signedTransaction);
        await handleTransactionSent(wallet?.adapter.name);
        if (!txHash) {
          throw new Error('Transaction hash missing');
        }

        return txHash;
      } else {
        // TRC20 Token transfer
        if (!token.address) {
          throw new Error(t('tokenAddressRequired'));
        }
        const contract = await tronWeb.contract().at(token.address);
        const decimals = token.decimals;
        if (!decimals) {
          throw new Error(t('tokenDecimalsRequired'));
        }

        const transaction = await contract
          .transfer(toAddress, amount * Math.pow(10, decimals))
          .send();
        await handleTransactionSent(wallet?.adapter.name);

        return transaction;
      }
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error instanceof Error ? error : new Error('Transaction failed');
    }
  };

  return { send };
}
