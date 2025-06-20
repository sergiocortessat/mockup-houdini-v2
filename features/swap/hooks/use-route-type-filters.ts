import { useEffect } from 'react';

import { RouteFiltersType } from '@/features/swap/components/swap-box-options/types';
import {
  useRouteTypeFilterStore,
  useRoutesStore,
} from '@/features/swap/stores/use-swap-store';
import { calculateTotalRoutes } from '@/features/swap/utils/route-helpers';

export const useRouteTypeFilters = (isQuoteLoading?: boolean) => {
  const initialRoutes = useRoutesStore((state) => state.initialRoutes);
  const applyFilters = useRoutesStore((state) => state.applyFilters);
  const resetFilters = useRoutesStore((state) => state.resetFilters);

  const routeTypeFilters = useRouteTypeFilterStore(
    (state) => state.routeTypeFilters
  );
  const setRouteTypeFilter = useRouteTypeFilterStore(
    (state) => state.setRouteTypeFilter
  );
  const setAllRouteTypeFilters = useRouteTypeFilterStore(
    (state) => state.setAllRouteTypeFilters
  );

  const { hasPrivateCexRoute, hasStandardCexRoute, hasDexRoutes } =
    calculateTotalRoutes(initialRoutes);

  // Update filtered routes using the new store API
  const updateFilteredRoutes = (
    checked: boolean,
    filterType: RouteFiltersType
  ) => {
    // Build the new filter state
    const newFilters = {
      ...routeTypeFilters,
      [filterType]: checked,
    };
    setRouteTypeFilter(filterType, checked);
    applyFilters(newFilters);
  };

  useEffect(() => {
    if (isQuoteLoading) return;

    const noActiveFilters =
      !routeTypeFilters.showDex &&
      !routeTypeFilters.showStandardCex &&
      !routeTypeFilters.showPrivateCex;

    if (noActiveFilters) {
      resetFilters();
      // Optionally update filter states to match available routes
      if (hasDexRoutes || hasStandardCexRoute || hasPrivateCexRoute) {
        setAllRouteTypeFilters({
          showDex: hasDexRoutes,
          showStandardCex: hasStandardCexRoute,
          showPrivateCex: hasPrivateCexRoute,
        });
      }
    } else {
      applyFilters(routeTypeFilters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    routeTypeFilters,
    isQuoteLoading,
    hasDexRoutes,
    hasStandardCexRoute,
    hasPrivateCexRoute,
  ]);

  return {
    routeTypeFilters,
    hasPrivateCexRoute,
    hasStandardCexRoute,
    hasDexRoutes,
    routes: initialRoutes,
    updateFilteredRoutes,
  };
};
