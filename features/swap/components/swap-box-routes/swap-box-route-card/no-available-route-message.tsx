import { useTranslations } from 'next-intl';
import React from 'react';

export function NoAvailableRouteMessage() {
  const t = useTranslations('swap.routes');
  return (
    <div
      className="text-muted-foreground text-sm"
      role="status"
      aria-live="polite"
    >
      {t('noAvailableRoute')}
    </div>
  );
}
