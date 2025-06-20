import { useTranslations } from 'next-intl';
import React from 'react';

import ImageWithFallback from '@/components/image-with-fallback';
import { Token } from '@/graphql/generated';

export function SwappingToOutTokenStep({
  inTokenData,
  outTokenData,
}: {
  inTokenData?: Token | null;
  outTokenData?: Token | null;
}) {
  const t = useTranslations('orderDetails.status');
  const inSymbol = inTokenData?.symbol || 'InToken';
  const inIcon = inTokenData?.icon || '';
  const outSymbol = outTokenData?.symbol || 'OutToken';
  const outIcon = outTokenData?.icon || '';
  return (
    <div className="flex items-center gap-2">
      {t.rich('swappingToOutTokenStep', {
        inSymbol: () => (
          <span className="flex items-center gap-1">
            <ImageWithFallback
              src={inIcon}
              alt={inSymbol}
              width={24}
              height={24}
            />
            <span>{inSymbol}</span>
          </span>
        ),
        outSymbol: () => (
          <span className="flex items-center gap-1">
            <ImageWithFallback
              src={outIcon}
              alt={outSymbol}
              width={24}
              height={24}
            />
            <span>{outSymbol}</span>
          </span>
        ),
      })}
    </div>
  );
}
