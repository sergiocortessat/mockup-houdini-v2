import { RefreshCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CopyToClipboardButton } from '@/components/ui/copy-to-clipboard-button';

const OrderRefundedCard = ({
  houdiniId,
}: {
  houdiniId: string | null | undefined;
}) => {
  const t = useTranslations('orderDetails.refundedCard');

  return (
    <Alert variant="default" className="flex items-start gap-3">
      <RefreshCcw className="text-primary mt-1" />
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

export default OrderRefundedCard;
