import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/urls';
import { OrderStatusResult, useEaseOrderMutation } from '@/graphql/generated';

const DeleteOrderButton = ({ orderData }: { orderData: OrderStatusResult }) => {
  const t = useTranslations('orderDetails.actionButtons');
  const router = useRouter();
  const [deleteOrder, { loading }] = useEaseOrderMutation();
  const handleDeleteOrderData = () => {
    deleteOrder({ variables: { id: orderData.houdiniId ?? '' } });
    toast.success(t('orderDeleted'));
    router.push(ROUTES.HOME);
  };

  return (
    <Button
      size="xl"
      variant="outline"
      className="w-full"
      onClick={handleDeleteOrderData}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        t('deleteOrderData')
      )}
    </Button>
  );
};

export default DeleteOrderButton;
