import { useMemo } from 'react';

interface TokenExchangeRatesProps {
  fromSymbol: string;
  toSymbol: string;
  fromPrice: number;
  toPrice: number;
  amounts?: number[];
}

const DEFAULT_AMOUNTS = [1, 5, 10, 25, 50, 100, 500, 1000];

const TokenExchangeRates = ({
  fromSymbol,
  toSymbol,
  fromPrice,
  toPrice,
  amounts = DEFAULT_AMOUNTS,
}: TokenExchangeRatesProps) => {
  const exchangeRates = useMemo(() => {
    return amounts.map((amount) => ({
      from: amount,
      to: ((amount * fromPrice) / toPrice).toFixed(6),
    }));
  }, [amounts, fromPrice, toPrice]);

  return (
    <div className="flex-1 p-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          {exchangeRates.map(({ from }) => (
            <div key={from} className="py-2 text-neutral-500">
              {from} {fromSymbol}
            </div>
          ))}
        </div>
        <div className="flex flex-col items-end">
          {exchangeRates.map(({ to }) => (
            <div key={to} className="py-2 text-neutral-500">
              {to} {toSymbol}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TokenExchangeRates;
