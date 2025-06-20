'use client';

import { useTranslations } from 'next-intl';
import { redirect, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CopyToClipboardButton } from '@/components/ui/copy-to-clipboard-button';
import FluidCursor from '@/components/ui/fluid-cursor';
import { ROUTES } from '@/constants/urls';
import { MultiOrders } from '@/features/order-details/components/multi-orders';
import OrderDetailCard from '@/features/order-details/components/order-detail-card';
import OrderDetailCardSkeleton from '@/features/order-details/components/order-detail-card/order-detail-card-skeleton';
import { OrderDetailFooter } from '@/features/order-details/components/order-detail-footer';
import { ORDER_STATUS } from '@/features/order-details/constants';
import { useOrderData } from '@/features/order-details/hooks/use-order-data';
import { triggerAddressableEvent } from '@/utils/addressable-event';

const OrderDetails = () => {
  const t = useTranslations('orderDetails');

  const searchParams = useSearchParams();
  const houdiniId = searchParams?.get('houdiniId');
  const id = searchParams?.get('id');
  const multiId = searchParams?.get('multiId');

  if (!houdiniId && !id && !multiId) {
    redirect(ROUTES.HOME);
  }

  const { orderData, isLoading } = useOrderData({
    houdiniId,
    id,
    multiId,
  });

  // Track event only once per orderId
  useEffect(() => {
    if (!orderData || Array.isArray(orderData)) return;
    const eventKey = `user_order_started_${orderData.houdiniId}`;
    if (orderData.houdiniId && !sessionStorage.getItem(eventKey)) {
      triggerAddressableEvent('v4_user_order_started', false, [
        { name: 'orderId', value: orderData.houdiniId },
        { name: 'created_date', value: orderData.createdAt },
        { name: 'token in', value: orderData.inToken?.symbol },
        { name: 'token out', value: orderData.outToken?.symbol },
        { name: 'recipient', value: orderData.recipient },
      ]);
      sessionStorage.setItem(eventKey, 'true');
    }
  }, [orderData]);

  const isOrderDeleted = orderData?.status === ORDER_STATUS.DELETED;
  const tokenData = {
    tokenIn: orderData?.inToken,
    tokenOut: orderData?.outToken,
  };

  return (
    <main className="container grid min-h-[calc(100vh-(var(--spacing-header)))] grid-rows-[1fr_max-content] justify-center py-4 md:pt-12">
      {isOrderDeleted ? (
        <Alert className="mx-auto mb-6 h-auto self-center-safe md:max-w-[480px]">
          <AlertTitle>{t('noOrderFound')}</AlertTitle>
          <AlertDescription>
            {t('noOrderMessage')}
            <CopyToClipboardButton value={`${houdiniId}`}>
              {houdiniId}
            </CopyToClipboardButton>
          </AlertDescription>
        </Alert>
      ) : (
        <div className="relative mx-auto flex w-full flex-col gap-2 md:max-w-[480px]">
          {isLoading && <OrderDetailCardSkeleton />}

          {Array.isArray(orderData) && orderData.length > 0 ? (
            <MultiOrders orders={orderData} />
          ) : (
            orderData && (
              <OrderDetailCard orderData={orderData} tokenData={tokenData} />
            )
          )}
        </div>
      )}
      <OrderDetailFooter />

      <FluidCursor />
    </main>
  );
};

export default OrderDetails;
