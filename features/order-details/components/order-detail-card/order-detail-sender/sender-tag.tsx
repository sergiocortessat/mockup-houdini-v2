import { useTranslations } from 'next-intl';

import { CopyToClipboardButton } from '@/components/ui/copy-to-clipboard-button';
import InformativeTimedModal from '@/features/order-details/components/order-detail-card/informative-timed-modal';

const SenderTag = ({ senderTag }: { senderTag: string }) => {
  const t = useTranslations('orderDetails');
  return (
    <>
      <InformativeTimedModal
        title={t('orderDestinationTagTitle')}
        description={
          <div className="flex flex-col space-y-5">
            <div>
              {t('orderDestinationTagModalWarning')}
              <span className="text-alert-warning">
                {' '}
                {t('orderDestinationTagModalWarning2')}.
              </span>{' '}
              {t('orderDestinationTagModalWarning3')}
            </div>
            <span className="text-label-sm text-neutral-500">
              {t('orderDestinationTagModalDescription')}
            </span>
          </div>
        }
        timeout={10000}
        onConfirm={() => {}}
      />
      <div className="flex flex-col items-start gap-2">
        <div className="flex items-center gap-2">
          <span className="text-label-sm text-neutral-500 uppercase">
            {t('orderDestinationTagLabel')}
          </span>
          <span className="text-label-sm text-alert-warning/70 uppercase">
            {t('orderDestinationTagTitle')}
          </span>
        </div>
        <CopyToClipboardButton
          value={senderTag || ''}
          tooltipText={t('copyAmount')}
        >
          <div className="text-label-md break-all whitespace-normal">
            {senderTag}
          </div>
        </CopyToClipboardButton>
      </div>
    </>
  );
};

export default SenderTag;
