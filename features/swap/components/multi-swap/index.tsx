import { useEffect } from 'react';

import SwapCard from '@/features/swap/components/multi-swap/multi-swap-card';
import { MultiSwapList } from '@/features/swap/components/multi-swap/multi-swap-list';
import { useSwapUrlParams } from '@/features/swap/hooks/use-swap-url-params';
import { useMultiSwapStore } from '@/features/swap/stores/use-swap-store';
import { Token } from '@/graphql/generated';

const MultiSwap = ({
  tokenInData,
  tokenOutData,
}: {
  tokenInData?: Token;
  tokenOutData?: Token;
}) => {
  const { setSwapParams } = useSwapUrlParams();

  const swaps = useMultiSwapStore((state) => state.swaps);

  useEffect(() => {
    setSwapParams({ isMultiSwap: swaps.length > 0 });
  }, [swaps.length, setSwapParams]);

  if (swaps.length === 0) {
    return null;
  }

  return (
    <div className="my-6 flex flex-col items-center justify-center space-y-4">
      {swaps.length > 0 && (
        <MultiSwapList>
          {swaps.map((swap, index) => (
            <SwapCard
              key={index}
              index={index}
              amount={swap.amount}
              amountOut={swap.amountOut}
              address={swap.address}
              tokenInData={tokenInData}
              tokenOutData={tokenOutData}
            />
          ))}
        </MultiSwapList>
      )}
    </div>
  );
};

export default MultiSwap;
