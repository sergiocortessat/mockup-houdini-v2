import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { OrderStatusResult } from '@/graphql/generated';

interface TrySimilarRouteButtonProps {
  orderData: OrderStatusResult;
}

const TrySimilarRouteButton = ({ orderData }: TrySimilarRouteButtonProps) => {
  const t = useTranslations('orderDetails.actionButtons');
  const router = useRouter();

  const handleTrySimilarRoute = () => {
    // Preserve the user's inputs from the failed/expired order
    const searchParams = new URLSearchParams({
      tokenIn: orderData.inSymbol || '',
      tokenOut: orderData.outSymbol || '',
      amount: orderData.inAmount?.toString() || '',
      address: orderData.receiverAddress || '',
      isPrivate: orderData.anonymous ? 'true' : '',
    });

    // Navigate to swap page with preserved inputs
    router.push(`/?${searchParams.toString()}`);
  };

  return (
    <Button onClick={handleTrySimilarRoute} size="xl" className="w-full">
      {t('startNewTrade')}
    </Button>
  );
};

export default TrySimilarRouteButton;
