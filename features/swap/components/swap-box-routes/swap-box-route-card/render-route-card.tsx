import { HOUDINI_PRIVATE_PARTNER_LOGO_URL } from '@/constants/urls';
import { SwapBoxRouteCard } from '@/features/swap/components/swap-box-routes/swap-box-route-card';
import { useSwapUrlParams } from '@/features/swap/hooks/use-swap-url-params';
import { RenderRouteCardByRouteTypeProps } from '@/features/swap/types';
import { Quote, Route } from '@/graphql/generated';
import { QuoteType } from '@/graphql/generated';

export const RenderRouteCardByRouteType = ({
  route,
  tokenOutUsd,
  inAmount,
  inAmountUsd,
  isPriorityRoute = false,
  isNoAvailableRoute = false,
  isInitial = false,
  minMax,
  isBestRouteSlot = false,
}: RenderRouteCardByRouteTypeProps) => {
  const isDexRoute = route.type === QuoteType.Dex;
  const isStandardCexRoute = route.type === QuoteType.Standard;
  const isPrivateCexRoute = route.type === QuoteType.Private;

  const { isMultiSwap } = useSwapUrlParams();

  if (isDexRoute) {
    const dexRoute = route as Route;
    const dexRouteId = dexRoute.quoteId;
    const netOutAmount = dexRoute.netAmountOut || 0;
    const netOutAmountUsd = netOutAmount * tokenOutUsd;
    const swapName = dexRoute.swapName;
    const isFiltered = dexRoute.filtered;

    return (
      <SwapBoxRouteCard
        key={dexRouteId}
        amountOut={dexRoute.amountOut || 0}
        protocol={dexRoute.path?.[0]?.toUpperCase() || QuoteType.Dex}
        routeId={dexRouteId || ''}
        tokenOutUsd={tokenOutUsd}
        gasFeeUsd={dexRoute.gasUsd}
        duration={dexRoute.duration}
        swapAggregator={route.swap || ''}
        swapName={swapName}
        path={dexRoute.path?.[0]}
        isDisabled={isMultiSwap}
        inAmount={inAmount}
        inAmountUsd={inAmountUsd}
        netOutAmount={netOutAmount}
        netOutAmountUsd={netOutAmountUsd}
        isFiltered={isFiltered}
        isNoAvailableRoute={isNoAvailableRoute}
        isInitial={isInitial}
        isPriorityRoute={isPriorityRoute}
        partnerLogoUrl={dexRoute.logoUrl}
        minMax={minMax}
        isBestRouteSlot={isBestRouteSlot}
        quoteType={QuoteType.Dex}
      />
    );
  }

  if (isStandardCexRoute) {
    const standardCexRoute = route as Quote;
    const standardCexRouteId =
      standardCexRoute.outQuoteId || standardCexRoute.quoteId;
    const amountOut = standardCexRoute.amountOut || 0;
    const netOutAmountUsd = amountOut * tokenOutUsd;
    const swapName = standardCexRoute.swapName;

    return (
      <SwapBoxRouteCard
        key={standardCexRouteId}
        amountOut={amountOut}
        protocol={QuoteType.Standard}
        routeId={standardCexRouteId || ''}
        tokenOutUsd={tokenOutUsd}
        duration={standardCexRoute.duration}
        inAmount={inAmount}
        inAmountUsd={inAmountUsd}
        netOutAmount={amountOut}
        netOutAmountUsd={netOutAmountUsd}
        swapName={swapName}
        isNoAvailableRoute={isNoAvailableRoute}
        isInitial={isInitial}
        isPriorityRoute={isPriorityRoute}
        partnerLogoUrl={standardCexRoute.logoUrl}
        minMax={minMax}
        isBestRouteSlot={isBestRouteSlot}
        quoteType={QuoteType.Standard}
      />
    );
  }

  if (isPrivateCexRoute) {
    const privateCexRoute = route as Quote;
    const privateCexRouteId =
      privateCexRoute.outQuoteId || privateCexRoute.quoteId;
    const amountOut = privateCexRoute.amountOut || 0;
    const netOutAmountUsd = amountOut * tokenOutUsd;
    const partnerLogoUrl = HOUDINI_PRIVATE_PARTNER_LOGO_URL;
    return (
      <SwapBoxRouteCard
        key={privateCexRouteId}
        amountOut={amountOut}
        protocol={QuoteType.Private}
        routeId={privateCexRouteId || ''}
        tokenOutUsd={tokenOutUsd}
        duration={privateCexRoute.duration}
        inAmount={inAmount}
        inAmountUsd={inAmountUsd}
        netOutAmount={amountOut}
        netOutAmountUsd={netOutAmountUsd}
        swapName={privateCexRoute.swapName}
        isNoAvailableRoute={isNoAvailableRoute}
        isInitial={isInitial}
        isPriorityRoute={isPriorityRoute}
        partnerLogoUrl={partnerLogoUrl}
        minMax={minMax}
        isBestRouteSlot={isBestRouteSlot}
        quoteType={QuoteType.Private}
      />
    );
  }

  return null;
};
