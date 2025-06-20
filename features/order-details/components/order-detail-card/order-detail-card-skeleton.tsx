'use client';

import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export const OrderDetailCardSkeleton = () => {
  return (
    <div className="flex w-full flex-col gap-6 sm:gap-8 md:gap-10">
      {/* Header (OrderCardDetailHeader) */}
      <div className="bg-card flex h-[88px] justify-end gap-2 rounded-2xl p-4 sm:h-[122px] sm:rounded-3xl sm:p-6">
        <Skeleton className="h-7 w-40 rounded-full bg-neutral-800/70 sm:h-8 sm:w-56" />
      </div>

      {/* Sender Card Skeleton */}
      <div className="bg-card h-[300px] min-w-full space-y-4 rounded-2xl p-3 sm:h-[360px] sm:space-y-6 sm:rounded-3xl sm:p-4">
        {/* Title */}
        <Skeleton className="mb-1 h-5 w-40 rounded bg-neutral-800/70 sm:mb-2 sm:h-6 sm:w-56" />
        {/* Token to From label */}
        <Skeleton className="mb-1 h-3 w-20 rounded bg-neutral-800/70 sm:h-4 sm:w-24" />
        {/* Token Row */}
        <div className="mb-1 flex items-center justify-between gap-1 sm:mb-2 sm:gap-2">
          <Skeleton className="h-4 w-20 rounded bg-neutral-800/70 sm:h-5 sm:w-24" />
          <div className="flex items-center gap-1 rounded-lg bg-neutral-700 p-1">
            <Skeleton className="h-7 w-7 rounded-full bg-neutral-800/70 sm:h-9 sm:w-9" />
            <div className="flex flex-col gap-1">
              <Skeleton className="h-3 w-10 rounded bg-neutral-800/70 sm:h-4 sm:w-12" />
              <Skeleton className="h-2.5 w-16 rounded bg-neutral-800/70 sm:h-3 sm:w-20" />
            </div>
          </div>
        </div>
        <Separator />
        {/* Address Section */}
        <div className="mt-1 flex flex-col items-start gap-1 sm:mt-2 sm:gap-2">
          <Skeleton className="h-3 w-24 rounded bg-neutral-800/70 sm:h-4 sm:w-32" />
          <Skeleton className="h-4 w-48 rounded bg-neutral-800/70 sm:h-5 sm:w-64" />
        </div>
        <Separator />
        {/* Action Buttons */}
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
          <Skeleton className="h-10 w-full rounded-md bg-neutral-800/70 sm:h-12" />
          <Skeleton className="h-10 w-full rounded-md bg-neutral-800/70 sm:h-12" />
        </div>
      </div>

      {/* Swap Journey Card Skeleton */}
      <div className="min-w-full space-y-4 rounded-2xl bg-neutral-900 p-3 sm:space-y-6 sm:rounded-3xl sm:p-4">
        {/* Header & Badge */}
        <div className="mb-1 flex flex-col items-start gap-2 sm:mb-2 sm:flex-row sm:items-center sm:gap-3">
          <Skeleton className="h-5 w-24 rounded bg-neutral-800/70 sm:h-6 sm:w-32" />
          <Skeleton className="h-5 w-20 rounded-full bg-neutral-800/70 sm:h-6 sm:w-24" />
        </div>
        {/* Ticker Row */}
        <div className="mb-1 flex flex-col items-start justify-between gap-2 sm:mb-2 sm:flex-row sm:items-center sm:gap-3">
          <div className="flex items-center gap-1 sm:gap-2">
            <Skeleton className="h-4 w-4 rounded bg-neutral-800/70 sm:h-5 sm:w-5" />
            <Skeleton className="h-3 w-16 rounded bg-neutral-800/70 sm:h-4 sm:w-20" />
          </div>
          <div className="ml-0 flex items-center gap-1 sm:ml-4 sm:gap-2">
            <Skeleton className="h-3 w-8 rounded bg-neutral-800/70 sm:h-4 sm:w-10" />
            <Skeleton className="h-6 w-6 rounded-full bg-neutral-800/70 sm:h-8 sm:w-8" />
            <Skeleton className="h-3 w-3 rounded bg-neutral-800/70 sm:h-4 sm:w-4" />
            <Skeleton className="h-6 w-6 rounded-full bg-neutral-800/70 sm:h-8 sm:w-8" />
            <Skeleton className="h-3 w-8 rounded bg-neutral-800/70 sm:h-4 sm:w-10" />
          </div>
        </div>
        <Separator />
        {/* Amount Row */}
        <div className="mb-1 flex flex-col items-start justify-between gap-2 sm:mb-2 sm:flex-row sm:items-center sm:gap-3">
          <div className="flex items-center gap-1 sm:gap-2">
            <Skeleton className="h-4 w-4 rounded bg-neutral-800/70 sm:h-5 sm:w-5" />
            <Skeleton className="h-3 w-16 rounded bg-neutral-800/70 sm:h-4 sm:w-20" />
          </div>
          <div className="ml-0 flex items-center gap-1 sm:ml-4 sm:gap-2">
            <Skeleton className="h-3 w-12 rounded bg-neutral-800/70 sm:h-4 sm:w-14" />
            <Skeleton className="h-3 w-3 rounded bg-neutral-800/70 sm:h-4 sm:w-4" />
            <Skeleton className="h-3 w-12 rounded bg-neutral-800/70 sm:h-4 sm:w-14" />
          </div>
        </div>
        <Separator />
        {/* Chain Row */}
        <div className="mb-1 flex flex-col items-start justify-between gap-2 sm:mb-2 sm:flex-row sm:items-center sm:gap-3">
          <div className="flex items-center gap-1 sm:gap-2">
            <Skeleton className="h-4 w-4 rounded bg-neutral-800/70 sm:h-5 sm:w-5" />
            <Skeleton className="h-3 w-16 rounded bg-neutral-800/70 sm:h-4 sm:w-20" />
          </div>
          <div className="ml-0 flex items-center gap-1 sm:ml-4 sm:gap-2">
            <Skeleton className="h-3 w-12 rounded bg-neutral-800/70 sm:h-4 sm:w-16" />
            <Skeleton className="h-6 w-6 rounded-full bg-neutral-800/70 sm:h-8 sm:w-8" />
            <Skeleton className="h-3 w-3 rounded bg-neutral-800/70 sm:h-4 sm:w-4" />
            <Skeleton className="h-6 w-6 rounded-full bg-neutral-800/70 sm:h-8 sm:w-8" />
            <Skeleton className="h-3 w-12 rounded bg-neutral-800/70 sm:h-4 sm:w-16" />
          </div>
        </div>
        <Separator />
        {/* Wallet Row */}
        <div className="mb-1 flex flex-col items-start justify-between gap-2 sm:mb-2 sm:flex-row sm:items-center sm:gap-3">
          <div className="flex items-center gap-1 sm:gap-2">
            <Skeleton className="h-4 w-4 rounded bg-neutral-800/70 sm:h-5 sm:w-5" />
            <Skeleton className="h-3 w-16 rounded bg-neutral-800/70 sm:h-4 sm:w-20" />
          </div>
          <Skeleton className="ml-0 h-3 w-32 rounded bg-neutral-800/70 sm:ml-4 sm:h-4 sm:w-40" />
        </div>
        <Separator />
        {/* Time Row */}
        <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center sm:gap-3">
          <div className="flex items-center gap-1 sm:gap-2">
            <Skeleton className="h-4 w-4 rounded bg-neutral-800/70 sm:h-5 sm:w-5" />
            <Skeleton className="h-3 w-16 rounded bg-neutral-800/70 sm:h-4 sm:w-20" />
          </div>
          <div className="ml-0 flex items-center gap-1 sm:ml-4 sm:gap-2">
            <Skeleton className="h-3 w-16 rounded bg-neutral-800/70 sm:h-4 sm:w-20" />
            <Skeleton className="h-3 w-3 rounded bg-neutral-800/70 sm:h-4 sm:w-4" />
            <Skeleton className="h-3 w-20 rounded bg-neutral-800/70 sm:h-4 sm:w-24" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailCardSkeleton;
