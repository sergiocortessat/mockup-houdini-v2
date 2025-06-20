import DeleteOrderButton from '@/features/order-details/components/order-detail-card/order-detail-action-buttons/delete-order-button';
import TrySimilarRouteButton from '@/features/order-details/components/order-detail-card/order-detail-action-buttons/try-similar-route-button';
import { OrderStatusResult } from '@/graphql/generated';

const OrderDetailActionButtons = ({
  orderData,
}: {
  orderData: OrderStatusResult;
}) => {
  return (
    <div className="flex w-full flex-col gap-2 md:flex-row">
      <TrySimilarRouteButton orderData={orderData as OrderStatusResult} />
      <DeleteOrderButton orderData={orderData as OrderStatusResult} />
    </div>
  );
};

export default OrderDetailActionButtons;
