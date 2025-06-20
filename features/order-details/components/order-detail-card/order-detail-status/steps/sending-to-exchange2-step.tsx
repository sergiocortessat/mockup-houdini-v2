import { useTranslations } from 'next-intl';
import React from 'react';

import { HoudiniPrivatePartnerLogo } from '@/features/order-details/components/order-detail-card/order-detail-status/steps/houdini-private-partner-logo';

export function SendingToExchange2Step() {
  const t = useTranslations('orderDetails.status');
  return (
    <div className="flex items-center gap-2">
      {t.rich('sendingToExchange2Step', {
        helper: (chunks) => (
          <span className="flex items-center gap-1">
            {chunks}
            <HoudiniPrivatePartnerLogo />
          </span>
        ),
      })}
    </div>
  );
}
