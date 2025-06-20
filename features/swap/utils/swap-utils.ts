import {
  SWAP_PRICE_BUFFER_PERCENTAGE,
  SWAP_PRICE_BUFFER_PERCENTAGE_PRIVATE,
} from '@/features/swap/constants';
import { RoutesState } from '@/features/swap/types';

export const hasAvailableRoutes = (routes: RoutesState): boolean => {
  const hasDexRoutes = routes.dexRoutes.length > 0;
  const hasPrivateCexRoute = routes.privateCexRoutes.length > 0;
  const hasStandardCexRoute = routes.standardCexRoutes.length > 0;

  return hasDexRoutes || hasPrivateCexRoute || hasStandardCexRoute;
};

export const shouldShowRoutes = ({
  routes,
  amountIn,
  isPrivate,
  isQuoteLoading,
}: {
  routes: RoutesState;
  amountIn: number;
  isPrivate: boolean;
  isQuoteLoading: boolean | undefined;
}): boolean => {
  return (
    Boolean(hasAvailableRoutes(routes) || isQuoteLoading) &&
    amountIn > 0 &&
    !isPrivate
  );
};

export const getDisplayAmountOut = (
  amountIn: number,
  selectedRouteAmountOut: number,
  animatedAmountOut: string | number,
  amountOut: number
): string => {
  if (amountIn <= 0) return '';

  if (selectedRouteAmountOut > 0) {
    return selectedRouteAmountOut.toString();
  }

  if (animatedAmountOut) {
    return animatedAmountOut.toString();
  }

  if (amountOut) {
    return amountOut.toString();
  }

  return '';
};

export const getDisplayAmountIn = (
  amountIn: number,
  amountInChanged: string
): string | undefined => {
  if (amountIn && amountIn > 0) {
    return amountIn.toString();
  }

  return amountInChanged;
};

export const calculateUsdPrice = (
  tokenPrice: number | undefined | null,
  amount: number | undefined | null
): number => {
  return (tokenPrice ?? 0) * (amount ?? 0);
};

// Calculate how many "from" tokens are needed for the desired "to" tokens
// Example: If user wants 10 SOL and 1 SOL = $20 USDC and 1 ETH = $2000 USDC
// Then: (10 SOL * $20 USDC/SOL) / ($2000 USDC/ETH) = 0.1 ETH needed
export const calculateFromTokensNeeded = (
  amount: number,
  toPrice: number,
  fromPrice: number,
  isPrivate = false
): number => {
  // Return 0 if either price is 0 or not available
  if (!toPrice || !fromPrice) {
    return 0;
  }

  const bufferPercentage = isPrivate
    ? SWAP_PRICE_BUFFER_PERCENTAGE_PRIVATE
    : SWAP_PRICE_BUFFER_PERCENTAGE;

  const increaseToPriceBy = toPrice * bufferPercentage + toPrice;
  return (amount * increaseToPriceBy) / fromPrice;
};

export const removeCommasFromNumber = (value: string): string =>
  value ? value.replace(/,/g, '') : '';
