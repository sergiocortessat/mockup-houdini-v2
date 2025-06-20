import { useTranslations } from 'next-intl';
import React from 'react';

export function CompletedStep() {
  const t = useTranslations('orderDetails.status');
  return (
    <div className="flex items-center justify-between gap-2">
      <span>{t('completedStep')}</span>
    </div>
  );
}
