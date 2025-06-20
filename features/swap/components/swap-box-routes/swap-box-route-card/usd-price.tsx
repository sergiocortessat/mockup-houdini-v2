import { useTranslations } from 'next-intl';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function UsdPrice({ usdPrice }: { usdPrice: number }) {
  const t = useTranslations('swap.routes');

  return usdPrice > 0 ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="tabular-nums">${usdPrice.toFixed(2)}</span>
      </TooltipTrigger>
      <TooltipContent>
        <p>
          {t('usdValue')}: ${usdPrice}
        </p>
      </TooltipContent>
    </Tooltip>
  ) : (
    <span className="tabular-nums">$0</span>
  );
}
