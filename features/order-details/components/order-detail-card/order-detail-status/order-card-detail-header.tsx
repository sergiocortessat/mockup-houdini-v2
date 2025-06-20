import { useTranslations } from 'next-intl';

import { CopyToClipboardButton } from '@/components/ui/copy-to-clipboard-button';
import { getOrderStatus } from '@/features/order-details/utils/get-order-status';
import { OrderStatusResult } from '@/graphql/generated';
import { cn } from '@/lib/utils';

interface OrderCardDetailHeaderProps {
  orderData: OrderStatusResult;
}

const OrderCardDetailHeader = ({ orderData }: OrderCardDetailHeaderProps) => {
  const t = useTranslations('orderDetails');
  const { isCompleted, isFailed, isRefunded } = getOrderStatus(
    orderData?.status
  );
  const houdiniId = orderData?.houdiniId;

  return (
    <div
      className={cn(
        'flex h-[122px] justify-end gap-2 rounded-t-3xl bg-gradient-to-t from-purple-800 to-blue-900 px-2 py-3 sm:p-6',
        isCompleted && 'from-green-900 via-green-900/80 to-black',
        isFailed && 'from-red-900 via-red-900/80 to-black',
        isRefunded && 'from-red-900 via-red-900/80 to-black'
      )}
    >
      <CopyToClipboardButton
        value={houdiniId ?? ''}
        tooltipText={t('copyOrderId')}
        variant="secondary"
      >
        <span className="text-label-sm">
          {t('orderIdLabel')}: {houdiniId}
        </span>
      </CopyToClipboardButton>
    </div>
  );
};

export default OrderCardDetailHeader;
