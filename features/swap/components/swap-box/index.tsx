'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Settings } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { InputWithLabelAnimation } from '@/components/ui/input-with-label-animation';
import MultiSwap from '@/features/swap/components/multi-swap';
import { SwapBoxCardHeader } from '@/features/swap/components/swap-box-card-header';
import { SwapBoxOptions } from '@/features/swap/components/swap-box-options';
import { MultiSwapButton } from '@/features/swap/components/swap-box/multi-swap-button';
import { SwapActionButton } from '@/features/swap/components/swap-box/swap-action-button';
import { SwapInput } from '@/features/swap/components/swap-input';
import { SwitchSwapButton } from '@/features/swap/components/switch-swap-button';
import { DEBOUNCE_DELAY_MS } from '@/features/swap/constants';
import { useQuoteSubscriptions } from '@/features/swap/hooks/use-quote-subscriptions';
import { useRoutePartnerFilters } from '@/features/swap/hooks/use-route-partner-filters';
import { useSwapUrlParams } from '@/features/swap/hooks/use-swap-url-params';
import {
  useRoutesStore,
  useSelectedRouteStore,
  useSwapLoadingStore,
} from '@/features/swap/stores/use-swap-store';
import { SwapBoxProps } from '@/features/swap/types';
import {
  calculateFromTokensNeeded,
  calculateUsdPrice,
  getDisplayAmountIn,
  getDisplayAmountOut,
  removeCommasFromNumber,
} from '@/features/swap/utils/swap-utils';
import WidgetToolBar from '@/features/widget/components/widget-tool-bar';
import { isWidgetMode } from '@/features/widget/utils/widget-utils';
import { Token } from '@/graphql/generated';

export function SwapBox({
  tokenInData,
  tokenOutData,
  amountIn: amountInFromUrl,
  isSwapTokensLoading,
  handleWalletConnection,
  quoteRequestId,
}: SwapBoxProps) {
  const t = useTranslations('swap.form');
  const {
    setSwapParams,
    address,
    isPrivate,
    amountOut: amountOutFromUrl,
    memo: memoFromUrl,
  } = useSwapUrlParams();

  const [showOptions, setShowOptions] = useState(false);

  const selectedRoute = useSelectedRouteStore((state) => state.selectedRoute);
  const resetSelectedRoute = useSelectedRouteStore(
    (state) => state.resetSelectedRoute
  );
  const { bestAmountFromSubscriptions } = useQuoteSubscriptions(quoteRequestId);
  const resetRoutes = useRoutesStore((state) => state.resetFilters);

  const setIsAllQuoteQueryLoading = useSwapLoadingStore(
    (state) => state.setIsAllQuoteQueryLoading
  );

  const [amountOutChanged, setAmountOutChanged] = useState(amountOutFromUrl);
  const [amountInChanged, setAmountInChanged] = useState('');
  const [hasAddressRequiredError, setHasAddressRequiredError] = useState(false);

  const handleAmountInChange = (value: string) => {
    const cleanValue = removeCommasFromNumber(value);
    if (!cleanValue || Number(cleanValue) === 0) {
      setIsAllQuoteQueryLoading(false);
      setAmountInChanged(cleanValue);
      setSwapParams({ amount: Number(cleanValue) });
      resetSelectedRoute();
      resetRoutes();
      return;
    }
    setAmountInChanged(cleanValue);
    setIsAllQuoteQueryLoading(true);
    setSwapParams({ amount: Number(cleanValue) });
    resetSelectedRoute();
    resetRoutes();
  };

  const [amountOutInput, setAmountOutInput] = useState('');
  const [debouncedAmountOutInput] = useDebounce(
    amountOutInput,
    DEBOUNCE_DELAY_MS
  );

  const processAmountOutChange = (amountOut: string) => {
    const cleanValue = removeCommasFromNumber(amountOut);
    if (!cleanValue || Number(cleanValue) === 0) {
      setIsAllQuoteQueryLoading(false);
      setAmountOutChanged(Number(amountOut));
      setSwapParams({ amount: 0 });
      setAmountInChanged('');
      resetSelectedRoute();
      resetRoutes();
      return;
    }
    setIsAllQuoteQueryLoading(true);
    const amount = calculateFromTokensNeeded(
      Number(cleanValue),
      tokenOutData?.price ?? 0,
      tokenInData?.price ?? 0,
      isPrivate
    );
    setAmountOutChanged(Number(amountOut));
    setAmountInChanged(amount.toString());
    setSwapParams({ amount: amount });
    resetSelectedRoute();
    resetRoutes();
  };

  useEffect(() => {
    if (debouncedAmountOutInput !== '') {
      processAmountOutChange(debouncedAmountOutInput);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedAmountOutInput]);

  const handleAmountOutChange = (amountOut: string) => {
    setAmountOutInput(amountOut);
  };

  const displayAmountOut = getDisplayAmountOut(
    amountInFromUrl,
    selectedRoute?.amountOut ?? 0,
    bestAmountFromSubscriptions,
    amountOutChanged
  );

  const displayAmountIn = getDisplayAmountIn(amountInFromUrl, amountInChanged);

  const usdPriceIn = calculateUsdPrice(tokenInData?.price, amountInFromUrl);
  const usdPriceOut = calculateUsdPrice(
    tokenOutData?.price,
    Number(displayAmountOut)
  );

  const hiddenUsdPriceOut = usdPriceOut > usdPriceIn;

  // We preload the partnersGroup list on swap box options open to avoid delays
  const { groupPartners, isPartnerFilterLoading } = useRoutePartnerFilters();

  return (
    <Card
      className={
        isWidgetMode
          ? 'w-full lg:min-h-[500px] lg:w-[440px]'
          : 'max-h-fit w-full overflow-hidden rounded-2xl md:rounded-4xl lg:min-h-[500px] lg:w-[480px]'
      }
    >
      <div className="relative">
        {/* Main content - always mounted but animated */}
        <motion.div
          animate={{
            opacity: showOptions ? 0 : 1,
            scale: showOptions ? 0.95 : 1,
            pointerEvents: showOptions ? 'none' : 'auto',
          }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
        >
          <SwapBoxCardHeader title="swapBoxTitle">
            <Button
              variant="ghost"
              size="icon"
              aria-label={t('options')}
              onClick={() => setShowOptions(true)}
            >
              <Settings className="scale-125" />
            </Button>
          </SwapBoxCardHeader>

          <div className="space-y-1">
            <SwapInput
              label={t('from')}
              value={displayAmountIn}
              onAmountChange={handleAmountInChange}
              onTokenChange={(token) => setSwapParams({ tokenIn: token })}
              token={tokenInData as Token}
              usdPrice={usdPriceIn}
              isSwapTokensLoading={isSwapTokensLoading}
              isPrivate={isPrivate}
            />

            <SwitchSwapButton
              tokenInData={tokenInData}
              tokenOutData={tokenOutData}
              amountOut={displayAmountOut}
              setAmountInChanged={setAmountInChanged}
            />

            <SwapInput
              label={t('to')}
              value={displayAmountOut}
              onTokenChange={(token) => setSwapParams({ tokenOut: token })}
              token={tokenOutData as Token}
              usdPrice={usdPriceOut}
              isSwapTokensLoading={isSwapTokensLoading}
              isBuyingInput
              isPrivate={isPrivate}
              onAmountChange={handleAmountOutChange}
              hideUsdPrice={hiddenUsdPriceOut}
            />
          </div>

          {tokenOutData?.chainData?.memoNeeded && (
            <InputWithLabelAnimation
              label={t('memoTagComment')}
              value={memoFromUrl ?? ''}
              onChange={(value) => setSwapParams({ memo: value })}
              className="mt-2 w-full"
              inputClassName="bg-neutral-800/80"
            />
          )}

          <div className="mt-2 flex items-center justify-between gap-2">
            <InputWithLabelAnimation
              label={t('receivingWalletAddress')}
              value={address ?? ''}
              onChange={(value) => setSwapParams({ address: value })}
              error={hasAddressRequiredError && !address}
              className="w-full"
              inputClassName="bg-neutral-800/80"
            />
            <MultiSwapButton
              setHasAddressRequiredError={setHasAddressRequiredError}
              tokenInData={tokenInData}
              tokenOutData={tokenOutData}
            />
          </div>

          <MultiSwap tokenInData={tokenInData} tokenOutData={tokenOutData} />

          <SwapActionButton
            tokenInData={tokenInData as Token}
            tokenOutData={tokenOutData as Token}
            setHasAddressRequiredError={setHasAddressRequiredError}
            handleWalletConnection={handleWalletConnection}
          />
          {isWidgetMode ? <WidgetToolBar /> : null}
        </motion.div>

        {/* Options overlay - animated */}
        <AnimatePresence>
          {showOptions && (
            <motion.div
              key="options"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="absolute inset-0 z-10"
            >
              <SwapBoxOptions
                setShowOptions={setShowOptions}
                groupPartners={groupPartners}
                isPartnerFilterLoading={isPartnerFilterLoading}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}
