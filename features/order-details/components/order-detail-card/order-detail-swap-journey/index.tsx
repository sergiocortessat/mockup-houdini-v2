import {
  ArrowRight,
  ArrowRightLeft,
  Clock,
  Coins,
  ExternalLink,
  Link,
  Link2,
  Wallet,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import NextLink from 'next/link';

import ImageWithFallback from '@/components/image-with-fallback';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { OrderStatusResult, Token } from '@/graphql/generated';
import { formatTruncatedAddress } from '@/lib/utils';

interface SwapJourneyCardProps {
  tokenInData?: Token | null;
  tokenOutData?: Token | null;
  orderData?: OrderStatusResult | null;
}

const iconSize = 32;

function formatEtaDuration(etaMinutes?: number | null): string {
  if (etaMinutes === undefined || etaMinutes === null) return '--:--';
  const minutes = Math.floor(etaMinutes % 60);
  return `${String(minutes).padStart(2, '0')}:00`;
}

const SwapJourneyCard = ({
  tokenInData,
  tokenOutData,
  orderData,
}: SwapJourneyCardProps) => {
  const t = useTranslations('orderDetails.swapJourney');

  const amountIn = orderData?.inAmount?.toString();
  const amountOut = orderData?.outAmount?.toString();
  const address = orderData?.receiverAddress;
  const tickerIn = tokenInData?.symbol;
  const tickerOut = tokenOutData?.symbol;
  const chainIn = tokenInData?.chainData?.name;
  const chainOut = tokenOutData?.chainData?.name;
  const tickerInIcon = tokenInData?.icon;
  const tickerOutIcon = tokenOutData?.icon;
  const etaMinutes = orderData?.eta;
  const etaFormatted = formatEtaDuration(etaMinutes);

  return (
    <Card className="max-w-full space-y-4 rounded-3xl bg-neutral-900 p-4">
      {/* Header & Badges */}
      <div className="flex items-center gap-3">
        <div className="text-heading-md">{t('title')}</div>
      </div>

      {/* Ticker Row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-neutral-500">
            <Coins size={18} />
          </span>
          <span className="text-body-sm text-neutral-500">{t('ticker')}</span>
        </div>
        <div className="ml-4 flex items-center gap-2">
          <span className="text-label-md">{tickerIn}</span>

          {tickerInIcon && (
            <ImageWithFallback
              src={tickerInIcon}
              alt={tickerIn ?? ''}
              width={iconSize}
              height={iconSize}
            />
          )}
          <ArrowRight size={16} />
          {tickerOutIcon && (
            <ImageWithFallback
              src={tickerOutIcon}
              alt={tickerOut ?? ''}
              width={iconSize}
              height={iconSize}
            />
          )}
          <span className="text-label-md">{tickerOut}</span>
        </div>
      </div>

      <Separator />

      {/* Amount Row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-neutral-500">
            <ArrowRightLeft size={18} />
          </span>
          <span className="text-body-sm text-neutral-500">{t('amount')}</span>
        </div>
        <div className="ml-4 flex items-center gap-2">
          <span className="text-label-md xs:max-w-[100px] max-w-[80px] truncate sm:max-w-[180px]">
            {amountIn}
          </span>
          <ArrowRight size={16} />
          <span className="text-label-md xs:max-w-[100px] max-w-[80px] truncate sm:max-w-[180px]">
            {amountOut}
          </span>
        </div>
      </div>

      <Separator />

      {/* Chain Row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-neutral-500">
            <Link size={18} />
          </span>
          <span className="text-body-sm text-neutral-500">{t('chain')}</span>
        </div>
        <div className="ml-4 flex items-center gap-2">
          <span className="text-label-md max-w-[100px] truncate sm:max-w-[160px]">
            {chainIn}
          </span>

          <ArrowRight size={16} />

          <span className="text-label-md max-w-[100px] truncate sm:max-w-[160px]">
            {chainOut}
          </span>
        </div>
      </div>

      <Separator />

      {/* Wallet Row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-neutral-500">
            <Wallet size={18} />
          </span>
          <span className="text-body-sm text-neutral-500">
            {t('recipientWallet')}
          </span>
        </div>
        <NextLink
          href={`${orderData?.outToken?.chainData?.addressUrl?.replace(
            '{address}',
            orderData?.receiverAddress ?? ''
          )}`}
          target="_blank"
          className="text-label-md ml-4 flex items-center gap-2"
        >
          {formatTruncatedAddress(address)}
          <ExternalLink size={18} />
        </NextLink>
      </div>

      <Separator />

      {/* Time Row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-neutral-500">
            <Clock size={18} />
          </span>
          <span className="text-body-sm text-neutral-500">{t('time')}</span>
        </div>
        <div className="ml-4 flex items-center gap-2">
          <span className="text-label-md">{etaFormatted}</span>
        </div>
      </div>

      {/* Transaction Row */}
      {orderData?.hashUrl && (
        <>
          <Separator />
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-neutral-500">
                <Link2 size={18} />
              </span>
              <span className="text-label-md text-neutral-500">
                {t('transaction')}
              </span>
            </div>
            <NextLink
              href={orderData?.hashUrl ?? ''}
              target="_blank"
              className="text-label-md ml-4 flex items-center gap-2"
            >
              {formatTruncatedAddress(orderData?.transactionHash)}
              <ExternalLink size={18} />
            </NextLink>
          </div>
        </>
      )}
    </Card>
  );
};

export default SwapJourneyCard;
