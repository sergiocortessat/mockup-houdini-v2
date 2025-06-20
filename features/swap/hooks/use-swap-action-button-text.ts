import { useTranslations } from 'next-intl';

import { ChainKind, DexExchangeStatus } from '@/features/swap/types';
import { Quote, QuoteType, Route } from '@/graphql/generated';
import { useUserWallets } from '@/providers/user-wallets-provider';

interface SwapActionButtonTextParams {
  amountIn?: string | number;
  status: DexExchangeStatus;
  chainKind?: ChainKind;
  isPrivate?: boolean;
  loading?: {
    cexStandard?: boolean;
    cexPrivate?: boolean;
    multiExchange?: boolean;
  };
  isRedirecting?: boolean;
  selectedRoute?: Route | Quote | null;
}

const getRouteType = (route: Route | Quote | null | undefined) => {
  if (!route) return { isDex: false, isCex: false, isPrivate: false };
  return {
    isDex: route.type === QuoteType.Dex,
    isCex: route.type === QuoteType.Standard,
    isPrivate: route.type === QuoteType.Private,
  };
};

export const useSwapActionButtonText = ({
  amountIn,
  status,
  chainKind,
  isPrivate,
  loading = {},
  isRedirecting,
  selectedRoute,
}: SwapActionButtonTextParams) => {
  const t = useTranslations('swap');
  const {
    isDex,
    isCex,
    isPrivate: isPrivateRoute,
  } = getRouteType(selectedRoute);
  const { getIsWalletConnected } = useUserWallets();
  const isWalletConnected = getIsWalletConnected(chainKind as ChainKind);

  // 1. Loading states have highest priority
  if (loading.cexStandard) return t('button.processingStandardSwap');
  if (loading.cexPrivate) return t('button.processingPrivateSwap');
  if (loading.multiExchange) return t('button.processingMultiSwap');
  if (isRedirecting) return t('button.redirectingOrderPage');

  // 2. Input validation
  if (!amountIn || Number(amountIn) === 0) return t('button.enterAmountToSwap');
  if (!selectedRoute) return t('button.selectRouteToSwap');

  // 3. Wallet connection (only for DEX)
  if (!isWalletConnected && isDex) return t('button.connectWallet');

  // 4. CEX/Private routes
  if (isCex || isPrivateRoute || isPrivate) return t('button.proceedToSwap');

  // 5. DEX status messages
  const dexExchangeStatusMessages: Record<
    DexExchangeStatus,
    string | Record<ChainKind, string>
  > = {
    [DexExchangeStatus.IDLE]: 'button.swap',
    [DexExchangeStatus.APPROVING]: 'button.approving',
    [DexExchangeStatus.SWAPPING]: {
      [ChainKind.EVM]: 'button.processingSwap',
      [ChainKind.SOLANA]: 'button.signingTransaction',
      [ChainKind.BTC]: 'button.signingPsbt',
      [ChainKind.SUI]: 'button.processingSwap',
      [ChainKind.TRON]: 'button.signingTransaction',
      [ChainKind.TON]: 'button.signingTransaction',
    },
    [DexExchangeStatus.BROADCASTING]: 'button.swapping',
    [DexExchangeStatus.PENDING]: 'button.swapping',
    [DexExchangeStatus.CONFIRMING]: 'button.swapping',
    [DexExchangeStatus.SUCCESS]: 'button.success',
    [DexExchangeStatus.ERROR]: 'button.swap',
  };

  const effectiveChainKind = chainKind || ChainKind.EVM;
  const statusMessage = dexExchangeStatusMessages[status];

  if (typeof statusMessage === 'object') {
    return t(statusMessage[effectiveChainKind] ?? 'button.swap');
  }
  return t(statusMessage ?? 'button.swap');
};
