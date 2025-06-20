import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { GetAllQuoteQuery } from '@/graphql/generated';

export function isInvalidSwapAmount(
  value: string | undefined,
  minMax?: GetAllQuoteQuery['dexMinMax']
): boolean {
  if (!minMax || !value) return false;
  const numericValue = Number(value);
  return numericValue < minMax[0] || numericValue > minMax[1];
}

export function useSwapInputError(
  value: string | undefined,
  minMax?: GetAllQuoteQuery['dexMinMax']
): { message: string | null; correctedValue: string | null } {
  const t = useTranslations('swap.form');

  return useMemo(() => {
    if (!minMax || !value) return { message: null, correctedValue: null };
    const numericValue = Number(value);

    if (numericValue < minMax[0]) {
      return {
        message: t('minAmount', { min: minMax[0].toFixed(4) }),
        correctedValue: minMax[0].toString(),
      };
    }
    if (numericValue > minMax[1]) {
      return {
        message: t('maxAmount', { max: minMax[1].toFixed(4) }),
        correctedValue: minMax[1].toString(),
      };
    }
    return { message: null, correctedValue: null };
  }, [minMax, value, t]);
}
