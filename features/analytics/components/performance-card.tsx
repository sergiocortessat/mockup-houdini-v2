import { DollarSign } from 'lucide-react';

import { Card } from '@/components/ui/card';

interface PerformanceCardProps {
  title: string;
  value: string;
}

const PerformanceCard = ({ title, value }: PerformanceCardProps) => {
  return (
    <Card className="rounded-xl border bg-transparent p-4">
      <div className="flex flex-col items-start gap-2">
        <p className="text-label-xs text-neutral-500 uppercase">{title}</p>
        <div className="flex w-full items-center justify-between">
          <span className="text-heading-sm">{value}</span>
          <div className="flex items-center gap-2 rounded-full bg-neutral-800 p-2">
            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500 p-1">
              <DollarSign size={12} />
            </div>
            <span className="text-label-xs">USD</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PerformanceCard;
