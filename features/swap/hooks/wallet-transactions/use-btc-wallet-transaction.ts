import { BitcoinConnector } from '@reown/appkit-adapter-bitcoin';
import { useAppKitNetwork, useAppKitProvider } from '@reown/appkit/react';
import { useAppKitAccount } from '@reown/appkit/react';
import { useTranslations } from 'next-intl';

import { BitcoinUtil } from '@/features/swap/utils/bitcoin-helpers';

interface BTCWalletTransactionParams {
  amount: number;
  toAddress: string;
  handleTransactionSent: (walletName: string | undefined) => Promise<void>;
}

export function useBTCWalletTransaction() {
  const t = useTranslations('swap.errors');
  const { walletProvider } = useAppKitProvider<BitcoinConnector>('bip122');
  const { address } = useAppKitAccount({ namespace: 'bip122' });
  const { caipNetwork } = useAppKitNetwork();

  const send = async ({
    amount,
    toAddress,
    handleTransactionSent,
  }: BTCWalletTransactionParams) => {
    if (!toAddress) {
      throw new Error(t('recipientAddressRequired'));
    }

    if (amount <= 0) {
      throw new Error(t('amountMustBeGreaterThanZero'));
    }

    if (!walletProvider) {
      throw new Error(t('walletNotConnectedOrChainNotSelected'));
    }

    if (!caipNetwork) {
      throw new Error(t('walletNotConnectedOrChainNotSelected'));
    }

    try {
      const feeRate = await BitcoinUtil.getFeeRate().catch(() => {
        throw new Error('errors.feeRateUnavailable');
      });
      const utxos = await BitcoinUtil.getUTXOs(
        address as string,
        caipNetwork?.caipNetworkId
      ).catch(() => {
        throw new Error('errors.utxoFetchFailed');
      });
      const amountInSatoshi = BitcoinUtil.convertToSatoshi(amount);
      const psbtParams = BitcoinUtil.createSignPSBTParams({
        senderAddress: address as string,
        recipientAddress: toAddress,
        amount: amountInSatoshi,
        network: caipNetwork,
        utxos,
        feeRate,
      });
      // Sign the PSBT
      const { psbt: signedPSBT } = await walletProvider
        .signPSBT({
          ...psbtParams,
          broadcast: false,
        })
        .catch((error) => {
          console.error('PSBT Signing Error:', error);
          throw new Error('errors.psbtSigningFailed');
        });

      // Validate the signed PSBT
      if (!BitcoinUtil.validatePSBT(signedPSBT)) {
        throw new Error('errors.invalidSignedPSBT');
      }

      // Finalize the PSBT
      const finalizedPsbt = BitcoinUtil.finalizePSBT(signedPSBT);

      // Extract the raw transaction in hex format
      const rawTx = finalizedPsbt.extractTransaction().toHex();

      // Broadcast the transaction
      const txHash = await BitcoinUtil.broadcastTransaction(rawTx);
      const walletName = (walletProvider as any)?.name;
      await handleTransactionSent(walletName);

      return txHash;
    } catch (error) {
      throw error;
    }
  };

  return { send };
}
