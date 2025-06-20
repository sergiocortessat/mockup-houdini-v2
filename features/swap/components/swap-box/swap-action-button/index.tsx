import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { SwapActionButtonSearchState } from '@/features/swap/components/swap-box/swap-action-button/swap-action-button-search-state';
import { useSwapActionButtonText } from '@/features/swap/hooks/use-swap-action-button-text';
import { useSwapExchange } from '@/features/swap/hooks/use-swap-exchange';
import { useSwapUrlParams } from '@/features/swap/hooks/use-swap-url-params';
import {
  useRoutesStore,
  useSwapLoadingStore,
} from '@/features/swap/stores/use-swap-store';
import { useSelectedRouteStore } from '@/features/swap/stores/use-swap-store';
import { ChainKind } from '@/features/swap/types';
import { calculateBestAmountFromRoutes } from '@/features/swap/utils/route-helpers';
import { HandleWalletConnectionProps } from '@/features/wallet/constants';
import { QuoteType, Token } from '@/graphql/generated';

interface SwapActionButtonProps {
  tokenInData: Token;
  tokenOutData: Token;
  setHasAddressRequiredError: (value: boolean) => void;
  handleWalletConnection: (props: HandleWalletConnectionProps) => void;
}

export function SwapActionButton({
  tokenInData,
  tokenOutData,
  setHasAddressRequiredError,
  handleWalletConnection,
}: SwapActionButtonProps) {
  const isAllQuoteQueryLoading = useSwapLoadingStore(
    (state) => state.isAllQuoteQueryLoading
  );
  const initialRoutes = useRoutesStore((state) => state.initialRoutes);
  const bestAmountFromSubscriptions =
    calculateBestAmountFromRoutes(initialRoutes);
  const { amount: amountInFromUrl, isPrivate: isPrivateFromUrl } =
    useSwapUrlParams();
  const selectedRoute = useSelectedRouteStore((state) => state.selectedRoute);
  const isSelectedRoutePrivate = selectedRoute?.type === QuoteType.Standard;
  const routes = useRoutesStore((state) => state.filteredRoutes);

  const {
    status,
    isCexStandardExchangeLoading,
    isCexPrivateExchangeLoading,
    isMultiExchangeLoading,
    isSwapButtonDisabled,
    handleSwap,
    isRedirecting,
    isSwapButtonLoading,
  } = useSwapExchange({
    tokenInData: tokenInData ?? undefined,
    tokenOutData: tokenOutData ?? undefined,
    amountIn: amountInFromUrl,
    amountOut: bestAmountFromSubscriptions,
    isQuoteLoading: Boolean(isAllQuoteQueryLoading),
    routes,
    setHasAddressRequiredError,
    handleWalletConnection,
  });

  const buttonText: string = useSwapActionButtonText({
    amountIn: amountInFromUrl,
    status,
    chainKind: tokenInData?.chainData?.kind as ChainKind | undefined,
    isPrivate: isPrivateFromUrl || isSelectedRoutePrivate,
    loading: {
      cexStandard: isCexStandardExchangeLoading,
      cexPrivate: isCexPrivateExchangeLoading,
      multiExchange: isMultiExchangeLoading,
    },
    isRedirecting,
    selectedRoute,
  });
  return (
    <Button
      className="mt-4 w-full capitalize disabled:opacity-90 md:mt-6"
      disabled={isSwapButtonDisabled}
      onClick={handleSwap}
      size="xl"
      aria-busy={isSwapButtonLoading}
    >
      {isAllQuoteQueryLoading ? (
        <SwapActionButtonSearchState />
      ) : (
        <span className="flex items-center gap-2">
          {isSwapButtonLoading ? <Loader2 className="animate-spin" /> : null}
          {buttonText}
        </span>
      )}
    </Button>
  );
}
