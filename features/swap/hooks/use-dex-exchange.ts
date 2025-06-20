'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { useDexBTCExchange } from '@/features/swap/hooks/use-dex-btc-exchange';
import { useDexEVMExchange } from '@/features/swap/hooks/use-dex-evm-exchange';
import { useDexSOLExchange } from '@/features/swap/hooks/use-dex-sol-exchange';
import { useDexSuiExchange } from '@/features/swap/hooks/use-dex-sui-exchange';
import { useDexTonExchange } from '@/features/swap/hooks/use-dex-ton-exchange';
import { useDexTronExchange } from '@/features/swap/hooks/use-dex-tron-exchange';
import { ChainKind, DexExchangeStatus } from '@/features/swap/types';
import { HandleWalletConnectionProps } from '@/features/wallet/constants';
import { Route, Token } from '@/graphql/generated';

export interface UseDexExchangeParams {
  tokenInData: Token | undefined;
  tokenOutData: Token | undefined;
  route: Route | undefined;
  amountIn: number;
  address: string;
  setHoudiniId: (houdiniId: string) => void;
  handleWalletConnection: (props: HandleWalletConnectionProps) => void;
}

export function useDexExchange({
  tokenInData,
  tokenOutData,
  route,
  amountIn,
  address,
  setHoudiniId,
  handleWalletConnection,
}: UseDexExchangeParams) {
  const t = useTranslations('swap');
  const [status, setStatus] = useState<DexExchangeStatus>(
    DexExchangeStatus.IDLE
  );

  const [isTransactionProcessing, setIsTransactionProcessing] = useState(false);
  const { startDexEVMExchange } = useDexEVMExchange({
    tokenIdFrom: tokenInData?._id ?? '',
    tokenIdTo: tokenOutData?._id ?? '',
    tokenInAddress: tokenInData?.address ?? '',
    route: route,
    sendAmount: amountIn,
    addressTo: address,
    chainIdFrom: tokenInData?.chainData?.chainId ?? 0,
    chainIdTo: tokenOutData?.chainData?.chainId ?? 0,
    onStatusChange: setStatus,
    setHoudiniId,
    handleWalletConnection,
  });

  const { startDexSOLExchange } = useDexSOLExchange({
    tokenIdFrom: tokenInData?._id ?? '',
    tokenIdTo: tokenOutData?._id ?? '',
    route: route,
    sendAmount: amountIn,
    addressTo: address,
    onStatusChange: setStatus,
    setHoudiniId,
    handleWalletConnection,
  });

  const { startDexBTCExchange } = useDexBTCExchange({
    tokenIdFrom: tokenInData?._id ?? '',
    tokenIdTo: tokenOutData?._id ?? '',
    route: route,
    sendAmount: amountIn,
    addressTo: address,
    onStatusChange: setStatus,
    setHoudiniId,
    handleWalletConnection,
  });

  const { startDexSuiExchange } = useDexSuiExchange({
    tokenIdFrom: tokenInData?._id ?? '',
    tokenIdTo: tokenOutData?._id ?? '',
    route: route,
    sendAmount: amountIn,
    addressTo: address,
    onStatusChange: setStatus,
    setHoudiniId,
    handleWalletConnection,
  });

  const { startDexTonExchange } = useDexTonExchange({
    tokenIdFrom: tokenInData?._id ?? '',
    tokenIdTo: tokenOutData?._id ?? '',
    route: route,
    sendAmount: amountIn,
    addressTo: address,
    onStatusChange: setStatus,
    setHoudiniId,
    handleWalletConnection,
  });

  const { startDexTronExchange } = useDexTronExchange({
    tokenIdFrom: tokenInData?._id ?? '',
    tokenIdTo: tokenOutData?._id ?? '',
    route: route,
    sendAmount: amountIn,
    addressTo: address,
    onStatusChange: setStatus,
    setHoudiniId,
    handleWalletConnection,
  });
  const startDexExchange = async () => {
    // Prevent multiple executions
    if (isTransactionProcessing) {
      return;
    }

    try {
      setIsTransactionProcessing(true);
      setStatus(DexExchangeStatus.IDLE);

      const chainKind = tokenInData?.chainData?.kind;

      switch (chainKind) {
        case ChainKind.EVM:
          await startDexEVMExchange();
          break;
        case ChainKind.SOLANA:
          await startDexSOLExchange();
          break;
        case ChainKind.BTC:
          await startDexBTCExchange();
          break;
        case ChainKind.SUI:
          await startDexSuiExchange();
          break;
        case ChainKind.TON:
          await startDexTonExchange();
          break;
        default:
          throw new Error(
            t('errors.unsupportedChainKind', {
              chainKind: chainKind ?? 'unknown',
            })
          );
      }
    } catch (err) {
      setStatus(DexExchangeStatus.ERROR);
      throw err;
    } finally {
      setIsTransactionProcessing(false);
    }
  };

  return { startDexExchange, status, isTransactionProcessing };
}
