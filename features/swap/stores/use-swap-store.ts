import { create } from 'zustand';

import { SlippageValue } from '@/features/swap/constants';
import { Quote, QuoteType, Route } from '@/graphql/generated';

export interface SwapState {
  from: string;
  to: string;
  amount: string;
  address: string;
  amountOut: number;
}

interface MultiSwapStore {
  swaps: SwapState[];
  addSwap: (swap: SwapState) => void;
  removeSwap: (index: number) => void;
  updateSwap: (index: number, swap: SwapState) => void;
  clearSwaps: () => void;
}

export const useMultiSwapStore = create<MultiSwapStore>()((set) => ({
  swaps: [],
  addSwap: (swap) => set((state) => ({ swaps: [...state.swaps, swap] })),
  removeSwap: (index) =>
    set((state) => ({
      swaps: state.swaps.filter((_, i) => i !== index),
    })),
  updateSwap: (index, swap) =>
    set((state) => ({
      swaps: state.swaps.map((s, i) => (i === index ? swap : s)),
    })),
  clearSwaps: () => set({ swaps: [] }),
}));

// all routes
export interface RoutesStoreState {
  initialRoutes: {
    dexRoutes: Route[];
    standardCexRoutes: Quote[];
    privateCexRoutes: Quote[];
  };
  filteredRoutes: {
    dexRoutes: Route[];
    standardCexRoutes: Quote[];
    privateCexRoutes: Quote[];
  };
  setRoutes: <T extends keyof RoutesStoreState['initialRoutes']>(
    key: T,
    routes: RoutesStoreState['initialRoutes'][T]
  ) => void;
  applyFilters: (partnerFilters: Record<string, boolean>) => void;
  resetFilters: () => void;
  resetRoutes: () => void;
  getBestPrivateRoute: () => Quote | null;
  getBestStandardCexRoute: () => Quote | null;
  getBestDexRoute: () => Route | null;
  getBestRoute: () => Route | Quote | null;
}

// Helper to check if a route or quote is filtered
function isFiltered(route: any): boolean {
  return typeof route.filtered === 'boolean' ? route.filtered : false;
}

// Helper to merge and deduplicate routes by unique id
function mergeRoutesById<
  T extends { quoteId?: string | null; routeId?: string | null },
>(existing: T[], incoming: T[]): T[] {
  const map = new Map<string, T>();
  for (const route of existing) {
    const id = (route.quoteId ?? undefined) || (route.routeId ?? undefined);
    if (id) map.set(id, route);
  }
  for (const route of incoming) {
    const id = (route.quoteId ?? undefined) || (route.routeId ?? undefined);
    if (id) map.set(id, route);
  }
  return Array.from(map.values());
}

export const useRoutesStore = create<
  RoutesStoreState & {
    mergeRoutes: <T extends keyof RoutesStoreState['initialRoutes']>(
      key: T,
      routes: RoutesStoreState['initialRoutes'][T]
    ) => void;
  }
>((set, get) => ({
  initialRoutes: {
    dexRoutes: [],
    standardCexRoutes: [],
    privateCexRoutes: [],
  },
  filteredRoutes: {
    dexRoutes: [],
    standardCexRoutes: [],
    privateCexRoutes: [],
  },

  setRoutes: (key, routes) =>
    set((state) => ({
      initialRoutes: { ...state.initialRoutes, [key]: routes },
      filteredRoutes: { ...state.filteredRoutes, [key]: routes },
    })),
  mergeRoutes: (key, routes) =>
    set((state) => {
      const merged = mergeRoutesById(
        state.initialRoutes[key] as any[],
        routes as any[]
      );
      return {
        initialRoutes: { ...state.initialRoutes, [key]: merged },
        filteredRoutes: { ...state.filteredRoutes, [key]: merged },
      };
    }),
  resetRoutes: () =>
    set(() => ({
      initialRoutes: {
        dexRoutes: [],
        standardCexRoutes: [],
        privateCexRoutes: [],
      },
      filteredRoutes: {
        dexRoutes: [],
        standardCexRoutes: [],
        privateCexRoutes: [],
      },
    })),
  applyFilters: (partnerFilters) => {
    const { initialRoutes } = get();
    // Helper to filter by partner, preserving array type
    function filterByPartner<T extends Route | Quote>(routes: T[]): T[] {
      return routes.filter(
        (route) => !route.swapName || partnerFilters[route.swapName]
      );
    }
    set({
      filteredRoutes: {
        dexRoutes: filterByPartner(initialRoutes.dexRoutes),
        standardCexRoutes: filterByPartner(initialRoutes.standardCexRoutes),
        privateCexRoutes: filterByPartner(initialRoutes.privateCexRoutes),
      },
    });
  },
  resetFilters: () =>
    set((state) => ({
      filteredRoutes: { ...state.initialRoutes },
    })),

  getBestPrivateRoute: () => {
    const { filteredRoutes } = get();
    const candidates = filteredRoutes.privateCexRoutes.filter(
      (route) => !isFiltered(route)
    );
    if (candidates.length === 0) return null;
    const maxAmountOut = Math.max(...candidates.map((r) => r.amountOut || 0));
    return candidates.find((route) => route.amountOut === maxAmountOut) || null;
  },

  getBestStandardCexRoute: () => {
    const { filteredRoutes } = get();
    const candidates = filteredRoutes.standardCexRoutes.filter(
      (route) => !isFiltered(route)
    );
    if (candidates.length === 0) return null;
    const maxAmountOut = Math.max(...candidates.map((r) => r.amountOut || 0));
    return candidates.find((route) => route.amountOut === maxAmountOut) || null;
  },

  getBestDexRoute: () => {
    const { filteredRoutes } = get();
    const candidates = filteredRoutes.dexRoutes.filter(
      (route) => !isFiltered(route)
    );
    if (candidates.length === 0) return null;
    const maxNetAmountOut = Math.max(
      ...candidates.map((r) => r.netAmountOut || 0)
    );
    return (
      candidates.find((route) => route.netAmountOut === maxNetAmountOut) || null
    );
  },

  getBestRoute: () => {
    const { filteredRoutes } = get();
    // Combine all filtered routes into one array
    const allRoutes = [
      ...filteredRoutes.privateCexRoutes,
      ...filteredRoutes.standardCexRoutes,
      ...filteredRoutes.dexRoutes,
    ];
    // Filter out routes that are marked as filtered
    const candidates = allRoutes.filter((route) => !isFiltered(route));
    if (candidates.length === 0) return null;
    // Find the best route by comparing amountOut (CEX) and netAmountOut (DEX)
    let bestRoute = candidates[0];
    let bestValue =
      'netAmountOut' in bestRoute && typeof bestRoute.netAmountOut === 'number'
        ? bestRoute.netAmountOut
        : bestRoute.amountOut || 0;
    for (const route of candidates) {
      const value =
        'netAmountOut' in route && typeof route.netAmountOut === 'number'
          ? route.netAmountOut
          : route.amountOut || 0;
      if (value > bestValue) {
        bestRoute = route;
        bestValue = value;
      }
    }
    return bestRoute || null;
  },
}));

export enum BestRouteType {
  BEST = 'BEST',
}

interface SelectedRouteState {
  selectedRoute: Route | Quote | null;
  setSelectedRoute: (route: SelectedRouteState['selectedRoute']) => void;
  resetSelectedRoute: () => void;
  selectedRouteType: QuoteType | BestRouteType | null;
  setSelectedRouteType: (type: QuoteType | BestRouteType | null) => void;
  resetSelectedRouteType: () => void;
  selectedRouteCardId: string | null;
  setSelectedRouteCardId: (cardId: string | null) => void;
  resetSelectedRouteCardId: () => void;
}

export const useSelectedRouteStore = create<SelectedRouteState>((set) => ({
  selectedRoute: null,
  setSelectedRoute: (route) => set({ selectedRoute: route }),
  resetSelectedRoute: () => set({ selectedRoute: null }),
  selectedRouteType: null,
  setSelectedRouteType: (type) => set({ selectedRouteType: type }),
  resetSelectedRouteType: () => set({ selectedRouteType: null }),
  selectedRouteCardId: null,
  setSelectedRouteCardId: (cardId) => set({ selectedRouteCardId: cardId }),
  resetSelectedRouteCardId: () => set({ selectedRouteCardId: null }),
}));

// Route type filter states store
export interface RouteTypeFilterState {
  routeTypeFilters: {
    showDex: boolean;
    showStandardCex: boolean;
    showPrivateCex: boolean;
  };
  setRouteTypeFilter: (
    key: keyof RouteTypeFilterState['routeTypeFilters'],
    value: boolean
  ) => void;
  setAllRouteTypeFilters: (
    filters: RouteTypeFilterState['routeTypeFilters']
  ) => void;
  resetRouteTypeFilters: () => void;
  hasActiveRouteTypeFilters: (state: RouteTypeFilterState) => boolean;
}

export const useRouteTypeFilterStore = create<RouteTypeFilterState>((set) => ({
  routeTypeFilters: {
    showDex: false,
    showStandardCex: false,
    showPrivateCex: false,
  },
  setRouteTypeFilter: (key, value) => {
    set((state) => ({
      routeTypeFilters: { ...state.routeTypeFilters, [key]: value },
    }));
  },
  setAllRouteTypeFilters: (filters) => set({ routeTypeFilters: filters }),
  resetRouteTypeFilters: () =>
    set({
      routeTypeFilters: {
        showDex: false,
        showStandardCex: false,
        showPrivateCex: false,
      },
    }),
  hasActiveRouteTypeFilters: (state: RouteTypeFilterState) =>
    Object.values(state.routeTypeFilters).some((value) => value === true),
}));

// Route partner filter states store
export interface RoutePartnerFilterState {
  routePartnerFilters: Record<string, boolean>;
  setRoutePartnerFilter: (key: string, value: boolean) => void;
  setAllRoutePartnerFilters: (filters: Record<string, boolean>) => void;
  resetRoutePartnerFilters: () => void;
  hasActiveRoutePartnerFilters: (state: RoutePartnerFilterState) => boolean;
}

export const useRoutePartnerFilterStore = create<RoutePartnerFilterState>(
  (set) => ({
    routePartnerFilters: {},
    setRoutePartnerFilter: (key, value) => {
      set((state) => ({
        routePartnerFilters: { ...state.routePartnerFilters, [key]: value },
      }));
    },
    setAllRoutePartnerFilters: (filters) =>
      set({ routePartnerFilters: filters }),
    resetRoutePartnerFilters: () => set({ routePartnerFilters: {} }),
    hasActiveRoutePartnerFilters: (state: RoutePartnerFilterState) =>
      Object.values(state.routePartnerFilters).some((value) => value === true),
  })
);

interface JustSwitchedState {
  justSwitched: boolean;
  setJustSwitched: (justSwitched: boolean) => void;
}

export const useJustSwitchedStore = create<JustSwitchedState>((set) => ({
  justSwitched: false,
  setJustSwitched: (justSwitched) => set({ justSwitched }),
}));

// Slippage store
interface SlippageState {
  selectedSlippage: SlippageValue;
  customSlippage: string;
  isCustom: boolean;
  slippageValue: number | null;
  setSelectedSlippage: (value: SlippageValue) => void;
  setCustomSlippage: (value: string) => void;
  setIsCustom: (value: boolean) => void;
  updateSlippageState: (state: {
    selectedSlippage: SlippageValue;
    customSlippage: string;
    isCustom: boolean;
  }) => void;
}

const calculateSlippageValue = (
  selectedSlippage: SlippageValue,
  customSlippage: string,
  isCustom: boolean
): number | null => {
  if (isCustom && customSlippage) {
    return parseFloat(customSlippage) / 100; // Convert percentage to decimal
  }
  if (selectedSlippage === SlippageValue.AUTO) {
    return null;
  }
  return parseFloat(selectedSlippage) / 100; // Convert percentage to decimal
};

export const useSlippageStore = create<SlippageState>((set, get) => ({
  selectedSlippage: SlippageValue.AUTO,
  customSlippage: '',
  isCustom: false,
  slippageValue: null,
  setSelectedSlippage: (value) =>
    set((state) => ({
      selectedSlippage: value,
      slippageValue: calculateSlippageValue(value, state.customSlippage, false),
      isCustom: false,
      customSlippage: '',
    })),
  setCustomSlippage: (value) =>
    set((state) => ({
      customSlippage: value,
      slippageValue: value
        ? calculateSlippageValue(state.selectedSlippage, value, true)
        : null,
      isCustom: !!value,
      selectedSlippage: value ? SlippageValue.CUSTOM : SlippageValue.AUTO,
    })),
  setIsCustom: (value) =>
    set((state) => ({
      isCustom: value,
      slippageValue: calculateSlippageValue(
        state.selectedSlippage,
        state.customSlippage,
        value
      ),
    })),
  updateSlippageState: (newState) =>
    set(() => ({
      ...newState,
      slippageValue: calculateSlippageValue(
        newState.selectedSlippage,
        newState.customSlippage,
        newState.isCustom
      ),
    })),
}));

export interface SwapLoadingState {
  isAllQuoteQueryLoading: boolean;
  setIsAllQuoteQueryLoading: (loading: boolean) => void;
  isSwapping: boolean;
  setIsSwapping: (swapping: boolean) => void;
}

export const useSwapLoadingStore = create<SwapLoadingState>((set) => ({
  isAllQuoteQueryLoading: false,
  setIsAllQuoteQueryLoading: (loading) =>
    set({ isAllQuoteQueryLoading: loading }),
  isSwapping: false,
  setIsSwapping: (swapping) => set({ isSwapping: swapping }),
}));
