import { Circle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import ImageWithFallback from '@/components/image-with-fallback';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CopyToClipboardButton } from '@/components/ui/copy-to-clipboard-button';
import { type Token } from '@/graphql/generated';
import { cn, formatTruncatedAddress } from '@/lib/utils';

interface TokenCardPopularProps {
  token: Token;
  onClick: (token: Token) => void;
  className?: string;
}

const TokenCardPopular = ({
  token,
  onClick,
  className,
}: TokenCardPopularProps) => {
  const t = useTranslations('swap.modal');

  return (
    <button
      onClick={() => onClick?.(token)}
      className={cn(
        'flex min-h-[50px] w-full items-center justify-between gap-3 rounded-lg bg-gray-800/50 p-3',
        'focus:ring-ring transition-colors hover:bg-gray-800/70 focus:outline-hidden',
        'max-w-full overflow-hidden',
        className
      )}
      aria-label={`${token.name} (${token.symbol})`}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {token.icon ? (
          <ImageWithFallback
            src={token.icon}
            alt={token.symbol}
            width={40}
            height={40}
            className="shrink-0"
          />
        ) : (
          <Circle className="h-10 w-10 shrink-0" />
        )}

        <div className="flex min-w-0 flex-1 flex-col items-start">
          <div className="flex w-full items-center gap-2">
            <span className="truncate font-medium">{token.symbol}</span>
            {token.chain && (
              <Badge variant="secondary" className="shrink-0">
                {token.chain.charAt(0).toUpperCase() + token.chain.slice(1)}
              </Badge>
            )}
          </div>
          <div className="flex w-full items-center gap-1 overflow-hidden text-gray-400">
            <span className="truncate text-sm">{token.name}</span>
            {token.address && (
              <CopyToClipboardButton
                value={token.address}
                tooltipText={t('copyAddress')}
                className="shrink-0"
              >
                <span className="text-sm">
                  {formatTruncatedAddress(token.address)}
                </span>
              </CopyToClipboardButton>
            )}
          </div>
        </div>
      </div>
      <Badge variant="secondary" className="text-muted-foreground shrink-0">
        #{token.rank}
      </Badge>
    </button>
  );
};

export default TokenCardPopular;
