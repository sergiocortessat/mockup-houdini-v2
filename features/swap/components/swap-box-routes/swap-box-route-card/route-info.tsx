import { Clock, Fuel } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { RouteInfoProps } from '@/features/swap/components/swap-box-routes/swap-box-route-card/types';

export function RouteInfo({ gasFeeUsd, duration, isSkeleton }: RouteInfoProps) {
  const t = useTranslations('swap.routes');

  if (isSkeleton) {
    return (
      <span className="flex items-center gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
      </span>
    );
  }

  return (
    <span className="flex items-center gap-2">
      {gasFeeUsd && (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="flex items-center gap-1" role="tooltip">
              <Fuel className="h-3 w-3" aria-hidden="true" />$
              {gasFeeUsd.toFixed(2)}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {t('gasFee')}: ${gasFeeUsd}
            </p>
          </TooltipContent>
        </Tooltip>
      )}
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="flex items-center gap-1" role="tooltip">
            <Clock className="h-3 w-3" aria-hidden="true" />
            {duration ?? 0}m
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {t('estimatedDuration')}: {duration ?? 0} {t('minutes')}
          </p>
        </TooltipContent>
      </Tooltip>
    </span>
  );
}
