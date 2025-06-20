'use client';

import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SwapBoxCardHeader } from '@/features/swap/components/swap-box-card-header';
import { SwapBoxOptionsXMR } from '@/features/swap/components/swap-box-options-private';
import { SwapBoxRoutePartnerFilter } from '@/features/swap/components/swap-box-options/swap-box-route-partner-filter';
import {
  useRoutePartnerFilterStore,
  useRouteTypeFilterStore,
  useSwapLoadingStore,
} from '@/features/swap/stores/use-swap-store';
import { GroupPartners } from '@/features/swap/types';

export function SwapBoxOptions({
  setShowOptions,
  groupPartners,
  isPartnerFilterLoading,
}: {
  setShowOptions: (showOptions: boolean) => void;
  groupPartners: GroupPartners;
  isPartnerFilterLoading: boolean;
}) {
  const t = useTranslations('swap.options');
  const resetRouteTypeFilters = useRouteTypeFilterStore(
    (state) => state.resetRouteTypeFilters
  );
  const resetRoutePartnerFilters = useRoutePartnerFilterStore(
    (state) => state.resetRoutePartnerFilters
  );
  const isAllQuoteQueryLoading = useSwapLoadingStore(
    (state) => state.isAllQuoteQueryLoading
  );

  useEffect(() => {
    if (isAllQuoteQueryLoading) {
      resetRouteTypeFilters();
      resetRoutePartnerFilters();
    }
  }, [isAllQuoteQueryLoading, resetRouteTypeFilters, resetRoutePartnerFilters]);

  return (
    <div className="space-y-2">
      <SwapBoxCardHeader title="options.swapBoxOptionsTitle">
        <Button
          variant="ghost"
          size="icon"
          aria-label={t('options')}
          onClick={() => setShowOptions(false)}
        >
          <ArrowLeft className="scale-125" />
        </Button>
      </SwapBoxCardHeader>

      <div className="flex max-h-[430px] flex-col space-y-6 overflow-y-auto p-2">
        {/* This component is currently not in use but might be needed in the future */}
        {/* <SwapBoxSlippageFilter /> */}
        <Separator />
        <SwapBoxOptionsXMR />
        <Separator />
        {/* This component is currently not in use but might be needed in the future */}
        {/* <SwapBoxRouteTypeFilter isQuoteLoading={isQuoteLoading} /> */}
        <SwapBoxRoutePartnerFilter
          isPartnerFilterLoading={isPartnerFilterLoading}
          groupPartners={groupPartners}
        />
      </div>
    </div>
  );
}
