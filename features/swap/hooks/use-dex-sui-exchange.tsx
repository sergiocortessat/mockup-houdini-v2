import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from '@mysten/dapp-kit';

import { useConfirmTransaction } from '@/features/swap/hooks/use-confirm-transaction';
import { useSwapUrlParams } from '@/features/swap/hooks/use-swap-url-params';
import { ChainKind, DexExchangeStatus } from '@/features/swap/types';
import { HandleWalletConnectionProps } from '@/features/wallet/constants';
import { Route, useDexExchangeMutation } from '@/graphql/generated';

interface DexSuiExchangeParams {
  tokenIdFrom: string;
  tokenIdTo: string;
  route: Route | undefined;
  sendAmount: number;
  addressTo: string;
  onStatusChange: (status: DexExchangeStatus) => void;
  setHoudiniId: (houdiniId: string) => void;
  handleWalletConnection: (props: HandleWalletConnectionProps) => void;
}

export const useDexSuiExchange = ({
  tokenIdFrom,
  tokenIdTo,
  route,
  sendAmount,
  addressTo,
  onStatusChange,
  setHoudiniId,
  handleWalletConnection,
}: DexSuiExchangeParams) => {
  const currentAccount = useCurrentAccount();
  const client = useSuiClient();
  const { memo } = useSwapUrlParams();

  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction({
    execute: async ({ bytes, signature }) =>
      await client.executeTransactionBlock({
        transactionBlock: bytes,
        signature,
        options: {
          // Raw effects are required so the effects can be reported back to the wallet
          showRawEffects: true,
          // Select additional data to return
          showObjectChanges: true,
        },
      }),
  });
  const { confirmTransaction } = useConfirmTransaction();

  const [dexExchangeMutation] = useDexExchangeMutation({
    variables: {
      tokenIdFrom,
      tokenIdTo,
      amount: sendAmount,
      addressFrom: currentAccount?.address ?? '',
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

  const startDexSuiExchange = async () => {
    if (!currentAccount?.address) {
      handleWalletConnection({ chainNamespace: ChainKind.SUI });
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

        try {
          const parsedData = metadata.data;
          const transactionData = Buffer.from(parsedData, 'base64').toString(
            'utf-8'
          );

          signAndExecuteTransaction(
            {
              transaction: transactionData,
              chain: 'sui:mainnet' as `${string}:${string}`,
            },
            {
              onSuccess: async (result) => {
                await confirmTransaction({
                  txHash: result.digest,
                  houdiniId: data?.dexExchange?.order?.houdiniId ?? '',
                  onStatusChange,
                });
                onStatusChange(DexExchangeStatus.SUCCESS);
              },
              onError: (error) => {
                onStatusChange(DexExchangeStatus.ERROR);
                throw error;
              },
            }
          );
        } catch (error) {
          onStatusChange(DexExchangeStatus.ERROR);
          throw error;
        }
      }
    } catch (error) {
      onStatusChange(DexExchangeStatus.ERROR);
      throw error;
    }
  };

  return { startDexSuiExchange };
};
