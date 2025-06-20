import { AlertTriangle } from 'lucide-react';
import { useTranslations } from 'next-intl';

import ImageWithFallback from '@/components/image-with-fallback';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { CopyToClipboardButton } from '@/components/ui/copy-to-clipboard-button';
import { Separator } from '@/components/ui/separator';
import OrderDetailActionButtons from '@/features/order-details/components/order-detail-card/order-detail-sender/order-detail-action-buttons';
import SenderTag from '@/features/order-details/components/order-detail-card/order-detail-sender/sender-tag';
import { ChainKind } from '@/features/swap/types';
import { WalletConnectionHandler } from '@/features/wallet/components/wallet-connection-handler';
import { OrderStatusResult, Token } from '@/graphql/generated';

interface SenderCardProps {
  tokenInData?: Token | null;
  orderData?: OrderStatusResult | null;
}

const iconSize = 44;

const SenderCard = ({ tokenInData, orderData }: SenderCardProps) => {
  const t = useTranslations('orderDetails');
  const senderTag = orderData?.senderTag;
  const inTokenIcon = tokenInData?.icon ?? '';
  const inTokenSymbol = tokenInData?.symbol ?? '';
  const inTokenNetworkName = tokenInData?.chainData?.name ?? '';
  return (
    <Card className="w-full max-w-full space-y-4 rounded-3xl p-4">
      <div className="text-heading-md">{t('sendFundsToStartOrder')}</div>

      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-neutral-500">{t('send')}</span>

        <div className="flex items-center justify-between gap-2">
          <CopyToClipboardButton
            value={orderData?.inAmount?.toString() || ''}
            tooltipText={t('copyAmount')}
          >
            <div className="text-display-xxs break-all whitespace-normal">
              {orderData?.inAmount?.toString()}
            </div>
          </CopyToClipboardButton>

          <div className="flex h-10 w-[144px] items-center gap-2 rounded-lg bg-neutral-700 px-1 lg:h-[56px] lg:w-[200px]">
            {inTokenIcon && (
              <ImageWithFallback
                src={inTokenIcon as string}
                alt={inTokenSymbol}
                width={iconSize}
                height={iconSize}
              />
            )}
            <div className="flex flex-col items-start">
              <span className="text-label-md">{inTokenSymbol}</span>
              <span className="text-label-xs text-muted-foreground max-w-[66px] truncate lg:max-w-[96px]">
                {t('tokenNetwork', {
                  tokenNetworkName: inTokenNetworkName,
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div className="flex flex-col items-start gap-2">
        <span className="text-body-sm text-neutral-500">
          {t('sendToAddress')}
        </span>
        <CopyToClipboardButton
          value={orderData?.senderAddress || ''}
          tooltipText={t('copyAddress')}
          className="min-h-fit"
        >
          <div className="text-label-md text-left break-all whitespace-normal">
            {orderData?.senderAddress}
          </div>
        </CopyToClipboardButton>
      </div>

      <Separator />
      <Alert className="text-alert-warning-foreground bg-yellow-700">
        <AlertTriangle className="text-alert-warning" />
        <AlertDescription className="text-body-sm">
          {t('transactionsSentToFromSmartContracts')}
        </AlertDescription>
      </Alert>

      <Separator />
      {senderTag ? (
        <>
          <SenderTag senderTag={senderTag ?? ''} />
          <Separator />
        </>
      ) : null}
      <WalletConnectionHandler>
        {({ handleWalletConnection }) => (
          <OrderDetailActionButtons
            orderData={orderData}
            address={orderData?.senderAddress}
            amount={orderData?.inAmount}
            token={tokenInData as Token}
            network={tokenInData?.chainData?.kind as ChainKind}
            handleWalletConnection={handleWalletConnection}
          />
        )}
      </WalletConnectionHandler>
    </Card>
  );
};

export default SenderCard;
