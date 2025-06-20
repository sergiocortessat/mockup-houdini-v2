import { BitcoinConnector } from '@reown/appkit-adapter-bitcoin';
import { useAppKitNetwork, useAppKitProvider } from '@reown/appkit/react';
import { useAppKitAccount } from '@reown/appkit/react';

import { useConfirmTransaction } from '@/features/swap/hooks/use-confirm-transaction';
import { useSwapUrlParams } from '@/features/swap/hooks/use-swap-url-params';
import { ChainKind, DexExchangeStatus } from '@/features/swap/types';
import { BitcoinUtil } from '@/features/swap/utils/bitcoin-helpers';
import { HandleWalletConnectionProps } from '@/features/wallet/constants';
import { Route } from '@/graphql/generated';
import { useDexExchangeMutation } from '@/graphql/generated';

interface DexBTCExchangeParams {
  tokenIdFrom: string;
  tokenIdTo: string;
  route: Route | undefined;
  sendAmount: number;
  addressTo: string;
  onStatusChange: (status: DexExchangeStatus) => void;
  setHoudiniId: (houdiniId: string) => void;
  handleWalletConnection: (props: HandleWalletConnectionProps) => void;
}

export const useDexBTCExchange = ({
  tokenIdFrom,
  tokenIdTo,
  route,
  sendAmount,
  addressTo,
  onStatusChange,
  setHoudiniId,
  handleWalletConnection,
}: DexBTCExchangeParams) => {
  const { memo } = useSwapUrlParams();
  const { walletProvider } = useAppKitProvider<BitcoinConnector>('bip122');
  const { address } = useAppKitAccount({ namespace: 'bip122' });
  const { caipNetwork } = useAppKitNetwork();
  const { confirmTransaction } = useConfirmTransaction();
  const [dexExchangeMutation] = useDexExchangeMutation({
    variables: {
      tokenIdFrom,
      tokenIdTo,
      amount: sendAmount,
      addressFrom: address ?? '',
      route: route?.raw,
      addressTo,
      swap: route?.swap ?? '',
      quoteId: route?.quoteId ?? '',
      destinationTag: memo ?? '',
    },
    onCompleted: (data) => {
      setHoudiniId(data?.dexExchange?.order?.houdiniId ?? '');
    },
  });

  const startDexBTCExchange = async () => {
    if (!address || !walletProvider) {
      handleWalletConnection({ chainNamespace: ChainKind.BTC });
      return;
    }

    if (!tokenIdFrom || !tokenIdTo || !route || !caipNetwork) {
      throw new Error('errors.missingExchangeParams');
    }

    try {
      onStatusChange(DexExchangeStatus.SWAPPING);
      const { data } = await dexExchangeMutation();

      if (!data?.dexExchange?.order?.metadata) {
        throw new Error('errors.exchangeOrderFailed');
      }

      const metadata = data.dexExchange.order.metadata.meta;
      console.log('metadata', metadata);

      const feeRate = await BitcoinUtil.getFeeRate().catch(() => {
        throw new Error('errors.feeRateUnavailable');
      });

      const utxos = await BitcoinUtil.getUTXOs(
        address,
        caipNetwork?.caipNetworkId
      ).catch(() => {
        throw new Error('errors.utxoFetchFailed');
      });

      const amount = Number(metadata.amount.amount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error('errors.invalidAmount');
      }

      const psbtParams = BitcoinUtil.createSignPSBTParams({
        senderAddress: metadata.from,
        recipientAddress: metadata.recipient,
        amount,
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

      console.log('signedPSBT', signedPSBT);

      // Validate the signed PSBT
      if (!BitcoinUtil.validatePSBT(signedPSBT)) {
        throw new Error('errors.invalidSignedPSBT');
      }

      // Finalize the PSBT
      const finalizedPsbt = BitcoinUtil.finalizePSBT(signedPSBT);

      // Extract the raw transaction in hex format
      const rawTx = finalizedPsbt.extractTransaction().toHex();
      console.log('Raw Transaction:', rawTx);

      // Broadcast the transaction
      const broadcastResult = await BitcoinUtil.broadcastTransaction(rawTx);
      console.log('Broadcast Result:', broadcastResult);

      await confirmTransaction({
        txHash: broadcastResult,
        houdiniId: data?.dexExchange?.order?.houdiniId ?? '',
        onStatusChange,
      });

      onStatusChange(DexExchangeStatus.SUCCESS);
    } catch (error) {
      onStatusChange(DexExchangeStatus.ERROR);
      console.error('Failed to start exchange:', error);
      throw error;
    }
  };

  return { startDexBTCExchange };
};
