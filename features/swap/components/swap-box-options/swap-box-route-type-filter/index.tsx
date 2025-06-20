import { useTranslations } from 'next-intl';

import { Separator } from '@/components/ui/separator';
import { EXTERNAL_URLS } from '@/constants/urls';
import { RouteFilterItem } from '@/features/swap/components/swap-box-options/swap-box-route-type-filter/route-filter-item';
import { RouteFiltersType } from '@/features/swap/components/swap-box-options/types';
import { useRouteTypeFilters } from '@/features/swap/hooks/use-route-type-filters';
import { useRouteTypeFilterStore } from '@/features/swap/stores/use-swap-store';

export function SwapBoxRouteTypeFilter({
  isQuoteLoading,
}: {
  isQuoteLoading?: boolean;
}) {
  const tooltipT = useTranslations('swap.toolTipInfo');
  const t = useTranslations('swap.options');
  const hasActiveRouteTypeFilters = useRouteTypeFilterStore((state) =>
    state.hasActiveRouteTypeFilters(state)
  );

  const {
    routeTypeFilters,
    hasPrivateCexRoute,
    hasStandardCexRoute,
    hasDexRoutes,
    routes,
    updateFilteredRoutes,
  } = useRouteTypeFilters(isQuoteLoading);

  if (!hasActiveRouteTypeFilters) return null;

  return (
    <>
      <div>
        <h5 className="text-label-sm mb-4">{t('routes')}</h5>
        <div className="flex items-center gap-4">
          {hasDexRoutes && (
            <RouteFilterItem
              id="show-dex"
              label="dex"
              count={routes.dexRoutes.length}
              checked={routeTypeFilters.showDex}
              onCheckedChange={(checked) =>
                updateFilteredRoutes(checked, RouteFiltersType.SHOW_DEX)
              }
              filterType={RouteFiltersType.SHOW_DEX}
              tooltipTitle={tooltipT('connectWallet')}
            />
          )}

          {hasStandardCexRoute && (
            <RouteFilterItem
              id="show-standard-cex"
              label="walletless"
              count={routes.standardCexRoutes.length}
              checked={routeTypeFilters.showStandardCex}
              onCheckedChange={(checked) =>
                updateFilteredRoutes(
                  checked,
                  RouteFiltersType.SHOW_STANDARD_CEX
                )
              }
              filterType={RouteFiltersType.SHOW_STANDARD_CEX}
              tooltipTitle={tooltipT('standardTitle')}
              tooltipDescription={tooltipT('standardDescription')}
              docsUrl={EXTERNAL_URLS.DOCS_STANDARD_SWAP}
              tooltipLearnMore={tooltipT('learnMore')}
            />
          )}

          {hasPrivateCexRoute && (
            <RouteFilterItem
              id="show-private-cex"
              label="private"
              count={routes.privateCexRoutes.length}
              checked={routeTypeFilters.showPrivateCex}
              onCheckedChange={(checked) =>
                updateFilteredRoutes(checked, RouteFiltersType.SHOW_PRIVATE_CEX)
              }
              filterType={RouteFiltersType.SHOW_PRIVATE_CEX}
              tooltipTitle={tooltipT('privateTitle')}
              tooltipDescription={tooltipT('privateDescription')}
              docsUrl={EXTERNAL_URLS.DOCS_PRIVATE_SWAP}
              tooltipLearnMore={tooltipT('learnMore')}
            />
          )}
        </div>
      </div>
      <Separator />
    </>
  );
}
