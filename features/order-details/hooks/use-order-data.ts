import { useSubscription } from '@apollo/client';
import { useEffect } from 'react';

import {
  MULTI_ORDER_POLLING_INTERVAL,
  ORDER_STATUS,
  SINGLE_ORDER_FALLBACK_POLLING_INTERVAL,
  TRACK_ORDER_POLLING_INTERVAL,
} from '@/features/order-details/constants';
import { ORDER_STATUS_SUBSCRIPTION } from '@/features/order-details/graphql/queries.graphql';
import {
  useMultiStatusQuery,
  useStatusQuery,
  useTrackOrderQuery,
} from '@/graphql/generated';

export type OrderDataResult = {
  orderData: any | any[] | null;
  isLoading: boolean;
  errorMessage: string | null;
};

export const useOrderData = ({
  houdiniId,
  id,
  multiId,
}: {
  houdiniId: string | null;
  id: string | null;
  multiId: string | null;
}): OrderDataResult => {
  const { data: subscriptionData } = useSubscription(
    ORDER_STATUS_SUBSCRIPTION,
    {
      variables: {
        houdiniIds: [houdiniId],
      },
      skip: !houdiniId,
      fetchPolicy: 'no-cache',
    }
  );

  // Single order query
  const {
    data: singleData,
    loading: singleLoading,
    error: singleError,
    startPolling: startSinglePolling,
    stopPolling: stopSinglePolling,
  } = useStatusQuery({
    variables: { id: houdiniId || '' },
    skip: !houdiniId,
    fetchPolicy: 'no-cache',
  });

  // Track order query
  const {
    data: trackData,
    loading: trackLoading,
    error: trackError,
    startPolling: startTrackPolling,
    stopPolling: stopTrackPolling,
  } = useTrackOrderQuery({
    variables: { id: id || '' },
    skip: !id,
    fetchPolicy: 'no-cache',
  });

  // Multi-order query
  const {
    data: multiData,
    loading: multiLoading,
    error: multiError,
    startPolling: startMultiPolling,
    stopPolling: stopMultiPolling,
  } = useMultiStatusQuery({
    variables: { multiId: multiId || '' },
    skip: !multiId,
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    if (houdiniId) {
      startSinglePolling(SINGLE_ORDER_FALLBACK_POLLING_INTERVAL);
    }
  }, [houdiniId, startSinglePolling]);

  useEffect(() => {
    if (id) {
      startTrackPolling(TRACK_ORDER_POLLING_INTERVAL);
    }
  }, [id, startTrackPolling]);

  useEffect(() => {
    if (multiId) {
      startMultiPolling(MULTI_ORDER_POLLING_INTERVAL);
    }
  }, [multiId, startMultiPolling]);

  const isLoading = singleLoading || trackLoading || multiLoading;

  const errorMessage =
    singleError?.message || trackError?.message || multiError?.message || null;

  const orderData =
    subscriptionData?.orderStatusSub ||
    singleData?.status ||
    trackData?.trackOrder ||
    multiData?.multiStatus ||
    null;

  // Stop polling when order is complete
  useEffect(() => {
    if (
      orderData?.status >= ORDER_STATUS.COMPLETED &&
      orderData?.status !== ORDER_STATUS.EXPIRED
    ) {
      stopSinglePolling();
      stopTrackPolling();
      stopMultiPolling();
    }
  }, [
    orderData?.status,
    stopSinglePolling,
    stopTrackPolling,
    stopMultiPolling,
  ]);

  return {
    orderData,
    isLoading,
    errorMessage,
  };
};
