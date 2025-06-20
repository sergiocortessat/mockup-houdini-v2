import { Crown, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';

import { Badge } from '@/components/ui/badge';

interface SwapJourneyBadgeProps {
  isDex?: boolean | null;
  anonymous?: boolean | null;
}

const SwapJourneyBadge = ({ isDex, anonymous }: SwapJourneyBadgeProps) => {
  const t = useTranslations('orderDetails.swapJourney');
  if (isDex) {
    return (
      <Badge
        variant="secondary"
        className="w-max rounded-[4px] py-1 capitalize"
      >
        {t('onChainDex')}
      </Badge>
    );
  }
  if (anonymous) {
    return (
      <Badge
        variant="default"
        className="w-max rounded-[4px] bg-purple-900 py-1 capitalize"
        aria-label={`${t('private')} - Private Route`}
      >
        {t('private')}
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="w-max rounded-[4px] py-1 capitalize">
      {t('noWalletConnection')}
    </Badge>
  );
};

export default SwapJourneyBadge;
