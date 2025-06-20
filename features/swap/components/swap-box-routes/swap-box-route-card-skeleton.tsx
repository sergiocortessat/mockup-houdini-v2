import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export function SwapBoxRouteCardSkeleton() {
  return (
    <div
      className={cn(
        'group bg-card relative block h-[100px] w-full overflow-hidden rounded-xl border p-4 shadow-xs backdrop-blur-xs transition-all duration-200'
      )}
    >
      <div className="relative flex h-full w-full items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Protocol Badge with Icon */}
          <div className="flex items-center gap-2">
            <Skeleton className="bg-primary/10 h-6 w-24 rounded-full" />
          </div>
        </div>

        {/* Amount with arrow indicator */}
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-1">
            <Skeleton className="h-7 w-32" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}
