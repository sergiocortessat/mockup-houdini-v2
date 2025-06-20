import { useCallback, useEffect, useRef, useState } from 'react';

import { APPROVAL_POLLING_INTERVAL_MS } from '@/features/swap/constants';
import { DexExchangeStatus } from '@/features/swap/types';

interface ApprovalStatusCheckerProps {
  getApprove: () => Promise<any>;
  stopPollingApprove: () => void;
  onStatusChange: (status: DexExchangeStatus) => void;
}

export const useApprovalStatusChecker = ({
  getApprove,
  stopPollingApprove,
  onStatusChange,
}: ApprovalStatusCheckerProps) => {
  const [isChecking, setIsChecking] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onCompleteCallbackRef = useRef<((success: boolean) => void) | null>(
    null
  );

  const stopChecking = useCallback((success = false) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsChecking(false);

    // Call the completion callback if it exists
    if (onCompleteCallbackRef.current) {
      onCompleteCallbackRef.current(success);
      onCompleteCallbackRef.current = null;
    }
  }, []);

  const checkApprovalStatus = useCallback(async () => {
    try {
      const pollRes = await getApprove();
      const pollApproveTransaction = pollRes?.data?.approve?.approvals;
      // If approve returns empty array or null, approvals are complete
      if (
        !pollApproveTransaction ||
        (Array.isArray(pollApproveTransaction) &&
          pollApproveTransaction.length === 0)
      ) {
        console.log('All approvals completed');
        stopPollingApprove();
        stopChecking(true); // Success = true
        onStatusChange(DexExchangeStatus.SWAPPING);
      } else {
        // More approvals still needed, continue polling
        console.log('Still waiting for approvals to complete');
        onStatusChange(DexExchangeStatus.APPROVING);
      }
    } catch (error) {
      console.error('Error checking approval status:', error);
      stopPollingApprove();
      stopChecking(false); // Success = false
      onStatusChange(DexExchangeStatus.ERROR);
    }
  }, [getApprove, onStatusChange, stopChecking, stopPollingApprove]);

  const startChecking = useCallback(
    (onCompleteCallback?: (success: boolean) => void) => {
      if (isChecking) return;

      // Store the callback if provided
      if (onCompleteCallback) {
        onCompleteCallbackRef.current = onCompleteCallback;
      }

      setIsChecking(true);
      // Perform initial check immediately
      checkApprovalStatus();

      // Set up interval for subsequent checks
      intervalRef.current = setInterval(
        checkApprovalStatus,
        APPROVAL_POLLING_INTERVAL_MS
      );
    },
    [isChecking, checkApprovalStatus]
  );

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    startChecking,
  };
};
