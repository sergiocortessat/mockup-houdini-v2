'use client';

import Humanize from 'humanize-plus';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { useSwapUrlParams } from '@/features/swap/hooks/use-swap-url-params';
import { ChainKind } from '@/features/swap/types';
import { Maybe } from '@/graphql/generated';
import { useMultichainBalance } from '@/hooks/balances/use-multichain-balance';

export default function SwapInputWalletButtons({
  tokenInAddress,
  isNative,
  chainId,
  chainKind,
}: {
  tokenInAddress: string;
  isNative: boolean; // native currency
  chainId: Maybe<number> | undefined;
  chainKind: ChainKind;
}) {
  const t = useTranslations('swap.form');
  const { setSwapParams } = useSwapUrlParams();
  const { balance } = useMultichainBalance({
    tokenAddress: tokenInAddress,
    isNative,
    chainId: chainId,
    chainKind,
  });

  const isValidBalance = balance && balance !== '0' && !isNaN(Number(balance));

  if (!isValidBalance) {
    return null;
  }
  const numericBalance = Number(balance);

  const handleMaxWalletBalance = () => {
    setSwapParams({
      amount: Number(balance),
    });
  };

  const handleHalfWalletBalance = () => {
    setSwapParams({
      amount: Number(numericBalance / 2),
    });
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-label-sm text-neutral-400">
        {t('balance')}: {Humanize.formatNumber(numericBalance, 4)}
      </span>
      <Button
        variant="link"
        size="xs"
        onClick={handleHalfWalletBalance}
        className="text-label-sm h-auto px-0 underline hover:text-neutral-400"
      >
        {t('halfWalletBalance')}
      </Button>
      <Button
        variant="link"
        size="xs"
        onClick={handleMaxWalletBalance}
        className="text-label-sm h-auto px-0 underline hover:text-neutral-400"
      >
        {t('maxWalletBalance')}
      </Button>
    </div>
  );
}
