import { Skeleton } from '@/components/ui/skeleton';
import { AmountDisplayProps } from '@/features/swap/components/swap-box-routes/swap-box-route-card/types';
import { formatNumber } from '@/lib/utils';

export function AmountDisplay({
  netOutAmount,
  isSkeleton,
}: AmountDisplayProps) {
  if (isSkeleton) {
    return (
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <Skeleton className="h-5 w-[96px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-1">
        <span className="text-display-xxs tabular-nums">
          {netOutAmount > 0
            ? formatNumber(netOutAmount, {
                showEllipsis: true,
                maxDecimals: 16,
              })
            : '0'}
        </span>
      </div>
    </div>
  );
}
