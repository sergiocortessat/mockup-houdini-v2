import { useEffect, useMemo } from 'react';

import {
  useRoutePartnerFilterStore,
  useRoutesStore,
} from '@/features/swap/stores/use-swap-store';
import { GroupPartners, RoutePartnerGroupType } from '@/features/swap/types';
import { useGetSwapsQuery } from '@/graphql/generated';

export const useRoutePartnerFilters = () => {
  const { data: partnersRoutes, loading: isPartnerFilterLoading } =
    useGetSwapsQuery();

  const routePartnerFilters = useRoutePartnerFilterStore(
    (state) => state.routePartnerFilters
  );
  const setRoutePartnerFilter = useRoutePartnerFilterStore(
    (state) => state.setRoutePartnerFilter
  );
  const setAllRoutePartnerFilters = useRoutePartnerFilterStore(
    (state) => state.setAllRoutePartnerFilters
  );

  const applyAllFilters = useRoutesStore.getState().applyFilters;

  // --- GROUP PARTNER FILTERS LOGIC ---
  // Compute groupings
  const groupPartners = useMemo(() => {
    if (!partnersRoutes?.swaps) {
      return { dex: [], cex: [] };
    }

    return {
      dex: partnersRoutes.swaps.dexes.map((dex) => ({
        name: dex.name,
        logoUrl: dex.logoUrl || undefined,
        isDex: true,
        enabled: dex.enabled,
      })),
      cex: partnersRoutes.swaps.cexes.map((cex) => ({
        name: cex.name,
        logoUrl: cex.logoUrl || undefined,
        isDex: false,
        enabled: cex.enabled,
      })),
    } as GroupPartners;
  }, [partnersRoutes]);

  // Helper: is group checked (all partners in group are checked)
  const isGroupChecked = (group: RoutePartnerGroupType): boolean => {
    const partners = groupPartners[group];
    return (
      partners.length > 0 && partners.every((p) => routePartnerFilters[p.name])
    );
  };

  // Handler: toggle all partners in a group
  const updateGroupPartnerFilters = (
    group: RoutePartnerGroupType,
    checked: boolean
  ) => {
    const partners = groupPartners[group];
    const newFilters = { ...routePartnerFilters };
    partners.forEach((p) => {
      newFilters[p.name] = checked;
    });
    setAllRoutePartnerFilters(newFilters);
    // Call unified filter
    applyAllFilters(newFilters);
  };

  // Get unique swap partners from all routes
  const swapPartners = useMemo(() => {
    if (!partnersRoutes?.swaps) {
      return [];
    }

    const partners = new Set<string>();

    partnersRoutes.swaps.dexes.forEach((dex) => {
      if (dex.name) {
        partners.add(dex.name);
      }
    });

    partnersRoutes.swaps.cexes.forEach((cex) => {
      if (cex.name) {
        partners.add(cex.name);
      }
    });

    return Array.from(partners);
  }, [partnersRoutes]);

  // Initialize all partners as selected only if there are no existing filters
  useEffect(() => {
    if (!partnersRoutes?.swaps) return;

    // Only initialize if there are no existing filters
    if (Object.keys(routePartnerFilters).length === 0) {
      const initialFilters = swapPartners.reduce(
        (acc, partner) => {
          acc[partner] = true;
          return acc;
        },
        {} as Record<string, boolean>
      );

      setAllRoutePartnerFilters(initialFilters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [swapPartners]);

  // Get routes count by partner
  const routeCountByPartner = useMemo(() => {
    if (!partnersRoutes?.swaps) {
      return {};
    }

    const counts: Record<string, number> = {};

    // Count DEX routes
    partnersRoutes.swaps.dexes.forEach((dex) => {
      if (dex.name) {
        counts[dex.name] = (counts[dex.name] || 0) + 1;
      }
    });

    // Count CEX routes
    partnersRoutes.swaps.cexes.forEach((cex) => {
      if (cex.name) {
        counts[cex.name] = (counts[cex.name] || 0) + 1;
      }
    });

    return counts;
  }, [partnersRoutes]);

  // Filter routes by selected partners
  const updateFilteredRoutes = (checked: boolean, partnerName: string) => {
    setRoutePartnerFilter(partnerName, checked);
    // Get the latest state of filters and apply them
    const latestFilters = {
      ...routePartnerFilters,
      [partnerName]: checked,
    };
    // Call unified filter with the latest state
    applyAllFilters(latestFilters);
  };

  return {
    routePartnerFilters,
    swapPartners,
    routeCountByPartner,
    updateFilteredRoutes,
    groupPartners,
    updateGroupPartnerFilters,
    isGroupChecked,
    isPartnerFilterLoading,
  };
};
