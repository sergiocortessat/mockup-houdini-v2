import { useTonConnectUI } from '@tonconnect/ui-react';

import { useConfirmTransaction } from '@/features/swap/hooks/use-confirm-transaction';
import { useSwapUrlParams } from '@/features/swap/hooks/use-swap-url-params';
import {
  ChainKind,
  DexExchangeStatus,
  RouteProtocol,
} from '@/features/swap/types';
import { HandleWalletConnectionProps } from '@/features/wallet/constants';
import { Route, useDexExchangeMutation } from '@/graphql/generated';

interface DexTonExchangeParams {
  tokenIdFrom: string;
  tokenIdTo: string;
  route: Route | undefined;
  sendAmount: number;
  addressTo: string;
  onStatusChange: (status: DexExchangeStatus) => void;
  setHoudiniId: (houdiniId: string) => void;
  handleWalletConnection: (props: HandleWalletConnectionProps) => void;
}

export const useDexTonExchange = ({
  tokenIdFrom,
  tokenIdTo,
  route,
  sendAmount,
  addressTo,
  onStatusChange,
  setHoudiniId,
  handleWalletConnection,
}: DexTonExchangeParams) => {
  const [tonConnectUI] = useTonConnectUI();
  const { confirmTransaction } = useConfirmTransaction();
  const { memo } = useSwapUrlParams();
  const [dexExchangeMutation] = useDexExchangeMutation({
    variables: {
      tokenIdFrom,
      tokenIdTo,
      amount: sendAmount,
      addressFrom: tonConnectUI.account?.address ?? '',
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

  const startDexTonExchange = async () => {
    if (!tonConnectUI.account?.address) {
      handleWalletConnection({ chainNamespace: ChainKind.TON });
      return;
    }

    if (!tokenIdFrom || !tokenIdTo || !route) {
      return;
    }

    try {
      onStatusChange(DexExchangeStatus.SWAPPING);
      const { data } = await dexExchangeMutation();

      if (data?.dexExchange) {
        const metadata = data?.dexExchange?.order?.metadata;

        // Parse the transaction data based on the protocol
        let transactionConfig;

        if (route?.swap === RouteProtocol.DL) {
          transactionConfig = JSON.parse(metadata.data);
        } else {
          transactionConfig = {
            ...JSON.parse(metadata.data),
            // TON transactions typically require validUntil
            validUntil: Math.floor(Date.now() / 1000) + 300, // 5 minutes from now
          };
        }

        try {
          const tx = await tonConnectUI.sendTransaction(transactionConfig);

          if (!tx.boc) {
            throw new Error('errors.transactionHashMissing');
          }

          await confirmTransaction({
            txHash: tx.boc,
            houdiniId: data?.dexExchange?.order?.houdiniId ?? '',
            onStatusChange,
          });

          onStatusChange(DexExchangeStatus.SUCCESS);
        } catch (error) {
          console.error('tonSignTransaction', error);
          throw error;
        }
      }
    } catch (error) {
      onStatusChange(DexExchangeStatus.ERROR);
      throw error;
    }
  };

  return { startDexTonExchange };
};
