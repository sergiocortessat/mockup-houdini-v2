import { useTranslations } from 'next-intl';
import Link from 'next/link';

import ExchangeBlock from '@/features/exchange/components/exchange-block';
import { TokenPair } from '@/features/exchange/types';

type OtherOptionsProps = {
  fromName: string;
  fromSymbol: string;
  toSymbol: string;
  pairs: [TokenPair, TokenPair][];
};

const getColumnStart = (index: number, totalItems: number): string => {
  const isLastRow = index >= Math.floor(totalItems / 4) * 4;
  const remainingItems = totalItems % 4;

  if (!isLastRow || remainingItems === 0) return '';

  switch (remainingItems) {
    case 1:
      return 'lg:col-start-2 lg:col-span-2';
    case 2:
      return index === totalItems - 2 ? 'lg:col-start-2' : '';
    case 3:
      return index === totalItems - 3 ? 'lg:col-start-2' : '';
    default:
      return '';
  }
};

export default function OtherOptions({
  fromName,
  fromSymbol,
  toSymbol,
  pairs,
}: OtherOptionsProps) {
  const t = useTranslations('exchange');
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2.5 px-4">
        <h2 className="text-display-xxs md:text-display-xs text-center tracking-tight md:text-left">
          {t('otherSwapsTitle', {
            from: fromName,
          })}
        </h2>
        <p className="text-body-xxs md:text-body-xs text-neutral-500">
          {t('otherSwapsDescription', {
            fromName,
            from: fromSymbol,
            to: toSymbol,
          })}
        </p>
      </div>
      <div className="grid grid-cols-1 items-stretch justify-items-center gap-3 p-4 md:grid-cols-2 md:gap-4 md:p-0 lg:grid-cols-4">
        {pairs.map(([from, to], index) => (
          <div
            key={`${from.cexTokenId}-${to.cexTokenId}`}
            className={`w-full md:max-w-[320px] ${getColumnStart(index, pairs.length)}`}
          >
            <Link
              href={`/?tokenIn=${from.cexTokenId}&tokenOut=${to.cexTokenId}`}
              className="block h-full"
            >
              <ExchangeBlock from={from} to={to} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
