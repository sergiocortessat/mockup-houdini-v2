import { Circle } from 'lucide-react';

import ImageWithFallback from '@/components/image-with-fallback';
import { Badge } from '@/components/ui/badge';
import { TokenCardProps } from '@/features/swap/types';
import { cn } from '@/lib/utils';

export function TokenCardPast({ token, onClick, className }: TokenCardProps) {
  return (
    <button
      onClick={() => onClick?.(token)}
      className={cn(
        'flex items-center gap-2 rounded-lg bg-gray-800/50 p-3',
        'focus:ring-ring transition-colors hover:bg-gray-800/70 focus:ring-1 focus:outline-hidden',
        className
      )}
      aria-label={`${token.name} (${token.symbol})`}
    >
      {token.icon ? (
        <ImageWithFallback
          src={token.icon}
          alt={token.symbol}
          width={40}
          height={40}
          className="shrink-0"
        />
      ) : (
        <Circle className="h-10 w-10" />
      )}

      <div className="flex flex-col items-start gap-1">
        <span className="font-medium">{token.symbol}</span>
        <Badge variant="secondary">{token.chainData?.name}</Badge>
      </div>
    </button>
  );
}
