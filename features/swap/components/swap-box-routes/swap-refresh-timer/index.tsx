'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  useSelectedRouteStore,
  useSwapLoadingStore,
} from '@/features/swap/stores/use-swap-store';
import { useTabVisible } from '@/hooks/use-tab-visible';

const TIMER_DURATION_SECONDS = 60; // 60 seconds

const SwapRefreshTimer = ({
  refetchAllQuote,
}: {
  refetchAllQuote: () => void;
}) => {
  const t = useTranslations('swap.routes');
  const isAllQuoteQueryLoading = useSwapLoadingStore(
    (state) => state.isAllQuoteQueryLoading
  );
  const isSwapping = useSwapLoadingStore((state) => state.isSwapping);
  const resetSelectedRoute = useSelectedRouteStore(
    (state) => state.resetSelectedRoute
  );
  const isTabVisible = useTabVisible();

  // Timer key to force restart
  const [timerKey, setTimerKey] = useState(0);

  // Pause timer when loading or tab is not visible, resume when not loading and tab is visible
  useEffect(() => {
    if (isAllQuoteQueryLoading || !isTabVisible) return;
    // When loading finishes and tab is visible, restart timer
    setTimerKey((prev) => prev + 1);
  }, [isAllQuoteQueryLoading, isTabVisible]);

  const handleComplete = () => {
    // Only refresh if tab is visible and not loading
    if (isAllQuoteQueryLoading || !isTabVisible) return { shouldRepeat: false };
    refetchAllQuote();
    resetSelectedRoute();
    // Restart timer after refetch
    return { shouldRepeat: true, delay: 0 };
  };

  const isPlaying = !isAllQuoteQueryLoading && isTabVisible && !isSwapping;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>
            <CountdownCircleTimer
              key={timerKey}
              isPlaying={isPlaying}
              duration={TIMER_DURATION_SECONDS}
              colors={['#a955f8', '#a955f8']}
              colorsTime={[30, 0]}
              strokeWidth={0}
              size={0}
              onComplete={handleComplete}
              isSmoothColorTransition
            >
              {({ remainingTime }) => (
                <div className="text-body-xs text-muted-foreground flex items-center">
                  (
                  <span className="w-[2.3ch] text-center">{remainingTime}</span>
                  <span>s</span>)
                </div>
              )}
            </CountdownCircleTimer>
          </span>
        </TooltipTrigger>
        <TooltipContent className="w-64 text-center">
          {t('refreshTimerTooltip')}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SwapRefreshTimer;
