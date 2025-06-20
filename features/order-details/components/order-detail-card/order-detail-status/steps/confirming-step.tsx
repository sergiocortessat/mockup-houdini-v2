import { useTranslations } from 'next-intl';
import React from 'react';

import { OrderStatusResult } from '@/graphql/generated';
import { formatTruncatedAddress } from '@/lib/utils';

interface ConfirmingStepProps {
  orderData?: OrderStatusResult | null;
}

export function ConfirmingStep({ orderData }: ConfirmingStepProps) {
  const t = useTranslations('orderDetails.status');
  const addressValue = formatTruncatedAddress(orderData?.senderAddress);
  return (
    <div className="flex items-center gap-1">
      {t.rich('confirmingStep', {
        address: (chunks) => (
          <span className="bg-secondary rounded-4xl px-2">{chunks}</span>
        ),
        addressValue,
      })}
    </div>
  );
}
