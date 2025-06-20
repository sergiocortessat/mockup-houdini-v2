'use client';

import { useTranslations } from 'next-intl';
import { NumericFormat } from 'react-number-format';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SLIPPAGE_OPTIONS, SlippageValue } from '@/features/swap/constants';
import {
  useSlippageStore,
  useSwapLoadingStore,
} from '@/features/swap/stores/use-swap-store';
import { cn } from '@/lib/utils';

export interface SwapBoxSlippageFilterProps {
  className?: string;
}

export function SwapBoxSlippageFilter({
  className,
}: SwapBoxSlippageFilterProps) {
  const t = useTranslations('swap.options');
  const isAllQuoteQueryLoading = useSwapLoadingStore(
    (state) => state.isAllQuoteQueryLoading
  );
  const selectedSlippage = useSlippageStore((state) => state.selectedSlippage);
  const customSlippage = useSlippageStore((state) => state.customSlippage);
  const isCustom = useSlippageStore((state) => state.isCustom);
  const updateSlippageState = useSlippageStore(
    (state) => state.updateSlippageState
  );

  const handleSlippageSelect = (value: SlippageValue) => {
    if (isAllQuoteQueryLoading) return;
    updateSlippageState({
      selectedSlippage: value,
      isCustom: false,
      customSlippage: '',
    });
  };

  const handleCustomInputChange = (values: { value: string }) => {
    if (isAllQuoteQueryLoading) return;
    const value = values.value;
    if (value) {
      updateSlippageState({
        selectedSlippage: SlippageValue.CUSTOM,
        isCustom: true,
        customSlippage: value,
      });
    } else {
      updateSlippageState({
        selectedSlippage: SlippageValue.AUTO,
        isCustom: false,
        customSlippage: '',
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h5 className="text-label-sm">{t('slippage')}</h5>
      <div className={cn('flex items-center gap-2', className)}>
        {SLIPPAGE_OPTIONS.map((option) => (
          <Button
            key={option.value}
            variant={selectedSlippage === option.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleSlippageSelect(option.value)}
            className="min-w-[60px]"
            disabled={isAllQuoteQueryLoading}
          >
            {option.label}
          </Button>
        ))}
        <div className="relative min-w-[80px]">
          <NumericFormat
            value={isCustom ? customSlippage : ''}
            onValueChange={handleCustomInputChange}
            placeholder="Custom"
            className="bg-card focus-visible:border-ring focus-visible:ring-ring/20 h-9 w-full rounded-xl border px-3 py-2 pr-[26px] text-sm shadow-xs shadow-black/5 transition-shadow focus-visible:ring-[3px] focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
            allowNegative={false}
            decimalScale={2}
            fixedDecimalScale
            disabled={isAllQuoteQueryLoading}
            isAllowed={(values) => {
              const { floatValue } = values;
              return (
                floatValue === undefined ||
                (floatValue >= 0 && floatValue <= 100)
              );
            }}
          />
          <span className="text-muted-foreground absolute top-1/2 right-2 -translate-y-1/2 text-sm">
            %
          </span>
        </div>
      </div>
    </div>
  );
}
