import { useTranslations } from 'next-intl';
import React from 'react';

import ImageWithFallback from '@/components/image-with-fallback';
import { HoudiniPrivatePartnerLogo } from '@/features/order-details/components/order-detail-card/order-detail-status/steps/houdini-private-partner-logo';
import { Token } from '@/graphql/generated';

interface SwappingToOutTokenStepProps {
  outTokenData?: Token | null;
}

export function SwappingToOutTokenStepPrivate({
  outTokenData,
}: SwappingToOutTokenStepProps) {
  const t = useTranslations('orderDetails.status');
  const outSymbol = outTokenData?.symbol || 'OutToken';
  return (
    <div className="flex items-center gap-2">
      {t.rich('swappingToOutTokenStep', {
        inSymbol: (chunks) => (
          <span className="flex items-center gap-1">
            <span>{chunks}</span>
            <HoudiniPrivatePartnerLogo />
          </span>
        ),
        outSymbol: (chunks) => (
          <span className="flex items-center gap-1">
            {outTokenData?.icon && (
              <ImageWithFallback
                src={outTokenData.icon}
                alt={outSymbol}
                width={24}
                height={24}
              />
            )}
            <span>{chunks}</span>
            <span>{outSymbol}</span>
          </span>
        ),
      })}
    </div>
  );
}
