'use client';

import Humanize from 'humanize-plus';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import { useBTCWalletTransaction } from '@/features/swap/hooks/wallet-transactions/use-btc-wallet-transaction';
import { useEVMWalletTransaction } from '@/features/swap/hooks/wallet-transactions/use-evm-wallet-transaction';
import { useSolWalletTransaction } from '@/features/swap/hooks/wallet-transactions/use-sol-wallet-transaction';
import { useSuiWalletTransaction } from '@/features/swap/hooks/wallet-transactions/use-sui-wallet-transaction';
import { useTonWalletTransaction } from '@/features/swap/hooks/wallet-transactions/use-ton-wallet-transaction';
import { useTronWalletTransaction } from '@/features/swap/hooks/wallet-transactions/use-tron-wallet-transaction';
import { ChainKind } from '@/features/swap/types';
import { parseRpcError } from '@/features/swap/utils/error-helpers';
import { Token } from '@/graphql/generated';
import { useMultichainBalance } from '@/hooks/balances/use-multichain-balance';

interface WalletTransactionParams {
  token: Token;
  network: ChainKind | null | undefined;
  amount: number;
  address: string;
  senderTag: string | undefined | null;
  handleTransactionSent: (walletName: string | undefined) => Promise<void>;
}

interface WalletTransactionResult {
  startTransaction: () => Promise<void>;
  isProcessing: boolean;
  error: Error | null;
}

export function useWalletTransaction({
  token,
  network,
  amount,
  address,
  senderTag,
  handleTransactionSent,
}: WalletTransactionParams): WalletTransactionResult {
  const t = useTranslations('swap');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { send: sendEVMTransaction } = useEVMWalletTransaction();
  const { send: sendSolanaTransaction } = useSolWalletTransaction();
  const { send: sendTronTransaction } = useTronWalletTransaction();
  const { send: sendSuiTransaction } = useSuiWalletTransaction();
  const { send: sendBTCWalletTransaction } = useBTCWalletTransaction();
  const { send: sendTonTransaction } = useTonWalletTransaction();

  const { balance } = useMultichainBalance({
    tokenAddress: token.address ?? '',
    isNative: token.mainnet ?? false,
    chainId: token.chainData?.chainId ?? 0,
    chainKind: token.chainData?.kind as ChainKind,
  });
  const startTransaction = async () => {
    if (isProcessing) {
      return;
    }
    if (balance && Number(balance) < amount) {
      toast.error(
        t('errors.insufficientBalance', {
          balance: Humanize.formatNumber(Number(balance), 4),
          tokenName: token.symbol ?? '',
          amount: Humanize.formatNumber(amount, 4),
        })
      );
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      switch (network) {
        case ChainKind.EVM:
          await sendEVMTransaction({
            token,
            amount,
            toAddress: address,
            handleTransactionSent,
          });
          setIsProcessing(false);
          break;

        case ChainKind.SOLANA:
          await sendSolanaTransaction({
            token,
            amount,
            toAddress: address,
            handleTransactionSent,
          });
          break;
        case ChainKind.TRON:
          await sendTronTransaction({
            token,
            amount,
            toAddress: address,
            senderTag,
            handleTransactionSent,
          });
          break;
        case ChainKind.BTC:
          await sendBTCWalletTransaction({
            amount,
            toAddress: address,
            handleTransactionSent,
          });
          break;

        case ChainKind.SUI:
          await sendSuiTransaction({
            token,
            amount,
            toAddress: address,
            handleTransactionSent,
          });
          break;
        case ChainKind.TON:
          await sendTonTransaction({
            token,
            amount,
            toAddress: address,
            senderTag,
            handleTransactionSent,
          });
          break;
        default:
          throw new Error(
            t('errors.unsupportedChainKind', {
              chainKind: network ?? 'unknown',
            })
          );
      }
    } catch (err) {
      const normalizedError = parseRpcError({
        chainData: token.chainData,
        error: err as any,
        tSwap: t,
      });
      toast.error(normalizedError.message);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return { startTransaction, isProcessing, error };
}
