'use client';

import { useDeferredValue, useEffect, useRef, useState } from 'react';
import { NumericFormat } from 'react-number-format';

import { ModalTokenSelect } from '@/features/swap/components/modal-token-select';
import { SwapInputSelectTokenButton } from '@/features/swap/components/swap-input/swap-input-select-token-button';
import SwapInputWalletButtons from '@/features/swap/components/swap-input/swap-input-wallet-buttons';
import {
  useMultiSwapStore,
  useRoutesStore,
  useSelectedRouteStore,
  useSwapLoadingStore,
} from '@/features/swap/stores/use-swap-store';
import { ChainKind, SwapInputProps } from '@/features/swap/types';
import { Token } from '@/graphql/generated';
import { useAutoFontSize } from '@/hooks/use-auto-font-size';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';

export function SwapInput({
  label,
  value,
  onAmountChange,
  onTokenChange,
  token,
  className,
  usdPrice,
  isSwapTokensLoading,
  isBuyingInput,
  isPrivate,
  hideUsdPrice = false,
}: SwapInputProps) {
  const isMobile = useMediaQuery('(max-width: 480px)');
  const isAllQuoteQueryLoading = useSwapLoadingStore(
    (state) => state.isAllQuoteQueryLoading
  );
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const inputRef = useRef<any>(null);
  const swaps = useMultiSwapStore((state) => state.swaps);
  const resetSelectedRoute = useSelectedRouteStore(
    (state) => state.resetSelectedRoute
  );
  const resetRoutes = useRoutesStore((state) => state.resetRoutes);
  useEffect(() => {
    if (!isBuyingInput) {
      inputRef.current?.focus();
    }
  }, [isBuyingInput]);

  const handleTokenSelect = (selectedToken: Token) => {
    setIsTokenModalOpen(false);
    if (selectedToken.cexTokenId) {
      onTokenChange?.(selectedToken.cexTokenId);
      resetRoutes();
      resetSelectedRoute();
    }
  };

  const deferredUsdPrice = useDeferredValue(usdPrice);

  const displayValue = value === '0' ? '' : value;
  const inputWidth = isMobile ? 140 : 212;
  const { fontSize, spanRef } = useAutoFontSize(
    displayValue || '0',
    inputWidth
  );

  const isTokenSelectButtonDisabled = swaps.length > 0 || isSwapTokensLoading;

  return (
    <div
      className={cn(
        'flex min-h-[120px] flex-col justify-between rounded-xl bg-neutral-800/80 p-3 hover:bg-neutral-800 md:min-h-[136px] md:p-4',
        className
      )}
    >
      <div className="flex flex-col justify-between gap-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="swap-amount-input"
            className="text-body-sm text-muted-foreground"
          >
            {label}
          </label>
          {!isBuyingInput && (
            <SwapInputWalletButtons
              isNative={token?.mainnet === true}
              chainKind={token?.chainData?.kind as ChainKind}
              chainId={token?.chainData?.chainId}
              tokenInAddress={token?.address || ''}
            />
          )}
        </div>
        <div className="grid grid-cols-[1fr_auto] items-center gap-3">
          <NumericFormat
            id="swap-amount-input"
            aria-describedby="swap-input-error"
            className={cn(
              'font-inter text-display-xxs w-full border-none bg-transparent focus:outline-hidden',
              { 'animate-pulse': isAllQuoteQueryLoading && isBuyingInput }
            )}
            getInputRef={inputRef}
            style={{ fontSize }}
            placeholder="0"
            onChange={(e) => onAmountChange?.(e.target.value)}
            value={displayValue}
            thousandSeparator=","
            decimalSeparator="."
            allowNegative={false}
          />

          <SwapInputSelectTokenButton
            onClick={() => setIsTokenModalOpen(true)}
            token={token}
            disabled={isTokenSelectButtonDisabled}
            isLoading={isSwapTokensLoading}
            isBuyingInput={isBuyingInput}
          />
          {/* This span is used to calculate the font size */}
          <span
            ref={spanRef}
            className="invisible absolute whitespace-pre"
            style={{ fontSize, padding: 0 }}
          />
        </div>
        <div
          id="swap-input-error"
          aria-live="polite"
          className={cn('min-h-5 text-sm', {
            'animate-pulse': isAllQuoteQueryLoading && isBuyingInput,
          })}
        >
          {hideUsdPrice ? null : (
            <span className="text-muted-foreground">
              {`$${deferredUsdPrice ? deferredUsdPrice.toFixed(2) : '0'}`}
            </span>
          )}
        </div>
      </div>

      {isTokenModalOpen && (
        <ModalTokenSelect
          open={isTokenModalOpen}
          onOpenChange={setIsTokenModalOpen}
          onSelect={handleTokenSelect}
          isPrivate={isPrivate}
        />
      )}
    </div>
  );
}
