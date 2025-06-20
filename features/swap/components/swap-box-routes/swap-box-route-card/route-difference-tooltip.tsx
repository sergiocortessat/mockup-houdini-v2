import { useTranslations } from 'next-intl';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface RouteDifferenceTooltipProps {
  inAmountUsd: number;
  netOutAmountUsd: number;
  percentageDifference: number;
}

export function RouteDifferenceTooltip({
  inAmountUsd,
  netOutAmountUsd,
  percentageDifference,
}: RouteDifferenceTooltipProps) {
  const t = useTranslations('swap.routes');
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <p className="text-info">({percentageDifference.toFixed(2)}%)</p>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <div className="text-foreground mb-2">
          {t('tooltipDifferenceTitle')}
        </div>
        <div className="mb-2">
          {t.rich('tooltipDifferenceDetail', {
            inUsd: () => `$${inAmountUsd.toFixed(2)}`,
            outUsd: () => `$${netOutAmountUsd.toFixed(2)}`,
            percent: () => `${percentageDifference.toFixed(2)}%`,
          })}
        </div>
        <div className="text-muted-foreground text-xs">
          {t('tooltipDifferenceDisclaimer')}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
