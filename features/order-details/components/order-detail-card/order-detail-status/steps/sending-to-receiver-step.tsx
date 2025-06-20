import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React from 'react';

import { OrderStatusResult, Token } from '@/graphql/generated';

interface SendingToReceiverStepProps {
  outTokenData?: Token | null;
}

export function SendingToReceiverStep({
  outTokenData,
}: SendingToReceiverStepProps) {
  const t = useTranslations('orderDetails.status');
  const outSymbol = outTokenData?.symbol || 'OutToken';
  const outIcon = outTokenData?.icon || '';
  return (
    <div className="flex items-center gap-2">
      {t.rich('sendingToReceiverStep', {
        outSymbol: (chunks) => (
          <span className="flex items-center gap-1">
            <Image src={outIcon} alt={outSymbol} width={20} height={20} />
            <span>{chunks}</span>
            <span>{outSymbol}</span>
          </span>
        ),
      })}
    </div>
  );
}
