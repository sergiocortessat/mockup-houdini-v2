import Humanize from 'humanize-plus';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface TokenSummaryProps {
  icon: string;
  symbol: string;
  price: number;
  change: number;
  marketCap: number;
  volume: number;
  supply: number;
  capital: number;
}

const TokenSummary = ({
  icon,
  symbol,
  price,
  change,
  marketCap,
  volume,
  supply,
  capital,
}: TokenSummaryProps) => {
  const t = useTranslations('exchange');
  return (
    <div className="flex-1 p-4">
      <div className="mb-6 flex items-center gap-2">
        <div className="relative">
          <Image src={icon} alt={symbol} width={52} height={52} />
        </div>
        <div className="mt-3 flex flex-col">
          <dt className="text-sm font-medium">{symbol}</dt>
          <dd className="font-inter mb-2 text-sm text-neutral-500">
            $ {Humanize.formatNumber(price, 2)}
          </dd>
        </div>
      </div>
      <div className="flex flex-col gap-3 text-sm">
        <div className="flex items-center justify-between">
          <dt className="leading-none text-neutral-500">
            {t('change24percent')}
          </dt>
          <dd className="leading-normal font-medium text-white">{change}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="leading-none text-neutral-500">{t('marketCap')}</dt>
          <dd className="leading-normal font-medium text-white">
            $ {Humanize.formatNumber(capital, 2)}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="leading-none text-neutral-500">{t('volume24')}</dt>
          <dd className="leading-normal font-medium text-white">
            $ {Humanize.formatNumber(volume, 2)}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="leading-none text-neutral-500">
            {t('circulatingSupply')}
          </dt>
          <dd className="leading-normal font-medium text-white">
            $ {Humanize.formatNumber(supply, 2)}
          </dd>
        </div>
      </div>
    </div>
  );
};

export default TokenSummary;
