import { Card } from '@/components/ui/card';
import { StatCardData } from '@/features/analytics/types';

interface StatsCardProps {
  data: StatCardData;
}

export function StatsCard({ data }: StatsCardProps) {
  return (
    <Card className="rounded-3xl border p-4">
      <div className="mb-2 flex items-center gap-2">
        <div className="flex items-center justify-center rounded-full bg-neutral-800 p-2">
          {data.icon}
        </div>
        <span className="text-heading-xs md:text-heading-sm">{data.title}</span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-display-xs md:text-display-xxs">
          {data.value}
        </span>
        {data.token && (
          <div className="flex items-center rounded-full px-2 py-1">
            <div className="flex items-center justify-center p-2">
              {data.token.icon}
            </div>
            <span className="text-label-xs">{data.token.symbol}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
