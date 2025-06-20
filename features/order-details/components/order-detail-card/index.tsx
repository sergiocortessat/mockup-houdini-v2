import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

import InformativeTimedModal from '@/features/order-details/components/order-detail-card/informative-timed-modal';
import OrderCompletedConfetti from '@/features/order-details/components/order-detail-card/order-completed-confetti';
import OrderDetailActionButtons from '@/features/order-details/components/order-detail-card/order-detail-action-buttons';
import SenderCard from '@/features/order-details/components/order-detail-card/order-detail-sender';
import OrderDetailStatus from '@/features/order-details/components/order-detail-card/order-detail-status';
import SwapJourney from '@/features/order-details/components/order-detail-card/order-detail-swap-journey';
import OrderExpiredCard from '@/features/order-details/components/order-detail-card/order-expired-card';
import OrderFailedCard from '@/features/order-details/components/order-detail-card/order-failed-card';
import OrderRefundedCard from '@/features/order-details/components/order-detail-card/order-refunded-card';
import {
  LONGER_THAN_USUAL_MODAL_TIMEOUT_MS,
  ORDER_STATUS,
} from '@/features/order-details/constants';
import { getOrderStatus } from '@/features/order-details/utils/get-order-status';
import { OrderStatusResult, Token } from '@/graphql/generated';
import { triggerAddressableEvent } from '@/utils/addressable-event';

interface OrderDetailCardProps {
  orderData?: OrderStatusResult | null;
  tokenData?: {
    tokenIn: Token | null;
    tokenOut: Token | null;
  };
}

const OrderDetailCard = ({ orderData, tokenData }: OrderDetailCardProps) => {
  const tOrderDetails = useTranslations('orderDetails');

  const { tokenIn: tokenInData, tokenOut: tokenOutData } = tokenData ?? {};
  const {
    isCompleted,
    isWaiting,
    isExpired,
    isBiggerThanCompleted,
    isFailed,
    isRefunded,
  } = getOrderStatus(orderData?.status ?? 0);

  const displayStatus = (orderData?.status ?? 0) + 1;
  const idDex = orderData?.isDex;

  const showLongerThanUsualModal =
    displayStatus !== undefined &&
    displayStatus >= ORDER_STATUS.EXCHANGING &&
    displayStatus < ORDER_STATUS.COMPLETED;

  useEffect(() => {
    if (!orderData || !orderData.houdiniId) return;
    if (!getOrderStatus(orderData.status ?? 0).isCompleted) return;
    const eventKey = `v4_status_completed_${orderData.houdiniId}`;
    if (!sessionStorage.getItem(eventKey)) {
      triggerAddressableEvent('v4_status_completed', true, [
        { name: 'orderID', value: orderData.houdiniId },
        { name: 'tx hash', value: orderData.transactionHash },
        { name: 'amount out usd', value: orderData.outAmount },
      ]);
      sessionStorage.setItem(eventKey, 'true');
    }
  }, [orderData]);

  return (
    <div className="flex min-w-full flex-col gap-6">
      <OrderCompletedConfetti isCompleted={isCompleted} />

      {isExpired && <OrderExpiredCard houdiniId={orderData?.houdiniId} />}

      {isFailed && <OrderFailedCard houdiniId={orderData?.houdiniId} />}

      {isRefunded && <OrderRefundedCard houdiniId={orderData?.houdiniId} />}

      {!isBiggerThanCompleted && (
        <OrderDetailStatus
          orderData={orderData}
          outTokenData={tokenOutData as Token}
          inTokenData={tokenInData as Token}
        />
      )}

      {isWaiting && !idDex && (
        <SenderCard tokenInData={tokenInData as Token} orderData={orderData} />
      )}

      <SwapJourney
        tokenInData={tokenInData as Token}
        tokenOutData={tokenOutData as Token}
        orderData={orderData}
      />

      {isCompleted && (
        <OrderDetailActionButtons orderData={orderData as OrderStatusResult} />
      )}

      {!idDex && (
        <InformativeTimedModal
          title={tOrderDetails('longerThanUsualModalTitle')}
          description={tOrderDetails('longerThanUsualModalDescription')}
          timeout={LONGER_THAN_USUAL_MODAL_TIMEOUT_MS}
          showModal={showLongerThanUsualModal}
        />
      )}
    </div>
  );
};

export default OrderDetailCard;
