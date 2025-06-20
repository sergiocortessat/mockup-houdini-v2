import {
  TX_CONFIRMATION_MAX_RETRIES,
  TX_CONFIRMATION_RETRY_DELAY_MS,
} from '@/features/swap/constants';
import { DexExchangeStatus } from '@/features/swap/types';
import { useConfirmTxMutation } from '@/graphql/generated';

export const useConfirmTransaction = () => {
  const [confirmTxMutation] = useConfirmTxMutation();
  const confirmTransaction = async ({
    txHash,
    houdiniId,
    maxRetries = TX_CONFIRMATION_MAX_RETRIES,
    retryDelay = TX_CONFIRMATION_RETRY_DELAY_MS,
    onStatusChange,
  }: {
    txHash: `0x${string}` | string | undefined;
    houdiniId: string;
    maxRetries?: number;
    retryDelay?: number;
    onStatusChange: (status: DexExchangeStatus) => void;
  }) => {
    onStatusChange(DexExchangeStatus.CONFIRMING);

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await confirmTxMutation({
          variables: {
            id: houdiniId ?? '',
            txHash,
          },
        });

        if (result.data?.confirmTx) {
          return true;
        }
        throw new Error('Transaction confirmation failed');
      } catch (error) {
        if (attempt === maxRetries) {
          console.error(
            'Max retries reached for transaction confirmation:',
            error
          );
          onStatusChange(DexExchangeStatus.ERROR);
          throw new Error(
            `Failed to confirm transaction after ${maxRetries} attempts`
          );
        } else {
          console.log(
            `Confirmation attempt ${attempt} failed, retrying in ${retryDelay}ms`
          );
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
      }
    }
  };

  return { confirmTransaction };
};
