import { RenderRouteCardByRouteType } from '@/features/swap/components/swap-box-routes/swap-box-route-card/render-route-card';
import { RouteSlotProps } from '@/features/swap/types';

export function RouteSlot({
  route,
  skeleton,
  isLoading,
  isPriorityRoute = false,
  isInitial = false,
  tokenOutUsd,
  inAmount,
  inAmountUsd,
  minMax,
  isBestRouteSlot = false,
}: RouteSlotProps) {
  if (route) {
    return (
      <RenderRouteCardByRouteType
        route={route}
        tokenOutUsd={tokenOutUsd}
        inAmount={inAmount}
        inAmountUsd={inAmountUsd}
        isPriorityRoute={isPriorityRoute}
        minMax={minMax}
        isBestRouteSlot={isBestRouteSlot}
      />
    );
  }
  if (isInitial || isLoading) {
    return (
      <RenderRouteCardByRouteType
        route={skeleton}
        tokenOutUsd={tokenOutUsd}
        inAmount={inAmount}
        inAmountUsd={inAmountUsd}
        isPriorityRoute={isPriorityRoute}
        isInitial={isInitial}
        minMax={minMax}
        isBestRouteSlot={isBestRouteSlot}
      />
    );
  }

  // No route available: show card with isNoAvailableRoute
  return (
    <RenderRouteCardByRouteType
      route={skeleton}
      tokenOutUsd={tokenOutUsd}
      inAmount={inAmount}
      inAmountUsd={inAmountUsd}
      isPriorityRoute={isPriorityRoute}
      isNoAvailableRoute={true}
      minMax={minMax}
      isBestRouteSlot={isBestRouteSlot}
    />
  );
}
