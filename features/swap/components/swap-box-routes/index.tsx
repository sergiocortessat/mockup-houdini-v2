import { AnimatePresence, motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RadioGroup } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { RouteSlot } from '@/features/swap/components/swap-box-routes/route-slot';
import { RenderRouteCardByRouteType } from '@/features/swap/components/swap-box-routes/swap-box-route-card/render-route-card';
import SwapRefreshTimer from '@/features/swap/components/swap-box-routes/swap-refresh-timer';
import { SKELETON_ROUTES } from '@/features/swap/constants';
import {
  useRoutesStore,
  useSwapLoadingStore,
} from '@/features/swap/stores/use-swap-store';
import { SwapBoxRoutesProps } from '@/features/swap/types';
import { sortRoutesByPrice } from '@/features/swap/utils/route-helpers';
import { isWidgetMode } from '@/features/widget/utils/widget-utils';
import { cn } from '@/lib/utils';
import { triggerAddressableEvent } from '@/utils/addressable-event';

export function SwapBoxRoutes({
  className,
  tokenOutUsd,
  inAmount,
  inAmountUsd,
  refetchAllQuote,
  minMax,
}: SwapBoxRoutesProps) {
  const t = useTranslations('swap.routes');
  const filteredRoutes = useRoutesStore((state) => state.filteredRoutes);

  const combinedRoutes = useMemo(
    () =>
      sortRoutesByPrice([
        ...filteredRoutes.dexRoutes,
        ...filteredRoutes.standardCexRoutes,
        ...filteredRoutes.privateCexRoutes,
      ]),
    [
      filteredRoutes.dexRoutes,
      filteredRoutes.standardCexRoutes,
      filteredRoutes.privateCexRoutes,
    ]
  );

  const bestPrivateRoute = useRoutesStore((state) =>
    state.getBestPrivateRoute()
  );
  const bestStandardCexRoute = useRoutesStore((state) =>
    state.getBestStandardCexRoute()
  );
  const bestRoute = useRoutesStore((state) => state.getBestRoute());

  const isAllQuoteQueryLoading = useSwapLoadingStore(
    (state) => state.isAllQuoteQueryLoading
  );
  const [showAllRoutes, setShowAllRoutes] = useState(false);

  const handleShowAllRoutes = () => {
    setShowAllRoutes(!showAllRoutes);
    if (!showAllRoutes) {
      triggerAddressableEvent('v4_user_press_see_more_routes');
    }
  };

  const shouldShowTimer =
    !isAllQuoteQueryLoading && inAmount > 0 && combinedRoutes.length > 0;

  return (
    <Card
      className={cn(
        isWidgetMode
          ? 'w-full lg:min-h-[500px] lg:w-[380px]'
          : 'flex max-h-fit w-full flex-col gap-4 rounded-2xl md:rounded-4xl lg:w-[400px]',
        className
      )}
    >
      <div className="flex h-[29px] items-center gap-5 px-2">
        <h2 className="text-label-lg">{t('title')}</h2>

        {shouldShowTimer && (
          <SwapRefreshTimer refetchAllQuote={refetchAllQuote} />
        )}
      </div>

      <div className="flex flex-col justify-between gap-4">
        <RadioGroup className="gap-4">
          {/* best private route */}
          <RouteSlot
            route={bestPrivateRoute}
            skeleton={SKELETON_ROUTES[0]}
            isLoading={isAllQuoteQueryLoading}
            isPriorityRoute={true}
            isInitial={inAmount === 0}
            tokenOutUsd={tokenOutUsd}
            inAmount={inAmount}
            inAmountUsd={inAmountUsd}
            minMax={minMax.privateCex}
          />

          {/* best  route */}
          <RouteSlot
            route={bestRoute}
            skeleton={SKELETON_ROUTES[1]}
            isLoading={isAllQuoteQueryLoading}
            isPriorityRoute={true}
            isInitial={inAmount === 0}
            tokenOutUsd={tokenOutUsd}
            inAmount={inAmount}
            inAmountUsd={inAmountUsd}
            minMax={minMax.dex}
            isBestRouteSlot={true}
          />

          {/* best standard route */}
          <RouteSlot
            route={bestStandardCexRoute}
            skeleton={SKELETON_ROUTES[2]}
            isLoading={isAllQuoteQueryLoading}
            isPriorityRoute={true}
            isInitial={inAmount === 0}
            tokenOutUsd={tokenOutUsd}
            inAmount={inAmount}
            inAmountUsd={inAmountUsd}
            minMax={minMax.standardCex}
          />

          {/* Remaining Routes */}
          {combinedRoutes.length > 0 && (
            <AnimatePresence>
              {showAllRoutes && (
                <>
                  <div className="my-2 flex items-center justify-center overflow-hidden">
                    <Separator />
                    <div className="text-heading-sm text-muted-foreground min-w-fit px-2">
                      {t('allRoutes')}
                    </div>
                    <Separator />
                  </div>
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="max-h-[40vh] space-y-3 overflow-y-auto px-2"
                  >
                    {combinedRoutes.map((route) => (
                      <RenderRouteCardByRouteType
                        key={route.quoteId}
                        route={route}
                        tokenOutUsd={tokenOutUsd}
                        inAmount={inAmount}
                        inAmountUsd={inAmountUsd}
                      />
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          )}
        </RadioGroup>
        {/* Show More Button */}
        {combinedRoutes.length > 0 && (
          <Button
            variant="secondary"
            className="w-full"
            onClick={handleShowAllRoutes}
          >
            {showAllRoutes
              ? t('lessRoutes')
              : t('moreRoutes', { count: combinedRoutes.length })}
          </Button>
        )}
      </div>
    </Card>
  );
}
