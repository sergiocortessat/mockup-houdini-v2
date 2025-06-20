import { ORDER_STATUS } from '@/features/order-details/constants';

export const getOrderStatus = (status?: number | null) => ({
  isWaiting: status === ORDER_STATUS.WAITING,
  isConfirming: status === ORDER_STATUS.CONFIRMING,
  isExchanging: status === ORDER_STATUS.EXCHANGING,
  isAnonymizing: status === ORDER_STATUS.ANONYMIZING,
  isDeleted: status === ORDER_STATUS.DELETED,
  isCompleted: status === ORDER_STATUS.COMPLETED,
  isExpired: status === ORDER_STATUS.EXPIRED,
  isFailed: status === ORDER_STATUS.FAILED,
  isRefunded: status === ORDER_STATUS.REFUNDED,
  isBiggerThanCompleted: (status ?? 0) > ORDER_STATUS.COMPLETED,
});
