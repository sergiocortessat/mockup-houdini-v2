'use client';

import { useQuery } from '@apollo/client';
import Humanize from 'humanize-plus';
import { Info } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import PerformanceCard from '@/features/analytics/components/performance-card';
import { TIME_PERIOD } from '@/features/analytics/constants';
import { TotalVolume } from '@/graphql/generated';
import { usePerformanceStatsQuery } from '@/graphql/generated';

const HoudiniSwapPerformance = () => {
  const t = useTranslations('analytics');
  const { data, loading } = usePerformanceStatsQuery();
  console.log('data', data);
  const [totalVolume, setTotalVolume] = useState<TotalVolume | undefined>();
  const [lastMonthVolume, setLastMonthVolume] = useState<
    TotalVolume | undefined
  >();
  const [lastWeekVolume, setLastWeekVolume] = useState<
    TotalVolume | undefined
  >();

  useEffect(() => {
    if (!loading && data) {
      setTotalVolume(data?.totalVolume ?? undefined);
      setLastMonthVolume(data?.lastMonth ?? undefined);
      setLastWeekVolume(data?.lastWeek ?? undefined);
    }
  }, [loading, data]);
  const [selectedPeriod, setSelectedPeriod] = useState<TIME_PERIOD>(
    TIME_PERIOD.Weekly
  );

  const performanceCards = [
    {
      title: t('totalVolume'),
      value: loading
        ? '0'
        : (Humanize.formatNumber(totalVolume?.totalTransactedUSD ?? 0) ?? '0'),
    },
    {
      title: t('periodVolume', { period: selectedPeriod }),
      value: loading
        ? '0'
        : (Humanize.formatNumber(
            selectedPeriod === TIME_PERIOD.Weekly
              ? (lastWeekVolume?.totalTransactedUSD ?? 0)
              : (lastMonthVolume?.totalTransactedUSD ?? 0)
          ) ?? '0'),
    },
    {
      title: t('totalBuybacks'),
      value: loading
        ? '0'
        : (Humanize.formatNumber(totalVolume?.totalBuybackUSD ?? 0) ?? '0'),
    },
    {
      title: t('periodBuybacks', { period: selectedPeriod }),
      value: loading
        ? '0'
        : (Humanize.formatNumber(
            selectedPeriod === TIME_PERIOD.Weekly
              ? (lastWeekVolume?.totalBuybackUSD ?? 0)
              : (lastMonthVolume?.totalBuybackUSD ?? 0)
          ) ?? '0'),
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="h-full max-w-full space-y-6 border p-6">
        <Tabs
          defaultValue={TIME_PERIOD.Weekly}
          className="h-full items-end space-y-6 bg-transparent"
          onValueChange={(value) => setSelectedPeriod(value as TIME_PERIOD)}
        >
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-heading-sm">{t('houdiniSwapPerformance')}</h3>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-2 text-neutral-500 hover:text-neutral-300"
                  >
                    <Info size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {t('houdiniSwapPerformanceTooltip')}
                </TooltipContent>
              </Tooltip>
            </div>
            <TabsList className="grid h-auto grid-cols-2 rounded-full border border-neutral-800 bg-transparent">
              <TabsTrigger
                value={TIME_PERIOD.Weekly}
                className="px-5 data-[state=active]:rounded-full data-[state=active]:bg-neutral-800"
              >
                {t('weekly')}
              </TabsTrigger>
              <TabsTrigger
                value={TIME_PERIOD.Monthly}
                className="px-5 data-[state=active]:rounded-full data-[state=active]:bg-neutral-800"
              >
                {t('monthly')}
              </TabsTrigger>
            </TabsList>
          </div>

          {Object.values(TIME_PERIOD).map((period) => (
            <TabsContent
              key={period}
              value={period}
              className="mb-0 flex w-full flex-col justify-end space-y-6"
            >
              <div className="grid grid-cols-2 gap-4">
                {performanceCards.map((card) => (
                  <PerformanceCard
                    key={card.title}
                    title={card.title}
                    value={card.value}
                  />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </Card>
    </div>
  );
};

export default HoudiniSwapPerformance;
