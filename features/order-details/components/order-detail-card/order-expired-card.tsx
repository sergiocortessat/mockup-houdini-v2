import { AlertTriangle } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CopyToClipboardButton } from '@/components/ui/copy-to-clipboard-button';

const OrderExpiredCard = ({
  houdiniId,
}: {
  houdiniId: string | null | undefined;
}) => {
  const t = useTranslations('orderDetails.expiredCard');

  return (
    <Alert variant="destructive" className="flex items-start gap-3">
      <AlertTriangle className="text-alert-destructive mt-1" />
      <div>
        <AlertTitle>{t('title')}</AlertTitle>
        <AlertDescription>
          {t('description')}
          <CopyToClipboardButton value={houdiniId ?? ''}>
            {houdiniId}
          </CopyToClipboardButton>
        </AlertDescription>
      </div>
    </Alert>
  );
};

export default OrderExpiredCard;
