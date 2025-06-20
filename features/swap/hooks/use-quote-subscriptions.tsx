import { useEffect } from 'react';

import { useRoutesStore } from '@/features/swap/stores/use-swap-store';
import { RoutesListType } from '@/features/swap/types';
import { calculateBestAmountFromRoutes } from '@/features/swap/utils/route-helpers';
import {
  useCexPrivateQuoteSubSubscription,
  useCexStandardQuoteSubSubscription,
  useDexQuoteSubscriptionSubscription,
} from '@/graphql/generated';

export const useQuoteSubscriptions = (quoteRequestId: string) => {
  const setRoutes = useRoutesStore((state) => state.setRoutes);
  const routes = useRoutesStore((state) => state.initialRoutes);
  const resetRoutes = useRoutesStore((state) => state.resetRoutes);

  useEffect(() => {
    resetRoutes();
  }, [quoteRequestId, resetRoutes]);

  useDexQuoteSubscriptionSubscription({
    skip: false,
    shouldResubscribe: true,
    variables: {
      quoteRequestIds: [quoteRequestId],
    },
    fetchPolicy: 'network-only',
    onData: (data) => {
      setRoutes(RoutesListType.DEX, data.data.data?.dexQuoteSub ?? []);
    },
  });

  useCexStandardQuoteSubSubscription({
    skip: false,
    shouldResubscribe: true,
    fetchPolicy: 'network-only',
    variables: {
      quoteRequestIds: [quoteRequestId],
    },
    onData: (data) => {
      setRoutes(RoutesListType.STANDARD_CEX, data.data.data?.cexQuoteSub ?? []);
    },
  });

  useCexPrivateQuoteSubSubscription({
    skip: false,
    shouldResubscribe: true,
    fetchPolicy: 'network-only',
    variables: {
      quoteRequestIds: [quoteRequestId],
    },
    onData: (data) => {
      setRoutes(RoutesListType.PRIVATE_CEX, data.data.data?.cexQuoteSub ?? []);
    },
  });

  const bestAmountFromSubscriptions = calculateBestAmountFromRoutes(routes);

  return { bestAmountFromSubscriptions };
};
