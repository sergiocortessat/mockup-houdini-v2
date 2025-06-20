'use client';

import { useTranslations } from 'next-intl';
import React from 'react';

import { Button } from '@/components/ui/button';
import { useSwapUrlParams } from '@/features/swap/hooks/use-swap-url-params';
import { roundNumber } from '@/lib/utils';

interface MinMaxInfoMessageProps {
  min: number;
  max: number;
  amountIn: number;
}

export function MinMaxInfoMessage({
  min,
  max,
  amountIn,
}: MinMaxInfoMessageProps) {
  const { setSwapParams } = useSwapUrlParams();
  const t = useTranslations('swap.routes');

  const handleSetMin = () => {
    setSwapParams({ amount: roundNumber(min, 4, 'up') });
  };
  const handleSetMax = () => {
    setSwapParams({ amount: roundNumber(max, 4, 'down') });
  };

  if (amountIn < min) {
    return (
      <div className="text-alert-warning text-sm">
        {t.rich('minInfoMessage', {
          min: roundNumber(min, 4, 'up'),
          amount: (chunks) => (
            <Button
              variant="link"
              size="xs"
              className="text-warning px-1"
              aria-label={`Set minimum amount (${min})`}
              onClick={handleSetMin}
            >
              {chunks}
            </Button>
          ),
        })}
      </div>
    );
  } else if (amountIn > max) {
    return (
      <div className="text-alert-warning text-label-xs">
        {t.rich('maxInfoMessage', {
          max: roundNumber(max, 4, 'down'),
          amount: (chunks) => (
            <Button
              variant="link"
              size="xs"
              className="text-warning px-1"
              aria-label={`Set maximum amount (${roundNumber(max, 4, 'down')})`}
              onClick={handleSetMax}
            >
              {chunks}
            </Button>
          ),
        })}
      </div>
    );
  }
  return null;
}
