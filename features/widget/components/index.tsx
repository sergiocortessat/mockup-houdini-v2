'use client';

import { useAppKitAccount } from '@reown/appkit/react';
import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';
import { v4 as uuidv4 } from 'uuid';

import { SwapBox } from '@/features/swap/components/swap-box';
import { SwapBoxRoutes } from '@/features/swap/components/swap-box-routes';
import { DEBOUNCE_DELAY_MS } from '@/features/swap/constants';
import { useSwapUrlParams } from '@/features/swap/hooks/use-swap-url-params';
import {
  useJustSwitchedStore,
  useSlippageStore,
  useSwapLoadingStore,
} from '@/features/swap/stores/use-swap-store';
import { shouldSkipAllQuote } from '@/features/swap/utils/route-helpers';
import { calculateFromTokensNeeded } from '@/features/swap/utils/swap-utils';
import { WalletConnectionHandler } from '@/features/wallet/components/wallet-connection-handler';
import { clientId } from '@/graphql/apollo-client';
import {
  GetAllQuoteQueryVariables,
  Token,
  useGetAllQuoteQuery,
  useGetSwapTokensByIdsQuery,
} from '@/graphql/generated';

const Widget = () => {
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
    loading: isAllQuoteLoading,
    refetch: refetchAllQuote,
    data: allQuoteData,
  } = useGetAllQuoteQuery({
    variables: allQuoteQueryVariables,
    skip: skipAllQuote,
    onError: (error) => {
      console.error('Error fetching all quote', error);
      toast.error(error.message);
    },
    onCompleted: () => {
      setSwapParams({ amountOut: null });
      setJustSwitched(false);
    },

    fetchPolicy: 'no-cache',
  });

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
    isPrivate,
    setSwapParams,
  ]);

  const minMax = {
    dex: allQuoteData?.dexMinMax,
    standardCex: allQuoteData?.standardCexMinMax,
    privateCex: allQuoteData?.privateCexMinMax,
  };
  return (
    <div className="flex w-full flex-col justify-center gap-4 lg:flex-row lg:items-start lg:gap-3">
      <WalletConnectionHandler>
        {({ handleWalletConnection }) => (
          <div className="">
            <SwapBox
              quoteRequestId={allQuoteQueryVariables.quoteRequestId as string}
              amountIn={amount}
              tokenInData={swapTokensData?.tokenIn as Token}
              tokenOutData={swapTokensData?.tokenOut as Token}
              isSwapTokensLoading={isSwapTokensLoading}
              handleWalletConnection={handleWalletConnection}
            />
          </div>
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
  );
};

export default Widget;
