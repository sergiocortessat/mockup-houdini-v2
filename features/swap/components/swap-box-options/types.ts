import { RoutesStoreState } from '@/features/swap/stores/use-swap-store';

export interface RouteFilters {
  showDex: boolean;
  showStandardCex: boolean;
  showPrivateCex: boolean;
}

export interface SwapBoxRouteFiltersProps {
  filters: RouteFilters;
  onFiltersChange: (filters: RouteFilters) => void;
  hasPrivateCexRoute: boolean;
  hasStandardCexRoute: boolean;
  hasDexRoutes: boolean;
  isQuoteLoading: boolean;
  routes: RoutesStoreState['filteredRoutes'];
}

export enum RouteFiltersType {
  SHOW_DEX = 'showDex',
  SHOW_STANDARD_CEX = 'showStandardCex',
  SHOW_PRIVATE_CEX = 'showPrivateCex',
}
