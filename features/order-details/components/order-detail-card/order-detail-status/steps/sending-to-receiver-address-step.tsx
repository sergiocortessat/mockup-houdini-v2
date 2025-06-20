import { useTranslations } from 'next-intl';
import React from 'react';

import ImageWithFallback from '@/components/image-with-fallback';
import { Token } from '@/graphql/generated';

interface SendingToReceiverAddressStepProps {
  outTokenData?: Token | null;
}

export function SendingToReceiverAddressStep({
  outTokenData,
}: SendingToReceiverAddressStepProps) {
  const t = useTranslations('orderDetails.status');
  const outSymbol = outTokenData?.symbol || 'OutToken';
  const outIcon = outTokenData?.icon || '';

  return (
    <div className="flex items-center justify-between gap-2">
      <span className="flex items-center gap-2">
        {t.rich('sendingToReceiverAddressStep', {
          outSymbol: () => (
            <span className="flex items-center gap-1">
              <ImageWithFallback
                src={outIcon}
                alt={outSymbol}
                width={24}
                height={24}
              />
            </span>
          ),
        })}
      </span>
    </div>
  );
}
