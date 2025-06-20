'use client';

import { format } from 'date-fns';
import { ArrowUpDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import TokenInput from '@/features/exchange/components/token-input';

type Token = {
  icon: string;
  symbol: string;
  price: number;
  cexTokenId: string;
  modified?: string;
};

type SimpleSwapProps = {
  from: Token;
  to: Token;
  amount: number;
};

export default function SimpleSwap({ from, to, amount }: SimpleSwapProps) {
  const t = useTranslations('exchange');

  const [fromToken, setFromToken] = useState(from);
  const [toToken, setToToken] = useState(to);
  const [fromAmount, setFromAmount] = useState(amount || '1');
  const [isRotated, setIsRotated] = useState(false);

  const exchangeRatio = useMemo(
    () => (toToken.price ? fromToken.price / toToken.price : 0),
    [toToken.price, fromToken.price]
  );
  const exOutAmout = useMemo(
    () => (Number(fromAmount) || 0) * exchangeRatio,
    [fromAmount, exchangeRatio]
  );

  const switchToken = () => {
    setIsRotated(!isRotated);
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(exOutAmout.toString());
  };

  const updateAt = format(
    new Date(fromToken?.modified || toToken?.modified || new Date()),
    'HH:mm'
  );

  return (
    <div className="flex w-full flex-col gap-y-5 rounded-3xl border p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <span className="text-xl font-semibold text-white">
          {t('swapActionTabTitle')}
        </span>
        <span className="text-label-xs rounded-xl bg-[#111827] px-4 py-2 text-gray-400">
          {t('lastUpdate')}: {updateAt}
        </span>
      </div>

      <div className="relative">
        {/* First Token Input */}
        <div className="relative">
          <TokenInput
            symbol={fromToken.symbol}
            icon={fromToken.icon}
            label={t('youSend')}
            value={fromAmount}
            onChange={({ target: { value } }) => {
              // Only allow numbers and decimal points
              if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
                setFromAmount(value);
              }
            }}
            usdValue={Number(fromAmount) * fromToken.price}
          />
        </div>

        {/* Second Token Input */}
        <div className="relative mt-2">
          <TokenInput
            symbol={toToken.symbol}
            icon={toToken.icon}
            label={t('youGet')}
            value={exOutAmout.toFixed(2)}
            readOnly
            usdValue={exOutAmout * toToken.price}
            className="token-input-with-cutout border-none bg-[#111827]"
          />
        </div>

        {/* Switch Button */}
        <div className="absolute top-1/2 left-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center pb-5 md:pb-0">
          <Button
            size="icon"
            variant="secondary"
            className={`h-14 w-14 rounded-full transition-transform duration-300 disabled:opacity-100 ${
              isRotated ? 'rotate-180' : ''
            }`}
            onClick={switchToken}
            aria-label={t('switchTokens')}
          >
            <ArrowUpDown className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Swap Button */}
      <Button asChild className="w-full" size="xl">
        <Link
          href={`/?tokenIn=${fromToken.cexTokenId}&tokenOut=${toToken.cexTokenId}&amount=${fromAmount}`}
        >
          {t('swap')}
        </Link>
      </Button>
    </div>
  );
}
