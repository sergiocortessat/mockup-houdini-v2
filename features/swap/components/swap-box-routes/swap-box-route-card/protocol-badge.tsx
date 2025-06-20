import { AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ProtocolBadgeProps } from '@/features/swap/components/swap-box-routes/swap-box-route-card/types';
import { QuoteType } from '@/graphql/generated';

export function ProtocolBadge({
  protocol,
  swapAggregator,
  swapName,
  path,
  isFiltered,
  isPriorityRoute,
  isBestRouteSlot,
}: ProtocolBadgeProps) {
  const t = useTranslations('swap.routes');
  const isPrivateRoute = protocol === QuoteType.Private;
  const isStandardRoute = protocol === QuoteType.Standard;

  if (isBestRouteSlot) {
    return (
      <Badge variant="secondary" className="w-max rounded-[4px] py-1">
        {t('bestPrice')}
      </Badge>
    );
  }

  if (isPrivateRoute) {
    return (
      <Badge
        variant="default"
        className="w-max rounded-[4px] bg-purple-900 py-1 capitalize"
        aria-label={`${protocol} - Private Route`}
      >
        {protocol}
      </Badge>
    );
  }

  if (isStandardRoute) {
    return (
      <div className="flex items-center gap-2">
        {isPriorityRoute ? (
          <Badge
            variant="secondary"
            className="w-max rounded-[4px] py-1 capitalize"
          >
            {t('noWalletConnectionRequired')}
          </Badge>
        ) : (
          <>
            <Badge variant="secondary" className="w-max rounded-[4px] py-1">
              {t('offChainCex')}
            </Badge>
          </>
        )}
      </div>
    );
  }
  // DEX route
  const isDifferentPath = swapAggregator !== path;
  const provider = isDifferentPath ? (
    <>
      <span className="text-secondary-foreground/90 first-letter:uppercase">
        {path}
      </span>
      <span className="text-muted-foreground">{t('via')}</span>
      <span className="text-secondary-foreground/70 first-letter:uppercase">
        {swapName}
      </span>
    </>
  ) : (
    <span className="text-secondary-foreground/90">{swapName}</span>
  );

  return (
    <div className="flex items-center gap-2">
      <Badge variant="secondary" className="w-max rounded-[4px] py-1">
        {t('onchainDex')}
      </Badge>
      {!isPriorityRoute && (
        <Badge
          variant="outline"
          className="w-max gap-1 rounded-[4px] py-1 capitalize"
          aria-label={`${QuoteType.Dex} - ${isDifferentPath ? `${path} via ${swapAggregator}` : swapAggregator}`}
        >
          {isFiltered && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span tabIndex={0} className="inline-flex align-middle">
                  <AlertCircle
                    className="text-destructive h-4 w-4"
                    aria-label="Route not available for different recipient wallet"
                  />
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" align="center">
                {t('routeNotAvailable')}
              </TooltipContent>
            </Tooltip>
          )}
          {provider}
        </Badge>
      )}
    </div>
  );
}
