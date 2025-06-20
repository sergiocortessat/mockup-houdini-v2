'use client';

import { motion, useAnimation } from 'framer-motion';
import { ArrowUpDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { useSwapUrlParams } from '@/features/swap/hooks/use-swap-url-params';
import {
  useJustSwitchedStore,
  useMultiSwapStore,
  useRoutesStore,
  useSelectedRouteStore,
} from '@/features/swap/stores/use-swap-store';
import { Token } from '@/graphql/generated';

interface SwitchSwapButtonProps {
  tokenInData: Token | null | undefined;
  tokenOutData: Token | null | undefined;
  amountOut: string;
  setAmountInChanged: (amount: string) => void;
}

export function SwitchSwapButton({
  tokenInData,
  tokenOutData,
  amountOut,
  setAmountInChanged,
}: SwitchSwapButtonProps) {
  const t = useTranslations('swap.button');
  const controls = useAnimation();
  const swaps = useMultiSwapStore((state) => state.swaps);
  const isDisabled = swaps.length > 0;
  const resetRoutes = useRoutesStore((state) => state.resetFilters);
  const resetSelectedRoute = useSelectedRouteStore(
    (state) => state.resetSelectedRoute
  );
  const { setSwapParams } = useSwapUrlParams();
  const setJustSwitched = useJustSwitchedStore(
    (state) => state.setJustSwitched
  );

  const handleClick = async () => {
    if (isDisabled) return;
    setJustSwitched(true);

    if (Number(amountOut) > 0) {
      setSwapParams({
        tokenIn: tokenOutData?.cexTokenId ?? '',
        tokenOut: tokenInData?.cexTokenId ?? '',
        amount: Number(amountOut),
      });
    } else {
      setSwapParams({
        tokenIn: tokenOutData?.cexTokenId ?? '',
        tokenOut: tokenInData?.cexTokenId ?? '',
      });
    }

    resetRoutes();
    resetSelectedRoute();
    await controls.start({
      rotate: 180,
      transition: { duration: 0.3 },
    });
    await controls.set({ rotate: 0 });
  };

  return (
    <div className="relative z-10 flex justify-center">
      <div className="border-card absolute top-1/2 flex -translate-y-1/2 justify-center rounded-full border-8">
        <motion.div
          whileHover={!isDisabled ? { scale: 1.05 } : undefined}
          whileTap={!isDisabled ? { scale: 0.95 } : undefined}
        >
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 rounded-full disabled:opacity-75"
            onClick={handleClick}
            aria-label={t('switchTokens')}
            disabled={isDisabled}
          >
            <motion.div initial={false} animate={controls}>
              <ArrowUpDown className="scale-0.5" />
            </motion.div>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
