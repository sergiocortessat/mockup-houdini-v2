import { useState } from 'react';
import {
  useAccount,
  useBalance,
  useSendTransaction,
  useSignTypedData,
  useSwitchChain,
} from 'wagmi';

import { useApprovalStatusChecker } from '@/features/swap/hooks/use-approval-status-checker';
import { useConfirmTransaction } from '@/features/swap/hooks/use-confirm-transaction';
import { useSwapUrlParams } from '@/features/swap/hooks/use-swap-url-params';
import {
  ChainKind,
  DexExchangeStatus,
  SignatureType,
} from '@/features/swap/types';
import {
  executeExchangeEVM,
  handleApprovals,
} from '@/features/swap/utils/evm-helpers';
import { HandleWalletConnectionProps } from '@/features/wallet/constants';
import {
  Route,
  useApproveQuery,
  useChainSignaturesLazyQuery,
  useDexExchangeMutation,
} from '@/graphql/generated';

interface DexEVMExchangeParams {
  tokenIdFrom: string;
  tokenIdTo: string;
  route: Route | undefined;
  sendAmount: number;
  addressTo: string;
  chainIdFrom: number;
  chainIdTo: number;
  onStatusChange: (status: DexExchangeStatus) => void;
  setHoudiniId: (houdiniId: string) => void;
  tokenInAddress: string;
  handleWalletConnection: (props: HandleWalletConnectionProps) => void;
}

export const useDexEVMExchange = ({
  tokenIdFrom,
  tokenIdTo,
  tokenInAddress,
  route,
  sendAmount,
  addressTo,
  chainIdFrom,
  onStatusChange,
  setHoudiniId,
  handleWalletConnection,
}: DexEVMExchangeParams) => {
  const [signatures, setSignatures] = useState<string[]>([]);
  const { address, chainId: currentChainId } = useAccount();
  const { memo } = useSwapUrlParams();
  const { switchChainAsync } = useSwitchChain();

  const [executeChainSignaturesQuery] = useChainSignaturesLazyQuery();

  const { confirmTransaction } = useConfirmTransaction();
  const { signTypedDataAsync } = useSignTypedData();
  const { sendTransactionAsync } = useSendTransaction({
    mutation: {
      onError: (e: any) => {
        console.error(
          e.details || 'Something went wrong while sending transaction'
        );
        console.error(
          e.details || 'Something went wrong while sending transaction',
          e
        );
      },
    },
  });

  const { refetch: getApprove, stopPolling: stopApprovePolling } =
    useApproveQuery({
      variables: {
        tokenIdFrom,
        tokenIdTo,
        amount: sendAmount,
        addressFrom: address ?? '',
        route: route?.raw,
        swap: route?.swap ?? '',
      },
      skip: true,
    });

  // Initialize the approval status checker hook
  const { startChecking: startApprovalStatusChecking } =
    useApprovalStatusChecker({
      getApprove,
      stopPollingApprove: stopApprovePolling,
      onStatusChange,
    });

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
      signatures,
      destinationTag: memo ?? '',
    },
  });

  // Process signatures including chained ones
  const processSignatures = async (signatures: any[]): Promise<string[]> => {
    if (!signatures || signatures.length === 0) {
      return [];
    }

    const results: string[] = [];

    for (const signature of signatures) {
      if (!signature?.data) continue;

      try {
        const { domain, types, primaryType, message } = signature.data;
        const signatureResult = await signTypedDataAsync({
          domain,
          types,
          primaryType,
          message,
        });

        if (!signatureResult) {
          throw new Error('Failed to sign data');
        }

        // Handle chained signatures if needed
        if (signature.type === SignatureType.CHAINED && !signature.isComplete) {
          const { data: nextSignatureData } = await executeChainSignaturesQuery(
            {
              variables: {
                tokenIdFrom: tokenIdFrom,
                tokenIdTo: tokenIdTo,
                addressFrom: address ?? '',
                route: route?.raw,
                swap: route?.swap ?? '',
                previousSignature: signatureResult,
                signatureKey: signature.key,
                signatureStep: signature.step,
              },
            }
          );

          const nextSignatures = nextSignatureData?.chainSignatures;

          if (nextSignatures && nextSignatures.length > 0) {
            // Process the next signature in the chain
            // Recursion. Yay! Getting uni flashbacks
            const chainResults = await processSignatures(nextSignatures);
            // Add the final result of the chain
            if (chainResults.length > 0) {
              results.push(chainResults[chainResults.length - 1]);
            }
          }
        } else {
          // Single signature or final step in chain
          results.push(signatureResult);
        }
      } catch (e) {
        console.error('Error signing data:', e);
        throw e;
      }
    }
    return results;
  };

  const startDexEVMExchange = async () => {
    if (!address) {
      handleWalletConnection({
        chainNamespace: ChainKind.EVM,
        evmChainId: chainIdFrom,
      });
      return;
    }

    if (currentChainId !== chainIdFrom) {
      await switchChainAsync({
        chainId: chainIdFrom,
      });
    }

    if (!tokenIdFrom || !tokenIdTo || !route) {
      return;
    }

    try {
      // Handle approvals first
      await handleApprovals({
        chainIdTo: chainIdFrom,
        sendTransactionAsync,
        getApprove,
        onStatusChange,
        startApprovalStatusChecking,
        setSignatures,
        processSignatures,
      });
      // After all approvals are done, proceed with exchange
      await executeExchangeEVM({
        chainIdTo: chainIdFrom,
        dexExchangeMutation,
        sendTransactionAsync,
        onStatusChange,
        setHoudiniId,
        confirmTransaction,
      });
    } catch (error) {
      onStatusChange(DexExchangeStatus.ERROR);
      throw error;
    }
  };

  return { startDexEVMExchange };
};
