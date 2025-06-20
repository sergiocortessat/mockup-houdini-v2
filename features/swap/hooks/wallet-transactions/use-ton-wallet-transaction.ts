import { Address, beginCell, toNano } from '@ton/core';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { useTranslations } from 'next-intl';

import { Token } from '@/graphql/generated';

interface TonWalletTransactionParams {
  token: Token;
  amount: number;
  toAddress: string;
  senderTag: string | undefined | null;
  handleTransactionSent: (walletName: string | undefined) => Promise<void>;
}

export function useTonWalletTransaction() {
  const t = useTranslations('swap.errors');
  const [tonConnectUI] = useTonConnectUI();

  const send = async ({
    token,
    amount,
    toAddress,
    senderTag,
    handleTransactionSent,
  }: TonWalletTransactionParams) => {
    if (!toAddress) {
      throw new Error(t('recipientAddressRequired'));
    }

    if (amount <= 0) {
      throw new Error(t('amountMustBeGreaterThanZero'));
    }

    if (!tonConnectUI.connected) {
      throw new Error(t('walletNotConnectedOrChainNotSelected'));
    }

    try {
      const isNativeToken = token.mainnet;

      if (isNativeToken) {
        // Native TON transfer
        const amountNanoTon = BigInt(Math.floor(amount * 1e9)).toString();

        const transaction = {
          validUntil: Math.floor(Date.now() / 1000) + 300, // 5 min
          messages: [
            {
              address: toAddress,
              amount: amountNanoTon,
              payload: senderTag ? senderTag : undefined,
            },
          ],
        };

        const result = await tonConnectUI.sendTransaction(transaction);
        const walletName = (tonConnectUI as any)?.walletInfo?.name;
        await handleTransactionSent(walletName);
        return result.boc;
      } else {
        // Jetton (TON token) transfer
        if (!token.address) {
          throw new Error(t('tokenAddressRequired'));
        }

        if (!token.decimals) {
          throw new Error(t('tokenDecimalsRequired'));
        }

        const jettonWalletAddress = Address.parse(token.address);
        const decimals = token.decimals;
        const amountInSmallestUnit = BigInt(
          Math.floor(amount * 10 ** decimals)
        );

        // Create jetton transfer payload
        const jettonTransferPayload = beginCell()
          .storeUint(0xf8a7ea5, 32) // jetton transfer op code
          .storeUint(0, 64) // query id
          .storeCoins(amountInSmallestUnit) // jetton amount
          .storeAddress(Address.parse(toAddress)) // destination address
          .storeAddress(null) // response destination (null = sender)
          .storeBit(false) // custom payload flag
          .storeCoins(toNano('0.001')) // forward amount for notification
          .storeBit(false) // forward payload flag
          .endCell();

        const transaction = {
          validUntil: Math.floor(Date.now() / 1000) + 300, // 5 min
          messages: [
            {
              address: jettonWalletAddress.toString(),
              amount: toNano('0.05').toString(), // Gas fee for jetton transfer
              payload: jettonTransferPayload.toBoc().toString('base64'),
            },
          ],
        };

        const result = await tonConnectUI.sendTransaction(transaction);
        const walletName = (tonConnectUI as any)?.walletInfo?.name;
        await handleTransactionSent(walletName);
        return result.boc;
      }
    } catch (error) {
      console.error('TON transaction failed:', error);
      throw error instanceof Error ? error : new Error(t('transactionFailed'));
    }
  };

  return { send };
}
