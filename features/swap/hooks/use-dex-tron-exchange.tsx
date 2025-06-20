import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { useTranslations } from 'next-intl';

import { useConfirmTransaction } from '@/features/swap/hooks/use-confirm-transaction';
import { useSwapUrlParams } from '@/features/swap/hooks/use-swap-url-params';
import {
  ChainKind,
  DexExchangeStatus,
  RouteProtocol,
} from '@/features/swap/types';
import { HandleWalletConnectionProps } from '@/features/wallet/constants';
import { Route, useDexExchangeMutation } from '@/graphql/generated';

interface DexTronExchangeParams {
  tokenIdFrom: string;
  tokenIdTo: string;
  route: Route | undefined;
  sendAmount: number;
  addressTo: string;
  onStatusChange: (status: DexExchangeStatus) => void;
  setHoudiniId: (houdiniId: string) => void;
  handleWalletConnection: (props: HandleWalletConnectionProps) => void;
}

export const useDexTronExchange = ({
  tokenIdFrom,
  tokenIdTo,
  route,
  sendAmount,
  addressTo,
  onStatusChange,
  setHoudiniId,
  handleWalletConnection,
}: DexTronExchangeParams) => {
  const { signTransaction, wallet } = useWallet();
  const { confirmTransaction } = useConfirmTransaction();
  const { memo } = useSwapUrlParams();
  const t = useTranslations('swap');
  const [dexExchangeMutation] = useDexExchangeMutation({
    variables: {
      tokenIdFrom,
      tokenIdTo,
      amount: sendAmount,
      addressFrom: wallet?.adapter.address ?? '',
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
  const startDexTronExchange = async () => {
    if (!wallet?.adapter.address || !signTransaction) {
      handleWalletConnection({ chainNamespace: ChainKind.TRON });
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

        // For Tron, the transaction data is typically in a specific format
        // that needs to be properly parsed based on the protocol
        let transactionConfig;

        if (route?.swap === RouteProtocol.DL) {
          // Handle DL (DEX) protocol specific transaction format
          transactionConfig = JSON.parse(metadata.data);
        } else {
          // Handle other protocols (assuming they follow a standard format)
          transactionConfig = {
            ...JSON.parse(metadata.data),
            // Add any additional Tron-specific transaction parameters if needed
          };
        }

        try {
          // Sign and send the transaction
          const txHash = await signTransaction(transactionConfig);

          if (!txHash) {
            throw new Error(t('errors.transactionHashMissing'));
          }

          // Confirm the transaction
          await confirmTransaction({
            txHash,
            houdiniId: data?.dexExchange?.order?.houdiniId ?? '',
            onStatusChange,
          });

          onStatusChange(DexExchangeStatus.SUCCESS);
        } catch (error) {
          console.error('tronSignTransaction', error);
          throw error;
        }
      }
    } catch (error) {
      onStatusChange(DexExchangeStatus.ERROR);
      throw error;
    }
  };

  return { startDexTronExchange };
};
