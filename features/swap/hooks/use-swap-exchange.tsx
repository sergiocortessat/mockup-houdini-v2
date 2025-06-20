'use client';

import Humanize from 'humanize-plus';
import { useTranslations } from 'next-intl';
import { useRouter } from 'nextjs-toploader/app';
import { useCallback, useEffect, useState, useTransition } from 'react';
import { toast } from 'sonner';

import { getOrderDetailsUrl } from '@/constants/urls';
import { useDexExchange } from '@/features/swap/hooks/use-dex-exchange';
import { useSwapUrlParams } from '@/features/swap/hooks/use-swap-url-params';
import {
  RoutesStoreState,
  useMultiSwapStore,
  useSelectedRouteStore,
  useSwapLoadingStore,
} from '@/features/swap/stores/use-swap-store';
import { ChainKind, DexExchangeStatus } from '@/features/swap/types';
import { isAddressValid } from '@/features/swap/utils/address-validation';
import { parseRpcError } from '@/features/swap/utils/error-helpers';
import { HandleWalletConnectionProps } from '@/features/wallet/constants';
import {
  Quote,
  QuoteType,
  Token,
  useCexPrivateExchangeMutation,
  useCexStandardExchangeMutation,
  useCheckDestinationAddressQuery,
  useMultiExchangeMutation,
} from '@/graphql/generated';
import { useMultichainBalance } from '@/hooks/balances/use-multichain-balance';
import { triggerAddressableEvent } from '@/utils/addressable-event';

interface UseSwapExchangeProps {
  tokenInData: Token | undefined;
  tokenOutData: Token | undefined;
  amountIn: number;
  amountOut: number;
  isQuoteLoading: boolean;
  routes: RoutesStoreState['filteredRoutes'];
  setHasAddressRequiredError: (error: boolean) => void;
  handleWalletConnection: (props: HandleWalletConnectionProps) => void;
}

export function useSwapExchange({
  tokenInData,
  tokenOutData,
  amountIn,
  amountOut,
  isQuoteLoading,
  routes,
  setHasAddressRequiredError,
  handleWalletConnection,
}: UseSwapExchangeProps) {
  const t = useTranslations('swap');
  const { address, isPrivate, isMultiSwap, useXmr, memo } = useSwapUrlParams();
  const router = useRouter();
  const [isRedirecting, startRedirectTransition] = useTransition();
  const swaps = useMultiSwapStore((state) => state.swaps);
  const setIsSwapping = useSwapLoadingStore((state) => state.setIsSwapping);

  const [houdiniId, setHoudiniId] = useState<string | null>(null);

  const selectedRoute = useSelectedRouteStore((state) => state.selectedRoute);
  const resetSelectedRoute = useSelectedRouteStore(
    (state) => state.resetSelectedRoute
  );

  const resetSelectedRouteType = useSelectedRouteStore(
    (state) => state.resetSelectedRouteType
  );

  const selectedDexRoute = routes?.dexRoutes?.find(
    (route) => route?.quoteId === selectedRoute?.quoteId
  );

  const { balance } = useMultichainBalance({
    tokenAddress: tokenInData?.address ?? '',
    isNative: tokenInData?.mainnet ?? false,
    chainId: tokenInData?.chainData?.chainId ?? 0,
    chainKind: tokenInData?.chainData?.kind as ChainKind,
  });

  const { startDexExchange, status, isTransactionProcessing } = useDexExchange({
    tokenInData: tokenInData ?? undefined,
    tokenOutData: tokenOutData ?? undefined,
    route: selectedDexRoute,
    amountIn,
    address: address ?? '',
    setHoudiniId,
    handleWalletConnection,
  });

  const navigateToOrderDetails = useCallback(
    (id: string, isMulti?: boolean) => {
      resetSelectedRoute();
      resetSelectedRouteType();
      startRedirectTransition(() => {
        router.push(getOrderDetailsUrl(id, isMulti));
      });
    },
    [router, resetSelectedRoute, resetSelectedRouteType]
  );

  const [cexStandardExchange, { loading: isCexStandardExchangeLoading }] =
    useCexStandardExchangeMutation({
      onCompleted: (data) => {
        const error = data?.exchange?.error;
        if (error) {
          toast.error(error.userMessage || 'Unknown error');
          console.error(error.userMessage || 'Unknown error');
          return;
        }
        const houdiniId = data?.exchange?.order?.houdiniId;
        if (houdiniId) {
          navigateToOrderDetails(houdiniId);
        }
      },
      onError: (error) => {
        console.error(
          t(error instanceof Error ? error.message : 'errors.unknown')
        );
        toast.error(
          t(error instanceof Error ? error.message : 'errors.unknown')
        );
      },
    });

  const [cexPrivateExchange, { loading: isCexPrivateExchangeLoading }] =
    useCexPrivateExchangeMutation({
      onCompleted: (data) => {
        const error = data?.exchange?.error;
        if (error) {
          toast.error(error.userMessage || 'Unknown error');
          console.error(error.userMessage || 'Unknown error');
          return;
        }
        const houdiniId = data?.exchange?.order?.houdiniId;
        if (houdiniId) {
          navigateToOrderDetails(houdiniId);
        }
      },
      onError: (error) => {
        console.error(
          t(error instanceof Error ? error.message : 'errors.unknown')
        );
        toast.error(
          t(error instanceof Error ? error.message : 'errors.unknown')
        );
      },
    });

  const [multiExchange, { loading: isMultiExchangeLoading }] =
    useMultiExchangeMutation({
      onCompleted: (data) => {
        console.log(data);
        const firstResult = data?.multiExchange?.[0];
        const multiId = firstResult?.order?.multiId;
        if (multiId) {
          navigateToOrderDetails(multiId, true);
        }
      },
      onError: (error) => {
        console.error(
          t(error instanceof Error ? error.message : 'errors.unknown')
        );
        toast.error(
          t(error instanceof Error ? error.message : 'errors.unknown')
        );
      },
    });

  const { fetchMore } = useCheckDestinationAddressQuery({
    skip: true,
  });

  const isSwapButtonDisabled =
    !tokenInData ||
    !tokenOutData ||
    !amountIn ||
    !amountOut ||
    isTransactionProcessing ||
    isCexStandardExchangeLoading ||
    isCexPrivateExchangeLoading ||
    isQuoteLoading ||
    isMultiExchangeLoading ||
    isRedirecting;

  const isSwapButtonLoading =
    isTransactionProcessing ||
    isCexStandardExchangeLoading ||
    isCexPrivateExchangeLoading ||
    isQuoteLoading ||
    isMultiExchangeLoading ||
    isRedirecting;

  const handleSwap = async () => {
    setIsSwapping(true);
    // Analytics: trigger event for tx confirmation stage
    if (selectedRoute?.type === QuoteType.Private) {
      triggerAddressableEvent('v4_user_started_private_swap');
    } else if (selectedRoute?.type === QuoteType.Dex) {
      triggerAddressableEvent('v4_user_started_dex_swap');
    } else if (selectedRoute?.type === QuoteType.Standard) {
      triggerAddressableEvent('v4_user_started_cex_swap');
    }

    const isNotEnoughBalance = balance && Number(balance) < amountIn;

    if (!selectedRoute?.type) {
      toast.warning(t('validation.noRouteSelectedDescription'));
      setIsSwapping(false);
      return;
    }
    if (!address) {
      setHasAddressRequiredError(true);
      toast.warning(t('validation.addressRequiredDescription'));
      setIsSwapping(false);
      return;
    }
    if (!isAddressValid(address, tokenOutData?.chainData?.addressValidation)) {
      console.error(t('validation.invalidAddress'));
      toast.error(
        t('validation.invalidAddress', {
          chain: tokenOutData?.chainData?.name ?? '',
        })
      );
      setIsSwapping(false);
      return;
    }
    const checkDestinationAddressData = await fetchMore({
      variables: {
        isDex: selectedRoute?.type === QuoteType.Dex,
        chainId: tokenOutData?.chainData?.chainId ?? 0,
        kind: tokenOutData?.chainData?.kind ?? '',
        address: address ?? '',
      },
    });
    if (checkDestinationAddressData?.data?.checkDestinationAddress) {
      console.error(t('validation.addressIsContract'));
      toast.error(t('validation.addressIsContract'));
      setIsSwapping(false);
      return;
    }

    try {
      if (isMultiSwap) {
        await multiExchange({
          variables: {
            orders: swaps.map((swap) => ({
              amount: Number(swap.amount),
              from: swap.from,
              to: swap.to,
              addressTo: swap.address,
              anonymous: isPrivate,
              useXmr: useXmr,
              destinationTag: memo,
            })),
          },
        });
        return;
      }

      if (selectedRoute?.type === QuoteType.Standard) {
        const selectedQuote = selectedRoute as Quote;
        await cexStandardExchange({
          variables: {
            amount: amountIn,
            from: tokenInData?.cexTokenId ?? '',
            to: tokenOutData?.cexTokenId ?? '',
            addressTo: address ?? '',
            destinationTag: memo,
            inQuoteId: selectedQuote?.inQuoteId ?? '',
          },
        });
        return;
      }

      if (selectedRoute?.type === QuoteType.Private) {
        const selectedQuote = selectedRoute as Quote;
        await cexPrivateExchange({
          variables: {
            amount: amountIn,
            from: tokenInData?.cexTokenId ?? '',
            to: tokenOutData?.cexTokenId ?? '',
            addressTo: address ?? '',
            useXmr,
            destinationTag: memo,
            inQuoteId: selectedQuote?.inQuoteId ?? '',
            outQuoteId: selectedQuote?.outQuoteId ?? '',
          },
        });
        return;
      }
      if (isNotEnoughBalance) {
        toast.error(
          t('errors.insufficientBalance', {
            balance: Humanize.formatNumber(Number(balance), 4),
            tokenName: tokenInData?.symbol ?? '',
            amount: Humanize.formatNumber(amountIn, 4),
          })
        );
        setIsSwapping(false);
        return;
      }

      await startDexExchange();
    } catch (error) {
      const normalizedError = parseRpcError({
        chainData: tokenInData?.chainData,
        error: error as any,
        tSwap: t,
      });

      toast.error(normalizedError.message);
    } finally {
      setIsSwapping(false);
    }
  };

  useEffect(() => {
    if (status === DexExchangeStatus.SUCCESS) {
      resetSelectedRoute();

      if (houdiniId) {
        navigateToOrderDetails(houdiniId);
      }
    }
  }, [status, houdiniId, navigateToOrderDetails, resetSelectedRoute]);

  return {
    selectedRoute,
    status,
    isTransactionProcessing,
    isCexStandardExchangeLoading,
    isCexPrivateExchangeLoading,
    isSwapButtonDisabled,
    handleSwap,
    isMultiExchangeLoading,
    isRedirecting,
    isSwapButtonLoading,
  };
}
