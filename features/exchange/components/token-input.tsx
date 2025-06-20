import Image from 'next/image';
import { ChangeEventHandler } from 'react';

import { cn } from '@/lib/utils';

export type TokenInputProps = {
  symbol: string;
  icon: string;
  label: string;
  value: string | number;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  readOnly?: boolean;
  className?: string;
  usdValue?: number;
};

export default function TokenInput({
  icon,
  symbol,
  label,
  value,
  onChange,
  readOnly,
  className,
  usdValue,
}: TokenInputProps) {
  return (
    <div
      className={cn('rounded-xl border border-[#2A2D3A] p-2 lg:p-4', className)}
    >
      <p className="text-md mb-3 font-medium">{label}</p>

      <div className="flex items-center justify-between gap-x-2">
        <div className="mb-3 flex flex-1 items-center gap-2">
          {/* Main token icon */}
          {icon && <Image src={icon} alt={symbol} width={48} height={48} />}

          <div className="flex items-center gap-x-1 rounded-[256px] bg-[#1F2937] px-1 py-1 lg:min-w-[80px]">
            {icon && <Image src={icon} alt={symbol} width={32} height={32} />}
            <span className="mr-2 text-xs">{symbol}</span>
          </div>
        </div>

        {/* Value display or input */}
        <div className="flex flex-1 flex-col items-end justify-end">
          {readOnly ? (
            <span className="font-medium lg:text-3xl">{value}</span>
          ) : (
            <input
              type="text"
              value={value}
              onChange={onChange}
              className="text-display-xs w-full border-none bg-transparent text-right font-medium outline-none"
              placeholder="0.00"
            />
          )}
          {usdValue !== undefined && (
            <span className="text-label-sm text-right text-gray-400">
              ${usdValue.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
