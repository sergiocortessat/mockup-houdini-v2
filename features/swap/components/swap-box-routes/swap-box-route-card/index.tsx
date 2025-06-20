import { CircleCheckIcon } from 'lucide-react';
import Image from 'next/image';

import { RadioGroupItem } from '@/components/ui/radio-group';
import { AmountDisplay } from '@/features/swap/components/swap-box-routes/swap-box-route-card/amount-display';
import { MinMaxInfoMessage } from '@/features/swap/components/swap-box-routes/swap-box-route-card/min-max-info-message';
import { NoAvailableRouteMessage } from '@/features/swap/components/swap-box-routes/swap-box-route-card/no-available-route-message';
import { ProtocolBadge } from '@/features/swap/components/swap-box-routes/swap-box-route-card/protocol-badge';
import { RouteDifferenceTooltip } from '@/features/swap/components/swap-box-routes/swap-box-route-card/route-difference-tooltip';
import { RouteInfo } from '@/features/swap/components/swap-box-routes/swap-box-route-card/route-info';
import { SwapBoxRouteCardProps } from '@/features/swap/components/swap-box-routes/swap-box-route-card/types';
import { UsdPrice } from '@/features/swap/components/swap-box-routes/swap-box-route-card/usd-price';
import { useSwapUrlParams } from '@/features/swap/hooks/use-swap-url-params';
import {
  BestRouteType,
  useSelectedRouteStore,
  useSwapLoadingStore,
} from '@/features/swap/stores/use-swap-store';
import { useRoutesStore } from '@/features/swap/stores/use-swap-store';
import {
  generateUniqueCardId,
  getRouteById,
} from '@/features/swap/utils/route-helpers';
import { QuoteType } from '@/graphql/generated';
import { cn } from '@/lib/utils';
import { triggerAddressableEvent } from '@/utils/addressable-event';

export function SwapBoxRouteCard({
  amountOut,
  protocol,
  routeId,
  tokenOutUsd,
  gasFeeUsd,
  duration,
  swapAggregator,
  swapName,
  path,
  isDisabled,
  inAmountUsd,
  netOutAmount,
  netOutAmountUsd,
  isFiltered,
  isNoAvailableRoute = false,
  isInitial = false,
  isPriorityRoute = false,
  partnerLogoUrl = '',
  minMax,
  isBestRouteSlot = false,
  quoteType,
}: SwapBoxRouteCardProps) {
  const { amount: amountIn } = useSwapUrlParams();
  const isAllQuoteQueryLoading = useSwapLoadingStore(
    (state) => state.isAllQuoteQueryLoading
  );

  const setSelectedRoute = useSelectedRouteStore(
    (state) => state.setSelectedRoute
  );

  const setSelectedRouteType = useSelectedRouteStore(
    (state) => state.setSelectedRouteType
  );
  const resetSelectedRouteType = useSelectedRouteStore(
    (state) => state.resetSelectedRouteType
  );

  const selectedRouteCardId = useSelectedRouteStore(
    (state) => state.selectedRouteCardId
  );

  const setSelectedRouteCardId = useSelectedRouteStore(
    (state) => state.setSelectedRouteCardId
  );

  const filteredRoutes = useRoutesStore((state) => state.filteredRoutes);

  // Create a unique identifier for this specific card
  const uniqueCardId = generateUniqueCardId({
    routeId,
    quoteType,
    isPriorityRoute,
    isBestRouteSlot,
  });

  const outAmountUsd = tokenOutUsd * amountOut;
  const isSkeleton =
    (routeId?.startsWith('skeleton-') || routeId === '') &&
    isAllQuoteQueryLoading;

  const isNonSelectable =
    isFiltered || isNoAvailableRoute || isInitial || isDisabled || isSkeleton;

  const handleRouteChange = () => {
    const selectedRoute = getRouteById(routeId, filteredRoutes);
    setSelectedRoute(selectedRoute);

    if (selectedRoute?.type === QuoteType.Private && isPriorityRoute) {
      setSelectedRouteType(QuoteType.Private);
      triggerAddressableEvent('v4_user_selected_private');
    } else if (isBestRouteSlot) {
      console.log('isBestRouteSlot', isBestRouteSlot);
      setSelectedRouteType(BestRouteType.BEST);
      triggerAddressableEvent('v4_user_selected_dex');
    } else if (selectedRoute?.type === QuoteType.Standard && isPriorityRoute) {
      setSelectedRouteType(QuoteType.Standard);
      triggerAddressableEvent('v4_user_selected_no_wallet_connection_req');
    } else {
      resetSelectedRouteType();
      triggerAddressableEvent('v4_user_selected_custom_route');
    }
  };

  const onClickHandler = (value: string) => {
    if (isNonSelectable) return;
    setSelectedRouteCardId(value);
    handleRouteChange();
  };

  const isSelected = selectedRouteCardId === uniqueCardId;

  const isValidAmounts =
    Number.isFinite(netOutAmountUsd) &&
    Number.isFinite(inAmountUsd) &&
    inAmountUsd !== 0;
  const percentageDifference = isValidAmounts
    ? ((netOutAmountUsd - inAmountUsd) / inAmountUsd) * 100
    : null;

  const isAmountOutUsdLessThanInAmountUsd = netOutAmountUsd <= inAmountUsd;

  // Helper: should show min/max info
  const shouldShowMinMaxInfo =
    minMax &&
    Array.isArray(minMax) &&
    minMax.length === 2 &&
    (amountIn < minMax[0] || amountIn > minMax[1]) &&
    !isAllQuoteQueryLoading;

  return (
    <label
      className={cn(
        'group bg-card hover:border-primary/50 relative flex min-h-[132px] w-full cursor-pointer items-center justify-between overflow-hidden rounded-xl border p-4 shadow-xs backdrop-blur-xs transition-all duration-200 hover:bg-neutral-800/50 hover:shadow-md',
        'has-data-[state=checked]:bg-accent/10',
        isFiltered && 'cursor-not-allowed',
        'has-focus-visible:outline-ring/70 has-focus-visible:outline has-data-disabled:opacity-90',
        isSelected &&
          'border-primary bg-accent/10 ring-primary shadow-md ring-1'
      )}
      role="radio"
      aria-checked={isSelected && !isNonSelectable}
      onClick={() => onClickHandler(uniqueCardId)}
    >
      {isSelected && !isNonSelectable && (
        <span className="absolute right-4 bottom-4 z-10 flex items-center gap-1">
          <CircleCheckIcon
            className="text-primary animate-in fade-in h-6 w-6 drop-shadow-lg"
            aria-hidden="true"
          />
          <span className="sr-only">Selected</span>
        </span>
      )}
      <RadioGroupItem
        value={uniqueCardId}
        id={uniqueCardId}
        className="sr-only after:absolute after:inset-0"
        disabled={
          isDisabled || Boolean(isFiltered) || isNoAvailableRoute || isInitial
        }
      />

      <div className="flex h-full w-full flex-col justify-between gap-3">
        <ProtocolBadge
          protocol={protocol}
          swapAggregator={swapAggregator}
          swapName={swapName}
          path={path}
          isFiltered={isFiltered || false}
          isPriorityRoute={isPriorityRoute}
          isBestRouteSlot={isBestRouteSlot}
        />

        {/* Min/Max info logic */}
        {isNoAvailableRoute && shouldShowMinMaxInfo ? (
          <MinMaxInfoMessage
            min={minMax[0]}
            max={minMax[1]}
            amountIn={amountIn}
          />
        ) : isNoAvailableRoute ? (
          <NoAvailableRouteMessage />
        ) : (
          <>
            <div className="flex items-center gap-2">
              {partnerLogoUrl && amountOut > 0 && (
                <Image
                  src={partnerLogoUrl}
                  alt="Partner Logo"
                  width={24}
                  height={24}
                  className="rounded-md"
                />
              )}
              <AmountDisplay
                amountOut={amountOut}
                netOutAmount={netOutAmount}
                isSkeleton={isSkeleton}
              />
            </div>

            <div className="text-muted-foreground text-label-xs flex items-center gap-3 tabular-nums">
              {!isInitial && (
                <RouteInfo
                  gasFeeUsd={gasFeeUsd}
                  duration={duration}
                  isSkeleton={isSkeleton}
                />
              )}
              {!isSkeleton && isAmountOutUsdLessThanInAmountUsd && (
                <UsdPrice usdPrice={outAmountUsd} />
              )}

              {!isSkeleton &&
                percentageDifference &&
                isAmountOutUsdLessThanInAmountUsd && (
                  <RouteDifferenceTooltip
                    inAmountUsd={inAmountUsd}
                    netOutAmountUsd={netOutAmountUsd}
                    percentageDifference={percentageDifference}
                  />
                )}
            </div>
          </>
        )}
      </div>
    </label>
  );
}
