import { ArrowRight, Trash2 } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { CopyToClipboardButton } from '@/components/ui/copy-to-clipboard-button';
import { useMultiSwapStore } from '@/features/swap/stores/use-swap-store';
import { Token } from '@/graphql/generated';
import { formatNumber, formatTruncatedAddress } from '@/lib/utils';

interface SwapCardProps {
  index: number;
  amount: string;
  address: string;
  tokenInData?: Token;
  tokenOutData?: Token;
  amountOut?: number;
}

const ICON_SIZE = 40;

const SwapCard = ({
  index,
  amount,
  address,
  tokenInData,
  tokenOutData,
  amountOut,
}: SwapCardProps) => {
  const { removeSwap } = useMultiSwapStore();

  return (
    <div className="grid grid-cols-3 items-center gap-3 border-b border-neutral-900 py-3 hover:bg-gray-800/50 md:flex md:justify-between md:gap-2 md:px-4">
      <div className="flex items-center gap-2">
        {tokenInData?.icon ? (
          <Image
            src={tokenInData.icon}
            alt={tokenInData?.symbol}
            width={ICON_SIZE}
            height={ICON_SIZE}
          />
        ) : (
          <div className="h-6 w-6 rounded-full bg-gray-800" />
        )}
        <div className="text-label-xs flex flex-col">
          <span>{tokenInData?.symbol}</span>
          <span className="text-neutral-500">
            {formatNumber(Number(amount), {
              maxDecimals: 2,
            })}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ArrowRight className="mx-auto h-4 w-4 shrink-0" />
        {tokenOutData?.icon ? (
          <Image
            src={tokenOutData.icon}
            alt={tokenOutData.symbol}
            width={ICON_SIZE}
            height={ICON_SIZE}
          />
        ) : (
          <div className="h-6 w-6 rounded-full bg-gray-800" />
        )}
        <div className="text-label-xs flex flex-col">
          <span>{tokenOutData?.symbol}</span>
          <span className="text-neutral-500">
            {formatNumber(Number(amountOut), {
              maxDecimals: 2,
            })}
          </span>
        </div>
      </div>

      <div className="col-span-3 flex items-center justify-between md:w-1/3">
        <CopyToClipboardButton value={address} className="px-0 md:px-2">
          {formatTruncatedAddress(address, 3)}
        </CopyToClipboardButton>
        <Button variant="ghost" size="icon" onClick={() => removeSwap(index)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default SwapCard;
