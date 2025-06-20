'use client';

import { useTranslations } from 'next-intl';

import TokenSwapStep from '@/features/exchange/components/token-swap-step';

interface WhyHoudiniProps {
  fromSymbol: string;
  toSymbol: string;
  fromName: string;
  toName: string;
}

interface WhyHoudiniStep {
  step: number;
  title: string;
  description: string;
  label: string;
}

const steps: WhyHoudiniStep[] = [
  {
    step: 1,
    title: 'whyHoudiniSwapStepOneTitle',
    description: 'whyHoudiniSwapStepOneDescription',
    label: 'whyHoudiniSwapStepOneLabel',
  },
  {
    step: 2,
    title: 'whyHoudiniSwapStepTwoTitle',
    description: 'whyHoudiniSwapStepTwoDescription',
    label: 'whyHoudiniSwapStepTwoLabel',
  },
  {
    step: 3,
    title: 'whyHoudiniSwapStepThreeTitle',
    description: 'whyHoudiniSwapStepThreeDescription',
    label: 'whyHoudiniSwapStepThreeLabel',
  },
  {
    step: 4,
    title: 'whyHoudiniSwapStepFourTitle',
    description: 'whyHoudiniSwapStepFourDescription',
    label: 'whyHoudiniSwapStepFourLabel',
  },
];

export default function WhyHoudini({ fromSymbol, toSymbol }: WhyHoudiniProps) {
  const t = useTranslations('exchange');

  return (
    <div className="flex flex-col items-start justify-between gap-8 p-4 text-white md:flex-row md:gap-16 md:p-8">
      <div className="flex-1 text-center md:text-left">
        <h2 className="text-display-sm md:text-display-lg mb-4 font-medium">
          {t('whyHoudiniSwapTitle')}
        </h2>
        <p className="text-display-xxs md:text-display-xs text-gray-500">
          {t('whyHoudiniSwapDescription')}
        </p>
      </div>

      <div className="flex w-full flex-1 flex-col gap-4 md:w-auto">
        {steps.map((step) => (
          <TokenSwapStep
            key={step.step}
            step={step.step}
            title={t(step.title)}
            description={t(step.description)}
            label={t(step.label)}
          />
        ))}
      </div>
    </div>
  );
}
