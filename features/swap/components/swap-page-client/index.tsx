'use client';

import { useAppKitAccount } from '@reown/appkit/react';
import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';
import { v4 as uuidv4 } from 'uuid';

import Banner from '@/components/Banner';
import { SwapBox } from '@/features/swap/components/swap-box';
import { SwapBoxRoutes } from '@/features/swap/components/swap-box-routes';
import { DEBOUNCE_DELAY_MS } from '@/features/swap/constants';
import { useSwapUrlParams } from '@/features/swap/hooks/use-swap-url-params';
import useNetworkStore from '@/features/swap/stores/use-network-store';
import {
  BestRouteType,
  useJustSwitchedStore,
  useRoutesStore,
  useSelectedRouteStore,
  useSlippageStore,
  useSwapLoadingStore,
} from '@/features/swap/stores/use-swap-store';
import { ChainKind, RoutesListType } from '@/features/swap/types';
import {
  generateUniqueCardId,
  shouldSkipAllQuote,
} from '@/features/swap/utils/route-helpers';
import { calculateFromTokensNeeded } from '@/features/swap/utils/swap-utils';
import { WalletConnectionHandler } from '@/features/wallet/components/wallet-connection-handler';
import { clientId } from '@/graphql/apollo-client';
import {
  GetAllQuoteQueryVariables,
  QuoteType,
  Token,
  useGetAllQuoteQuery,
  useGetSwapTokensByIdsQuery,
} from '@/graphql/generated';
import { UsePartnerIdSync } from '@/hooks/use-partner-id-sync';

export default function SwapPageClient() {
  const {
    tokenIn,
    amount,
    tokenOut,
    setSwapParams,
    address: recipientAddress,
    amountOut: amountOutFromUrl,
    isPrivate,
    useXmr,
  } = useSwapUrlParams();
  const { address: walletAddress } = useAppKitAccount();
  const allSupportedNetworks = useNetworkStore(
    (state) => state.allSupportedNetworks
  );
  const setSelectedNetworkByChainIdAndKind = useNetworkStore(
    (state) => state.setSelectedNetworkByChainIdAndKind
  );

  const mergeRoutes = useRoutesStore((state) => state.mergeRoutes);
  const slippageValue = useSlippageStore((state) => state.slippageValue);

  const setIsAllQuoteQueryLoading = useSwapLoadingStore(
    (state) => state.setIsAllQuoteQueryLoading
  );

  const [debouncedAmountIn] = useDebounce(amount, DEBOUNCE_DELAY_MS);
  const [debouncedSlippage] = useDebounce(slippageValue, DEBOUNCE_DELAY_MS);

  const justSwitched = useJustSwitchedStore((state) => state.justSwitched);
  const setJustSwitched = useJustSwitchedStore(
    (state) => state.setJustSwitched
  );

  const { data: swapTokensData, loading: isSwapTokensLoading } =
    useGetSwapTokensByIdsQuery({
      variables: {
        tokenInId: tokenIn,
        tokenOutId: tokenOut,
      },
      skip: !tokenIn || !tokenOut,
    });

  useEffect(() => {
    if (swapTokensData?.tokenIn?.chainData && allSupportedNetworks.length > 0) {
      setSelectedNetworkByChainIdAndKind(
        swapTokensData.tokenIn.chainData.chainId,
        swapTokensData.tokenIn.chainData.kind as ChainKind
      );
    }
  }, [
    swapTokensData?.tokenIn?.chainData,
    setSelectedNetworkByChainIdAndKind,
    allSupportedNetworks,
  ]);

  const skipAllQuote = shouldSkipAllQuote({
    tokenIn: swapTokensData?.tokenIn,
    tokenOut: swapTokensData?.tokenOut,
    debouncedAmountIn: justSwitched ? amount : debouncedAmountIn,
  });

  const hasBothWallets = walletAddress && recipientAddress;

  const quoteAmount = justSwitched ? amount : debouncedAmountIn;
  const tokenIdFrom = swapTokensData?.tokenIn?._id ?? '';
  const tokenIdTo = swapTokensData?.tokenOut?._id ?? '';
  const cexTokenIdFrom = swapTokensData?.tokenIn?.cexTokenId ?? '';
  const cexTokenIdTo = swapTokensData?.tokenOut?.cexTokenId ?? '';
  const slippage = debouncedSlippage;
  const toAddress = hasBothWallets ? recipientAddress : null;
  const fromAddress = hasBothWallets ? walletAddress : null;

  // Create a stable quoteRequestId that only changes when core swap parameters change
  const allQuoteQueryVariables = useMemo(
    () =>
      ({
        quoteRequestId: uuidv4(),
        amount: quoteAmount,
        tokenIdFrom,
        tokenIdTo,
        cexTokenIdFrom,
        cexTokenIdTo,
        clientId,
        slippage,
        toAddress,
        fromAddress,
        useXmr,
      }) as GetAllQuoteQueryVariables,
    [
      quoteAmount,
      tokenIdFrom,
      tokenIdTo,
      cexTokenIdFrom,
      cexTokenIdTo,
      slippage,
      toAddress,
      fromAddress,
      useXmr,
    ]
  );

  const {
    data: allQuoteData,
    loading: isAllQuoteLoading,
    refetch: refetchAllQuote,
  } = useGetAllQuoteQuery({
    variables: allQuoteQueryVariables,
    skip: skipAllQuote,
    onError: (error) => {
      console.error('Error fetching all quote', error);
      toast.error(error.message);
    },
    onCompleted: (data) => {
      setSwapParams({ amountOut: null });
      setJustSwitched(false);

      mergeRoutes(RoutesListType.DEX, data.dexQuote?.routes ?? []);
      mergeRoutes(
        RoutesListType.STANDARD_CEX,
        data.standardCexQuote?.quote ? [data.standardCexQuote.quote] : []
      );
      mergeRoutes(
        RoutesListType.PRIVATE_CEX,
        data.privateCexQuote?.quote ? [data.privateCexQuote.quote] : []
      );
    },

    fetchPolicy: 'no-cache',
  });

  const selectedRouteType = useSelectedRouteStore(
    (state) => state.selectedRouteType
  );
  const setSelectedRouteCardId = useSelectedRouteStore(
    (state) => state.setSelectedRouteCardId
  );
  const setSelectedRoute = useSelectedRouteStore(
    (state) => state.setSelectedRoute
  );
  const bestPrivateRoute = useRoutesStore((state) =>
    state.getBestPrivateRoute()
  );
  const bestRoute = useRoutesStore((state) => state.getBestRoute());
  const bestStandardCexRoute = useRoutesStore((state) =>
    state.getBestStandardCexRoute()
  );

  useEffect(() => {
    setIsAllQuoteQueryLoading(isAllQuoteLoading);
  }, [isAllQuoteLoading, setIsAllQuoteQueryLoading]);

  // Calculate the required input amount when a target output amount is specified via URL
  // This enables payment link functionality where users can share links with preset output amounts
  useEffect(() => {
    if (
      amountOutFromUrl &&
      swapTokensData?.tokenIn?.price &&
      swapTokensData?.tokenOut?.price
    ) {
      const amount = calculateFromTokensNeeded(
        Number(amountOutFromUrl),
        swapTokensData?.tokenOut?.price ?? 0,
        swapTokensData?.tokenIn?.price ?? 0,
        isPrivate
      );
      setSwapParams({ amount: amount });
    }
  }, [
    amountOutFromUrl,
    swapTokensData?.tokenIn?.price,
    swapTokensData?.tokenOut?.price,
  ]);

  useEffect(() => {
    // Auto-selects the best route of the selected type after quotes refresh, using useEffect for robust sync with both query and store state.
    if (!isAllQuoteLoading && allQuoteData) {
      if (selectedRouteType === BestRouteType.BEST && bestRoute) {
        const uniqueCardId = generateUniqueCardId({
          routeId: bestRoute.quoteId ?? '',
          quoteType: bestRoute.type ?? QuoteType.Dex,
          isPriorityRoute: true,
          isBestRouteSlot: true,
        });
        setSelectedRouteCardId(uniqueCardId);
        setSelectedRoute(bestRoute);
        return;
      }

      if (selectedRouteType === QuoteType.Private && bestPrivateRoute) {
        const uniqueCardId = generateUniqueCardId({
          routeId: bestPrivateRoute.quoteId ?? '',
          quoteType: QuoteType.Private,
          isPriorityRoute: true,
          isBestRouteSlot: false,
        });
        setSelectedRouteCardId(uniqueCardId);
        setSelectedRoute(bestPrivateRoute);
        return;
      }

      if (selectedRouteType === QuoteType.Standard && bestStandardCexRoute) {
        const uniqueCardId = generateUniqueCardId({
          routeId: bestStandardCexRoute.quoteId ?? '',
          quoteType: QuoteType.Standard,
          isPriorityRoute: true,
          isBestRouteSlot: false,
        });
        setSelectedRouteCardId(uniqueCardId);
        setSelectedRoute(bestStandardCexRoute);
        return;
      }
    }
  }, [
    isAllQuoteLoading,
    allQuoteData,
    selectedRouteType,
    bestPrivateRoute,
    bestRoute,
    bestStandardCexRoute,
    setSelectedRoute,
    setSelectedRouteCardId,
  ]);

  const minMax = {
    dex: allQuoteData?.dexMinMax,
    standardCex: allQuoteData?.standardCexMinMax,
    privateCex: allQuoteData?.privateCexMinMax,
  };

  return (
    <main className="relative grid min-h-[calc(100vh-(var(--spacing-header)))] gap-y-6 pt-4 md:pt-12">
      <UsePartnerIdSync />
      <div className="container flex flex-col items-center gap-y-6">
        <Banner />
        <div className="flex flex-col justify-center gap-4 lg:flex-row lg:gap-6">
          <WalletConnectionHandler>
            {({ handleWalletConnection }) => (
              <SwapBox
                amountIn={amount}
                tokenInData={swapTokensData?.tokenIn as Token}
                tokenOutData={swapTokensData?.tokenOut as Token}
                isSwapTokensLoading={isSwapTokensLoading}
                quoteRequestId={allQuoteQueryVariables.quoteRequestId as string}
                handleWalletConnection={handleWalletConnection}
              />
            )}
          </WalletConnectionHandler>
          <SwapBoxRoutes
            tokenOutUsd={swapTokensData?.tokenOut?.price ?? 0}
            inAmount={amount}
            inAmountUsd={amount * (swapTokensData?.tokenIn?.price ?? 0)}
            refetchAllQuote={refetchAllQuote}
            minMax={minMax}
          />
        </div>
      </div>
    </main>
  );
}
