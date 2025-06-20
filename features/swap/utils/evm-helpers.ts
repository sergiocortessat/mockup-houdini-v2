import * as reownNetworks from '@reown/appkit/networks';
import { estimateGas } from '@wagmi/core';
import { createPublicClient, http } from 'viem';

import { DEFAULT_GAS, GAS_BUFFER_PERCENTAGE } from '@/features/swap/constants';
import { DexExchangeStatus } from '@/features/swap/types';
import { wagmiAdapter } from '@/providers/reown-wallet-provider/reown-wallet-provider-config';

// Adjust the type to match Wagmi's SendTransactionAsync
type SendTransactionFn = (params: {
  chainId?: number;
  to: `0x${string}`;
  value?: bigint | undefined;
  data: `0x${string}`;
  gas?: bigint;
}) => Promise<`0x${string}`>;

type SignTypedDataFn = (params: {
  domain: {
    name: string;
    version: string;
    chainId: number;
    verifyingContract: `0x${string}`;
    salt: `0x${string}`;
  };
  types: Record<string, string>;
  primaryType: string;
  message: Record<string, any>;
}) => Promise<`0x${string}`>;

/**
 * Handles token approvals required for a swap
 */
export const handleApprovals = async ({
  chainIdTo,
  sendTransactionAsync,
  getApprove,
  onStatusChange,
  startApprovalStatusChecking,
  setSignatures,
  processSignatures,
}: {
  chainIdTo: number;
  sendTransactionAsync: SendTransactionFn;
  getApprove: () => Promise<any>;
  onStatusChange: (status: DexExchangeStatus) => void;
  startApprovalStatusChecking: (onComplete: (success: boolean) => void) => void;
  setSignatures: (signatures: string[]) => void;
  processSignatures: (signatures: string[]) => Promise<string[]>;
}) => {
  onStatusChange(DexExchangeStatus.APPROVING);

  // Initial approve check
  const approveRes = await getApprove().catch((error) => {
    onStatusChange(DexExchangeStatus.ERROR);
    throw error;
  });
  const approveTransaction = approveRes?.data?.approve.approvals;
  const signaturesToSign = approveRes?.data?.approve.signatures || [];
  const signatureResults = [];

  if (signaturesToSign.length > 0) {
    try {
      const results = await processSignatures(signaturesToSign);
      signatureResults.push(...results);
      setSignatures(signatureResults);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (e) {
      onStatusChange(DexExchangeStatus.ERROR);
      console.error('Error processing signatures:', e);
      throw e;
    }
  }

  // If no approve data or empty array, no need to approve or poll
  if (
    !approveTransaction ||
    (Array.isArray(approveTransaction) && approveTransaction.length === 0)
  ) {
    console.log('No approvals needed');
    return false;
  }
  // Handle array of approve transactions or single approve transaction
  const approveTransactions = Array.isArray(approveTransaction)
    ? approveTransaction
    : [approveTransaction];

  // Execute approve transactions only once
  for (const transaction of approveTransactions) {
    if (transaction?.data) {
      try {
        const tx = await sendTransactionAsync({
          chainId: chainIdTo,
          to: transaction.to as `0x${string}`,
          data: transaction.data as `0x${string}`,
        });
      } catch (error) {
        console.error('Error sending approval transaction:', error);
        onStatusChange(DexExchangeStatus.ERROR);
        throw error;
      }
    }
  }

  // Return a promise that will be resolved by the approval status checker
  return new Promise<boolean>((resolve, reject) => {
    startApprovalStatusChecking((success) => {
      if (success) {
        resolve(true);
      } else {
        reject(new Error('Approval process failed'));
      }
    });
  });
};

/**
 * Executes the DEX exchange transaction
 */
export const executeExchangeEVM = async ({
  chainIdTo,
  dexExchangeMutation,
  sendTransactionAsync,
  onStatusChange,
  setHoudiniId,
  confirmTransaction,
}: {
  chainIdTo: number;
  dexExchangeMutation: () => Promise<any>;
  sendTransactionAsync: SendTransactionFn;
  onStatusChange: (status: DexExchangeStatus) => void;
  setHoudiniId: (houdiniId: string) => void;
  confirmTransaction?: (params: {
    txHash: `0x${string}` | string | undefined;
    houdiniId: string;
    onStatusChange: (status: DexExchangeStatus) => void;
  }) => Promise<any>;
}) => {
  onStatusChange(DexExchangeStatus.SWAPPING);
  try {
    const { data: dexExchangeData } = await dexExchangeMutation();
    if (dexExchangeData.dexExchange.error) {
      onStatusChange(DexExchangeStatus.ERROR);
      throw new Error(dexExchangeData.dexExchange.error.userMessage);
    }
    if (dexExchangeData?.dexExchange?.order) {
      const houdiniId = dexExchangeData?.dexExchange?.order?.houdiniId ?? '';
      setHoudiniId(houdiniId);
      const metadata = dexExchangeData.dexExchange.order.metadata;

      if (!metadata.offChain) {
        let txHash: `0x${string}` | undefined;
        try {
          let estimatedGas;
          try {
            estimatedGas = await estimateGas(wagmiAdapter.wagmiConfig, {
              chainId: chainIdTo,
              to: metadata.to as `0x${string}`,
              value: BigInt(metadata.value || '0'),
              data: metadata.data as `0x${string}`,
            });

            // Add 10% buffer to estimated gas to ensure transaction success
            estimatedGas =
              (estimatedGas * BigInt(GAS_BUFFER_PERCENTAGE)) / BigInt(100);
          } catch (error) {
            console.warn('Gas estimation failed, using fallback:', error);
            // Fallback to metadata gas or DEFAULT_GAS if estimation fails
            estimatedGas = BigInt(metadata.gas || DEFAULT_GAS);
          }

          console.log('estimatedGas', estimatedGas);

          const tx = await sendTransactionAsync({
            chainId: chainIdTo,
            to: metadata.to as `0x${string}`,
            value: metadata.value ? BigInt(metadata.value) : undefined,
            data: metadata.data as `0x${string}`,
            gas: estimatedGas,
          });
          txHash = tx;

          // Confirm transaction with retries before marking as success
          if (confirmTransaction && txHash && houdiniId) {
            await confirmTransaction({
              txHash,
              houdiniId,
              onStatusChange,
            });
          }
          onStatusChange(DexExchangeStatus.SUCCESS);

          return txHash;
        } catch (error) {
          console.error('Error sending exchange transaction:', error);
          onStatusChange(DexExchangeStatus.ERROR);
          throw error;
        }
      } else {
        await confirmTransaction?.({
          txHash: undefined,
          houdiniId,
          onStatusChange,
        });
        onStatusChange(DexExchangeStatus.SUCCESS);
      }
    }
  } catch (error) {
    console.error('Error during exchange mutation:', error);
    onStatusChange(DexExchangeStatus.ERROR);
    throw error;
  }
};

export const getViemPublicClient = (chainId: number | undefined) => {
  if (!chainId) {
    throw new Error('Chain ID is required');
  }
  const network = Object.values(reownNetworks).find(
    (network) => (network as any).id === chainId
  );
  if (!network) {
    throw new Error(`Network with chainId ${chainId} not found`);
  }
  const publicClient = createPublicClient({
    chain: network as any,
    transport: http(),
  });
  return {
    publicClient,
    chain: network as any,
  };
};
