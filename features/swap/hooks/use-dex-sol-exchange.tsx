import {
  type Provider,
  useAppKitConnection,
} from '@reown/appkit-adapter-solana/react';
import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react';
import {
  AddressLookupTableAccount,
  Keypair,
  Transaction,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js';
import { useTranslations } from 'next-intl';

import { useConfirmTransaction } from '@/features/swap/hooks/use-confirm-transaction';
import { useSwapUrlParams } from '@/features/swap/hooks/use-swap-url-params';
import {
  ChainKind,
  DexExchangeStatus,
  RouteProtocol,
} from '@/features/swap/types';
import {
  createPriorityFeeInstructions,
  getSolanaConfirmation,
  updatePriorityFee,
} from '@/features/swap/utils/solana-helpers';
import { HandleWalletConnectionProps } from '@/features/wallet/constants';
import { Route, useDexExchangeMutation } from '@/graphql/generated';

interface DexSOLExchangeParams {
  tokenIdFrom: string;
  tokenIdTo: string;
  route: Route | undefined;
  sendAmount: number;
  addressTo: string;
  onStatusChange: (status: DexExchangeStatus) => void;
  setHoudiniId: (houdiniId: string) => void;
  handleWalletConnection: (props: HandleWalletConnectionProps) => void;
}

export const useDexSOLExchange = ({
  tokenIdFrom,
  tokenIdTo,
  route,
  sendAmount,
  addressTo,
  onStatusChange,
  setHoudiniId,
  handleWalletConnection,
}: DexSOLExchangeParams) => {
  const { address } = useAppKitAccount({ namespace: 'solana' });
  const { memo } = useSwapUrlParams();
  const { connection } = useAppKitConnection();
  const { walletProvider } = useAppKitProvider<Provider>('solana');
  const { confirmTransaction } = useConfirmTransaction();
  const t = useTranslations('swap');
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

  const startDexSOLExchange = async () => {
    if (!address || !walletProvider) {
      handleWalletConnection({ chainNamespace: ChainKind.SOLANA });
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
        let rawTx;
        if (route?.swap === RouteProtocol.DL) {
          rawTx = Uint8Array.from(Buffer.from(metadata?.data?.slice(2), 'hex'));
        } else if (route?.swap === RouteProtocol.RD) {
          const jsonString = Buffer.from(metadata.data, 'hex').toString(
            'utf-8'
          );
          const byteStrArray = JSON.parse(jsonString);
          rawTx = Uint8Array.from(Buffer.from(byteStrArray[0], 'hex'));
        } else {
          rawTx = Uint8Array.from(Buffer.from(metadata.data, 'hex'));
        }

        let transaction: Transaction | VersionedTransaction;

        try {
          transaction = Transaction.from(rawTx);
        } catch (error) {
          transaction = VersionedTransaction.deserialize(rawTx);

          if (
            route?.swap === RouteProtocol.WH ||
            route?.swap === RouteProtocol.CF
          ) {
            const computeBudgetIxFilter = (ix: {
              programId: { toString: () => string };
            }) =>
              ix.programId.toString() !==
              'ComputeBudget111111111111111111111111111111';

            if (!connection) {
              throw new Error('Connection is required');
            }

            const { blockhash } = await connection.getLatestBlockhash();

            const luts = (
              await Promise.all(
                transaction.message.addressTableLookups.map((acc) =>
                  connection.getAddressLookupTable(acc.accountKey)
                )
              )
            )
              .map((lut) => lut.value)
              .filter((lut) => lut !== null) as AddressLookupTableAccount[];

            const message = TransactionMessage.decompile(transaction.message, {
              addressLookupTableAccounts: luts,
            });
            message.recentBlockhash = blockhash;
            transaction.message.recentBlockhash = blockhash;

            message.instructions = message.instructions.filter(
              computeBudgetIxFilter
            );
            message.instructions.push(
              ...(await createPriorityFeeInstructions(connection, transaction))
            );

            transaction.message = message.compileToV0Message(luts);

            if (metadata.signers?.length > 0) {
              const signers = metadata.signers
                .filter((signer: any) => signer?._keypair?.secretKey)
                .map((signer: any) => {
                  const secretKey = Object.values(signer._keypair.secretKey);
                  return Keypair.fromSecretKey(
                    new Uint8Array(secretKey as unknown as ArrayBuffer)
                  );
                });

              if (transaction instanceof Transaction && signers.length > 0) {
                transaction.sign(...signers);
              } else if (
                transaction instanceof VersionedTransaction &&
                signers.length > 0
              ) {
                transaction.sign(signers);
              }
            }
          } else if (route?.swap === RouteProtocol.DL) {
            if (!connection) {
              throw new Error('Connection is required');
            }

            const fees = await connection.getRecentPrioritizationFees();
            let priorityFee = 1000000;
            const maxFee =
              fees?.reduce(
                (max, fee) =>
                  fee.prioritizationFee > max ? fee.prioritizationFee : max,
                0
              ) ?? 0;

            priorityFee = maxFee + 1000000;
            const { blockhash } = await connection.getLatestBlockhash();

            transaction.message.recentBlockhash = blockhash;
            updatePriorityFee(transaction, priorityFee, 500_000);
          }

          if (!connection || !walletProvider) {
            throw new Error('Connection and wallet provider are required');
          }

          const txHash = await walletProvider
            .sendTransaction(transaction, connection, {})
            .catch((error) => {
              throw error;
            });

          if (!txHash) {
            throw new Error(t('errors.transactionHashMissing'));
          }

          const confirmed = await getSolanaConfirmation(connection, txHash);
          if (!confirmed) {
            throw new Error(t('errors.transactionConfirmationFailed'));
          }

          await confirmTransaction({
            txHash,
            houdiniId: data?.dexExchange?.order?.houdiniId ?? '',
            onStatusChange,
          });

          onStatusChange(DexExchangeStatus.SUCCESS);
        }
      }
    } catch (error) {
      onStatusChange(DexExchangeStatus.ERROR);
      throw error;
    }
  };

  return { startDexSOLExchange };
};
