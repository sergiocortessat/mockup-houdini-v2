'use client';

import { useTranslations } from 'next-intl';

import TokenSwapStep from '@/features/exchange/components/token-swap-step';

interface HowToSwapProps {
  fromSymbol: string;
  toSymbol: string;
  fromName: string;
  toName: string;
}

export default function HowToSwap({
  fromSymbol,
  toSymbol,
  fromName,
  toName,
}: HowToSwapProps) {
  const t = useTranslations('exchange');

  return (
    <div className="flex flex-col items-center justify-between gap-8 p-4 text-white md:flex-row md:gap-16 md:p-8">
      <div className="flex-1 text-center md:text-left">
        <h2 className="text-display-md md:text-display-lg mb-4 font-medium">
          <span className="block">{t('howToPairSwapTitle')}</span>
          <span className="mt-2 block">
            {t('howToPairSwap', { from: fromSymbol, to: toSymbol })}
          </span>
        </h2>
        <p className="text-display-xxs md:text-display-xs text-gray-500">
          {t('howToPairSwapDescription')}
        </p>
      </div>

      <div className="flex w-full flex-1 flex-col gap-4 md:w-auto">
        <TokenSwapStep
          step={1}
          label={`${1} STEP`}
          title={t('howToPairStepOneTitle')}
          description={t('howToPairStepOneDescription', {
            fromName: fromName,
            from: fromSymbol,
          })}
        />
        <TokenSwapStep
          step={2}
          label={`${2} STEP`}
          title={t('howToPairStepTwoTitle')}
          description={t('howToPairStepTwoDescription', {
            fromName: fromName,
            from: fromSymbol,
          })}
        />
        <TokenSwapStep
          step={3}
          label={`${3} STEP`}
          title={t('howToPairStepThreeTitle')}
          description={t('howToPairStepThreeDescription', {
            from: fromSymbol,
            to: toSymbol,
          })}
        />
        <TokenSwapStep
          step={4}
          label={`${4} STEP`}
          title={t('howToPairStepFourTitle')}
          description={t('howToPairStepFourDescription', {
            to: toName,
          })}
        />
      </div>
    </div>
  );
}
