'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

import ImageWithFallback from '@/components/image-with-fallback';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Token } from '@/graphql/generated';
import { cn } from '@/lib/utils';

interface SelectTokenButtonProps {
  token?: Token;
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  isBuyingInput?: boolean;
}

export function SwapInputSelectTokenButton({
  token,
  onClick,
  disabled,
  isLoading = false,
}: SelectTokenButtonProps) {
  const t = useTranslations('swap');

  if (isLoading) {
    return (
      <Button
        variant="ghost"
        className={cn(
          'h-10 w-[144px] justify-between rounded-lg bg-neutral-700 px-1 lg:h-[56px] lg:w-[200px]'
        )}
        disabled
      >
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9 shrink-0 rounded-lg lg:h-11 lg:w-11" />
          <div className="flex flex-col items-start gap-1">
            <Skeleton className="mb-1 h-5 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
        <ChevronDown className="mr-2" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={cn(
        'h-10 w-[144px] justify-between rounded-lg bg-neutral-700 px-1 hover:bg-neutral-600 lg:h-[56px] lg:w-[200px]'
      )}
      disabled={disabled}
    >
      {token ? (
        <div className="flex items-center gap-1">
          <ImageWithFallback
            src={token?.icon || ''}
            alt={token?.symbol || ''}
            width={48}
            height={48}
            className="h-9 w-9 shrink-0 lg:h-11 lg:w-11"
          />
          <div className="flex flex-col items-start">
            <motion.span
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.2 }}
              className="text-label-md"
              key={token?.cexTokenId}
            >
              {token?.symbol}
            </motion.span>
            <div className="text-label-xs text-muted-foreground max-w-[66px] truncate lg:max-w-[96px]">
              {t('onChain', { chain: token?.chainData?.name })}
            </div>
          </div>
        </div>
      ) : (
        <span className="font-medium">{t('selectToken')}</span>
      )}
      <ChevronDown className="mr-2" />
    </Button>
  );
}
