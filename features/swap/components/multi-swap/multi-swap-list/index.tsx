import { useTranslations } from 'next-intl';
import { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { useMultiSwapStore } from '@/features/swap/stores/use-swap-store';

interface MultiSwapListProps {
  children: ReactNode;
}

export const MultiSwapList = ({ children }: MultiSwapListProps) => {
  const t = useTranslations('swap.multiSwap');
  const clearSwaps = useMultiSwapStore((state) => state.clearSwaps);
  const swaps = useMultiSwapStore((state) => state.swaps);
  const isShowClearAll = swaps.length > 1;

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-lg bg-neutral-950 p-3">
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="text-label-lg">{t('addedSwaps')}</h2>
        {isShowClearAll && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSwaps}
            className="text-gray-400 hover:text-white"
          >
            {t('cleanAll')}
          </Button>
        )}
      </div>
      <div className="text-heading-sub flex items-center justify-between border-b border-gray-800 px-4 py-2 text-gray-400 uppercase">
        <div className="w-1/3">{t('sending')}</div>
        <div className="w-1/3">{t('receiving')}</div>
        <div className="hidden w-1/3 md:block">{t('address')}</div>
      </div>
      {children}
    </div>
  );
};
