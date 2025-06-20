'use client';

import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { WizardSwitch } from '@/components/ui/wizard-switch';
import fluidCursor from '@/hooks/use-fluid-cursor';
import useLocalStorage from '@/hooks/use-local-storage';
import { useMediaQuery } from '@/hooks/use-media-query';

const FLUID_CURSOR_DISABLED_KEY = 'fluidCursorDisabled';

const FluidCursor = () => {
  const t = useTranslations('common');
  const isDesktop = useMediaQuery('(min-width: 992px)');

  // User preference: false = enabled, true = disabled
  const [isCursorDisabled, setCursorDisabled] = useLocalStorage<boolean>(
    FLUID_CURSOR_DISABLED_KEY,
    false
  );

  const isFluidCursorEnabled = isDesktop && !isCursorDisabled;

  useEffect(() => {
    if (isFluidCursorEnabled) {
      fluidCursor();
    }
  }, [isFluidCursorEnabled]);

  return (
    <>
      {isDesktop && (
        <div className="fixed right-4 bottom-4 z-50 flex items-center gap-2 rounded-lg px-3 py-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="flex items-center justify-center">
                <WizardSwitch
                  checked={!isCursorDisabled}
                  onCheckedChange={(checked) => setCursorDisabled(!checked)}
                  aria-label="Toggle fluid cursor"
                />
              </span>
            </TooltipTrigger>
            <TooltipContent side="top">
              {t('toggleCursorEffect')}
            </TooltipContent>
          </Tooltip>
        </div>
      )}
      {isFluidCursorEnabled ? (
        <div className="fixed top-0 left-0 z-[-1]">
          <canvas id="fluid" className="h-screen w-screen" />
        </div>
      ) : null}
    </>
  );
};

export default FluidCursor;
