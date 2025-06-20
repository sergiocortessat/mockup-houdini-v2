import { WandSparklesIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';

export function BestPriceBadge({ label }: { label: string }) {
  return (
    <div className="t-4 absolute top-0 right-0 z-10">
      <Badge
        variant="default"
        className="text-primary bg-primary-foreground hover:bg-primary-foreground flex items-center gap-1 rounded-none rounded-bl-md px-2 py-1 shadow-sm transition-colors"
        aria-label="Best Price"
      >
        <WandSparklesIcon className="h-4 w-4" />
        {label}
      </Badge>
    </div>
  );
}
