'use client';

import { parseAsString, useQueryStates } from 'nuqs';
import { useEffect } from 'react';

import { getPartnerId } from '@/utils/get-stored-partner-id';

// This hook is used to sync the partnerId from the URL or local storage to the query params

export function UsePartnerIdSync() {
  const [partnerId, setPartnerId] = useQueryStates({
    partnerId: parseAsString.withDefault(''),
  });

  useEffect(() => {
    const storedPartnerId = getPartnerId();
    if (storedPartnerId?.length && !partnerId.partnerId) {
      setPartnerId({ partnerId: storedPartnerId });
    }
  }, [partnerId, setPartnerId]);

  return null;
}
