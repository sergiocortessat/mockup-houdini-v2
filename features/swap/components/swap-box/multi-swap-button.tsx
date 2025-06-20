import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useSwapUrlParams } from '@/features/swap/hooks/use-swap-url-params';
import {
  useMultiSwapStore,
  useSelectedRouteStore,
  useSwapLoadingStore,
} from '@/features/swap/stores/use-swap-store';
import { isAddressValid } from '@/features/swap/utils/address-validation';
import {
  QuoteType,
  Token,
  useCheckDestinationAddressQuery,
} from '@/graphql/generated';

export function MultiSwapButton({
  setHasAddressRequiredError,
  tokenInData,
  tokenOutData,
}: {
  setHasAddressRequiredError: (hasAddressRequiredError: boolean) => void;
  tokenInData?: Token;
  tokenOutData?: Token;
}) {
  const tValidation = useTranslations('swap.validation');
  const t = useTranslations('swap.multiSwap');
  const { tokenIn, amount, address } = useSwapUrlParams();
  const isAllQuoteQueryLoading = useSwapLoadingStore(
    (state) => state.isAllQuoteQueryLoading
  );
  const addSwap = useMultiSwapStore((state) => state.addSwap);

  const selectedRoute = useSelectedRouteStore((state) => state.selectedRoute);
  const { fetchMore } = useCheckDestinationAddressQuery({
    skip: true,
  });

  const handleAddSwap = async () => {
    if (!address) {
      setHasAddressRequiredError(true);
      return;
    }
    const checkDestinationAddressData = await fetchMore({
      variables: {
        isDex: selectedRoute?.type === QuoteType.Dex,
        chainId: tokenOutData?.chainData?.chainId ?? 0,
        kind: tokenOutData?.chainData?.kind ?? '',
        address: address ?? '',
      },
    });
    if (checkDestinationAddressData?.data?.checkDestinationAddress) {
      console.error(tValidation('addressIsContract'));
      toast.error(tValidation('addressIsContract'));
      return;
    }

    if (!isAddressValid(address, tokenOutData?.chainData?.addressValidation)) {
      console.error(tValidation('invalidAddress'));
      toast.error(
        tValidation('invalidAddress', {
          chain: tokenOutData?.chainData?.name ?? '',
        })
      );
      return;
    }
    if (selectedRoute) {
      addSwap({
        from: tokenInData?.cexTokenId ?? '',
        to: tokenOutData?.cexTokenId ?? '',
        address: address ?? '',
        amount: amount.toString(),
        amountOut: selectedRoute?.amountOut ?? 0,
      });
    }
  };

  const isAddSwapButtonDisabled =
    !tokenIn ||
    isAllQuoteQueryLoading ||
    selectedRoute?.type === QuoteType.Dex ||
    !tokenOutData ||
    !tokenInData ||
    !amount;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleAddSwap}
            disabled={isAddSwapButtonDisabled}
            className="h-11 w-11 shrink-0"
          >
            <Plus className="scale-125" />
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" align="center">
        {t('addMultiSwapButtonTooltip')}
      </TooltipContent>
    </Tooltip>
  );
}
