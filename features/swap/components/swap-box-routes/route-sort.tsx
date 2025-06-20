import { useTranslations } from 'next-intl';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { SortOption } from '@/features/swap/types';

interface RouteSortProps {
  value: SortOption;
  onValueChange: (value: SortOption) => void;
  isQuoteLoading?: boolean;
}

export function RouteSort({
  value,
  onValueChange,
  isQuoteLoading,
}: RouteSortProps) {
  const t = useTranslations('swap.routes.sort');

  return (
    <ToggleGroup
      type="single"
      value={value}
      disabled={isQuoteLoading}
      onValueChange={(value) => value && onValueChange(value as SortOption)}
    >
      <ToggleGroupItem value={SortOption.CHEAPEST} aria-label={t('cheapest')}>
        {t('cheapest')}
      </ToggleGroupItem>
      <ToggleGroupItem value={SortOption.BEST} aria-label={t('best')}>
        {t('best')}
      </ToggleGroupItem>
      <ToggleGroupItem value={SortOption.QUICKEST} aria-label={t('quickest')}>
        {t('quickest')}
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
