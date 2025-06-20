import { useTranslations } from 'next-intl';
import Image from 'next/image';

import BreadCrumb from '@/features/exchange/components/bread-crumb';
import HowToSwap from '@/features/exchange/components/how-to-swap';
import OtherOptions from '@/features/exchange/components/other-options';
import SimpleSwap from '@/features/exchange/components/simple-swap';
import Testimonials from '@/features/exchange/components/testimonies-examples';
import TokenExchangeRates from '@/features/exchange/components/token-exchange-rates';
import TokenSummary from '@/features/exchange/components/token-summary';
import WhyHoudini from '@/features/exchange/components/why-houdini';
import { MarketData, TokenData, TokenPair } from '@/features/exchange/types';
import { safeMarketData } from '@/features/exchange/utils/market-data';

export interface ExchangePageContentProps {
  fromToken: TokenData;
  toToken: TokenData;
  pairs: [TokenPair, TokenPair][];
}

const ExchangePageContent = ({
  fromToken,
  toToken,
  pairs,
}: ExchangePageContentProps) => {
  const t = useTranslations('exchange');

  const {
    symbol: fromSymbol = '',
    name: fromName = '',
    price: fromPrice = 0,
    icon: fromIcon = '',
    chain: fromChain = '',
    change: fromChange = 0,
    volume: fromVolume = 0,
    cgRaw,
  } = fromToken || {};

  const {
    symbol: toSymbol = '',
    name: toName = '',
    price: toPrice = 0,
    icon: toIcon = '',
    change: toChange = 0,
    volume: toVolume = 0,
    cgRaw: toCgRaw,
  } = toToken || {};

  // Safely access nested market data
  const fromMarketData: MarketData = safeMarketData(fromToken);
  const toMarketData: MarketData = safeMarketData(toToken);

  const fromSupply = fromMarketData.circulating_supply;
  const fromCapital = fromMarketData.market_cap_change_24h;
  const toSupply = toMarketData.circulating_supply;
  const toCapital = toMarketData.market_cap_change_24h;

  const from = fromSymbol;
  const to = toSymbol;

  return (
    <div className="mx-auto mb-20 flex flex-col gap-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center border-b pt-4 backdrop-blur-sm">
        <BreadCrumb from={from} to={to} className="container" />
      </div>
      <div className="container">
        {/* Main title */}
        <div className="mb-20 flex items-center justify-between">
          <h1 className="text-display-sm md:text-display-lg">
            {from} / {to}
          </h1>
          <div className="flex items-center">
            <div className="relative flex items-center gap-2">
              {fromIcon && (
                <Image src={fromIcon} alt={from} width={52} height={52} />
              )}
              {toIcon && <Image src={toIcon} alt={to} width={52} height={52} />}
            </div>
          </div>
        </div>
        {/* Sections */}
        <div className="flex flex-col gap-y-10">
          {/* Section One */}
          <div className="mb-10 grid grid-cols-1 gap-8 lg:grid-cols-5">
            {/* Left column: Text and tables */}
            <div className="lg:col-span-3">
              {/* Title and Description section */}
              <div className="mb-14">
                <h2 className="text-label-lg mb-4">
                  {t('convertFromTo', { from, to })}
                </h2>
                <div className="text-body-sm text-neutral-500">
                  {t('exchangeHeroDescription', {
                    from,
                    to,
                    exchangeRate: (fromPrice / toPrice).toFixed(6),
                  })}
                </div>
              </div>
              {/* Market data cards */}
              <div className="rounded-3xl border backdrop-blur-sm">
                <div className="flex flex-col gap-y-4 lg:flex-row">
                  <TokenSummary
                    icon={fromIcon}
                    symbol={fromSymbol}
                    price={fromPrice}
                    change={fromChange}
                    marketCap={fromCapital}
                    volume={fromVolume}
                    supply={fromSupply}
                    capital={fromCapital}
                  />
                  <TokenSummary
                    icon={toIcon}
                    symbol={toSymbol}
                    price={toPrice}
                    change={toChange}
                    marketCap={toCapital}
                    volume={toVolume}
                    supply={toSupply}
                    capital={toCapital}
                  />
                </div>
                <div className="mx-auto w-4/5 border-t"></div>
                <div className="flex flex-col gap-y-4 lg:flex-row">
                  {/* Exchange rate table */}
                  <TokenExchangeRates
                    fromSymbol={fromSymbol}
                    toSymbol={toSymbol}
                    fromPrice={fromPrice}
                    toPrice={toPrice}
                  />
                  <TokenExchangeRates
                    fromSymbol={toSymbol}
                    toSymbol={fromSymbol}
                    fromPrice={toPrice}
                    toPrice={fromPrice}
                  />
                </div>
              </div>
            </div>

            {/* Right column: Swap interface */}
            <div className="self-start lg:col-span-2">
              <SimpleSwap from={fromToken} to={toToken} amount={1} />
            </div>
          </div>
          {/* Section Two */}
          <HowToSwap
            fromSymbol={fromSymbol}
            toSymbol={toSymbol}
            fromName={fromName}
            toName={toName}
          />
          {/* Section Three */}
          <WhyHoudini
            fromSymbol={fromSymbol}
            toSymbol={toSymbol}
            fromName={fromName}
            toName={toName}
          />
          {/* Section Four */}
          <OtherOptions
            fromName={fromName}
            fromSymbol={fromSymbol}
            toSymbol={toSymbol}
            pairs={pairs || []}
          />
          {/* Section Five */}
          <Testimonials />
        </div>
      </div>
    </div>
  );
};

export default ExchangePageContent;
