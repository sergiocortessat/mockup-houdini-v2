import { useTranslations } from 'next-intl';
import React from 'react';

import OrderCountdown from '@/features/order-details/components/order-detail-card/order-countdown';
import { OrderStatusResult } from '@/graphql/generated';

interface WaitingStepProps {
  orderData?: OrderStatusResult | null;
  isActive?: boolean;
  isStepCompleted?: boolean;
}

export function WaitingStep({
  orderData,
  isActive,
  isStepCompleted,
}: WaitingStepProps) {
  const t = useTranslations('orderDetails.status');
  return (
    <div className="flex items-center justify-between gap-2">
      <span>{t('waitingStep')}</span>
      {orderData?.expires && isActive && !isStepCompleted && (
        <OrderCountdown expiryDate={orderData.expires} />
      )}
    </div>
  );
}
