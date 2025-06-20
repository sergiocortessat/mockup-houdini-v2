import { useTranslations } from 'next-intl';

import ImageWithFallback from '@/components/image-with-fallback';
import { Token } from '@/graphql/generated';

export function SendingInTokenToExchange1StepPrivate({
  inTokenData,
}: {
  inTokenData?: Token | null;
}) {
  const t = useTranslations('orderDetails.status');
  const inSymbol = inTokenData?.symbol || '';
  const inIcon = inTokenData?.icon || '';
  return (
    <div className="flex items-center gap-2">
      {t.rich('sendingInTokenToExchange1Step', {
        inTokenIcon: () => (
          <ImageWithFallback
            src={inIcon}
            alt={inSymbol}
            width={24}
            height={24}
          />
        ),
        inSymbol: () => <span className="font-medium">{inSymbol}</span>,
      })}
    </div>
  );
}
