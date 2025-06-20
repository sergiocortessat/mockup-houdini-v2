import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

import { Skeleton } from '@/components/ui/skeleton';
import { TOKEN, TOKEN_IDS } from '@/features/analytics/constants';
import { useTokenDataQuery } from '@/graphql/generated';

interface BuyTokenPoolDataProps {
  activeToken: TOKEN;
}

const BuyTokenPoolData = ({ activeToken }: BuyTokenPoolDataProps) => {
  const { data: lockData, loading: lockTokenLoading } = useTokenDataQuery({
    variables: {
      id: TOKEN_IDS[activeToken],
    },
  });

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center rounded-full">
        {lockTokenLoading ? (
          <Skeleton className="h-6 w-6" />
        ) : (
          <Image
            src={lockData?.token?.icon || ''}
            alt={lockData?.token?.symbol || 'LOCK'}
            width={40}
            height={40}
          />
        )}
      </div>
      <div>
        <div className="text-heading-sm md:text-heading-md text-neutral-500">
          {lockTokenLoading ? (
            <Skeleton className="h-6 w-20" />
          ) : (
            `${lockData?.token?.symbol || 'LOCK'} / USDT`
          )}
        </div>
        <div className="text-heading-sm md:text-heading-md">
          {lockTokenLoading || !lockData ? (
            <Skeleton className="h-6 w-20" />
          ) : Number(lockData?.token?.change) > 0 ? (
            <span className="flex items-center gap-2 text-green-500">
              {Number(lockData?.token?.change) + '%'}
              <ArrowUpRight className="text-label-xs h-4 w-4 text-green-500" />
            </span>
          ) : Number(lockData?.token?.change) < 0 ? (
            <span className="flex items-center gap-2 text-red-500">
              {Number(lockData?.token?.change) + '%'}
              <ArrowDownRight className="text-label-xs h-4 w-4 text-red-500" />
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default BuyTokenPoolData;
