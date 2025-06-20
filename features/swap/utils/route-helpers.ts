import { RoutesStoreState } from '@/features/swap/stores/use-swap-store';
import { Quote, QuoteType, Route } from '@/graphql/generated';

export const getRouteById = (
  id: string,
  routes: RoutesStoreState['filteredRoutes']
): Route | Quote | null => {
  return (
    routes.dexRoutes.find((route) => route.quoteId === id) ||
    routes.standardCexRoutes.find((route) => route.quoteId === id) ||
    routes.privateCexRoutes.find((route) => route.quoteId === id) ||
    null
  );
};

/**
 * Finds the highest amount out from all available routes
 * @param routes Object containing all available routes (DEX, standard CEX, private CEX)
 * @returns The highest amount out value
 */
export function findHighestAmountOut(
  routes: RoutesStoreState['filteredRoutes']
): number {
  const amounts = [
    Math.max(...routes.standardCexRoutes.map((route) => route.amountOut || 0)),
    Math.max(...routes.privateCexRoutes.map((route) => route.amountOut || 0)),
    ...(routes.dexRoutes?.map((route) => route.amountOut || 0) ?? []),
  ];

  return Math.max(...amounts);
}

/**
 * Calculates the total number of available routes and checks route existence
 * @param routes Object containing all available routes (DEX, standard CEX, private CEX)
 * @returns Object containing total routes count and route existence flags
 */
export function calculateTotalRoutes(
  routes: RoutesStoreState['filteredRoutes']
): {
  total: number;
  hasPrivateCexRoute: boolean;
  hasStandardCexRoute: boolean;
  hasDexRoutes: boolean;
} {
  const hasPrivateCexRoute =
    Object.keys(routes.privateCexRoutes || []).length > 0;
  const hasStandardCexRoute =
    Object.keys(routes.standardCexRoutes || []).length > 0;
  const hasDexRoutes = routes?.dexRoutes && routes.dexRoutes.length > 0;
  const dexRoutesCount = routes.dexRoutes?.length || 0;

  const total = [
    hasPrivateCexRoute ? 1 : 0,
    hasStandardCexRoute ? 1 : 0,
    dexRoutesCount,
  ].reduce((sum, count) => sum + count, 0);

  return {
    total,
    hasPrivateCexRoute,
    hasStandardCexRoute,
    hasDexRoutes,
  };
}

interface SkipAllQuoteParams {
  tokenIn?: {
    _id?: string;
    cexTokenId?: string | null;
  } | null;
  tokenOut?: {
    _id?: string;
    cexTokenId?: string | null;
  } | null;
  debouncedAmountIn: number;
}

export const shouldSkipAllQuote = ({
  tokenIn,
  tokenOut,
  debouncedAmountIn,
}: SkipAllQuoteParams): boolean => {
  return (
    !tokenIn?._id ||
    !tokenOut?._id ||
    !tokenIn?.cexTokenId ||
    !tokenOut?.cexTokenId ||
    !debouncedAmountIn
  );
};

interface SkipPrivateQuoteParams {
  tokenIn?: {
    cexTokenId?: string | null;
  } | null;
  tokenOut?: {
    cexTokenId?: string | null;
  } | null;
  debouncedAmountIn: number;
  isPrivate: boolean;
}

export const shouldSkipPrivateQuote = ({
  tokenIn,
  tokenOut,
  debouncedAmountIn,
  isPrivate,
}: SkipPrivateQuoteParams): boolean => {
  return (
    !isPrivate ||
    !tokenIn?.cexTokenId ||
    !tokenOut?.cexTokenId ||
    !debouncedAmountIn
  );
};

export const calculateBestAmountFromRoutes = (
  routes: RoutesStoreState['filteredRoutes']
) => {
  const { dexRoutes, standardCexRoutes, privateCexRoutes } = routes;
  const dexAmounts = dexRoutes.map((route) => route.amountOut || 0);
  const standardCexAmounts = standardCexRoutes.map(
    (quote) => quote.amountOut || 0
  );
  const privateCexAmounts = privateCexRoutes.map(
    (quote) => quote.amountOut || 0
  );
  const allAmounts = [
    ...dexAmounts,
    ...standardCexAmounts,
    ...privateCexAmounts,
  ];
  return allAmounts.length > 0 ? Math.max(...allAmounts) : 0;
};

/**
 * Returns the id of the route with the highest amountOut from all available routes
 * @param routes Object containing all available routes (DEX, standard CEX, private CEX)
 * @returns The id of the route with the best price (highest amountOut), or undefined if no routes
 */
export function getBestPriceRouteId(
  routes: RoutesStoreState['filteredRoutes']
): string | undefined {
  let bestRoute: { quoteId: string; amountOut: number } | undefined;

  const allRoutes = [
    ...routes.dexRoutes,
    ...routes.standardCexRoutes,
    ...routes.privateCexRoutes,
  ];

  for (const route of allRoutes) {
    const amountOut = route.amountOut ?? 0;
    if (bestRoute === undefined || amountOut > bestRoute.amountOut) {
      bestRoute = { quoteId: route.quoteId ?? '', amountOut };
    }
  }

  return bestRoute?.quoteId;
}

/**
 * Generates a random partner name
 * @returns A random partner name
 */
export function getRandomPartnerName() {
  // Handles 26 partners (A-Z)
  const n = Math.floor(Math.random() * 26);
  const name = String.fromCharCode(65 + n);
  return `Houdini Partner ${name}`;
}

/**
 * Sorts routes by their output amount, considering both amountOut and netAmountOut fields
 * @param routes Array of routes to sort
 * @returns Sorted array of routes by price (highest to lowest)
 */
export function sortRoutesByPrice(
  routes: (Route | Quote)[]
): (Route | Quote)[] {
  return [...routes].sort((a, b) => {
    const aAmount = (a as Route).netAmountOut ?? a.amountOut ?? 0;
    const bAmount = (b as Route).netAmountOut ?? b.amountOut ?? 0;
    return bAmount - aAmount;
  });
}

/**
 * Generates a unique card ID for route cards based on route properties
 */
export function generateUniqueCardId({
  routeId,
  quoteType,
  isPriorityRoute,
  isBestRouteSlot,
}: {
  routeId: string;
  quoteType: QuoteType | string;
  isPriorityRoute: boolean;
  isBestRouteSlot: boolean;
}): string {
  return `${routeId}-${quoteType}-${isPriorityRoute ? 'priority' : 'normal'}-${isBestRouteSlot ? 'best' : 'regular'}`;
}
