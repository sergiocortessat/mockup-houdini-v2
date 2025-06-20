'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Cell, Pie, PieChart } from 'recharts';
import { ResponsiveContainer } from 'recharts';

import { Card } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import BreakdownItem from '@/features/analytics/components/breakdown-item';
import { CHART_COLORS } from '@/features/analytics/constants';
import { useScaffoldReadContract } from '@/features/analytics/hooks/scaffold-eth';

const WeekBreakdown = () => {
  const t = useTranslations('analytics');

  const [poolApy, setPoolApy] = useState(0n);

  const [pool, setPool] = useState<{
    fallenWizardFunds: bigint;
    totalRewardFunds: bigint;
  }>();

  const { data: poolData } = useScaffoldReadContract({
    contractName: 'Staker',
    functionName: 'pool',
  } as any);

  useEffect(() => {
    if (poolData) {
      const poolDataArr = poolData as any;
      setPool(poolDataArr[0]);
      setPoolApy(poolDataArr[4]);
    }
  }, [poolData]);

  // Calculate APY percentages
  const fallenWizardApyPercent = pool?.totalRewardFunds
    ? parseFloat(
        (
          Number(
            pool
              ? (pool?.fallenWizardFunds * 10000n) / pool?.totalRewardFunds
              : 0n
          ) / 100
        ).toFixed(4)
      )
    : 0;

  const buybackApyPercent = 100 - fallenWizardApyPercent;

  const poolApyPercent = Number(poolApy) > 0 ? Number(poolApy) : 0;

  // Prepare data for the donut chart
  const apyData = [
    {
      name: t('poolAPY'),
      value: poolApyPercent,
      color: CHART_COLORS.pool,
    },
    {
      name: t('buyback'),
      value: buybackApyPercent,
      color: CHART_COLORS.buyback,
    },
    {
      name: t('fallenWizards'),
      value: fallenWizardApyPercent,
      color: CHART_COLORS.fallenWizards,
    },
  ];

  const apyChartConfig = {
    value: {
      label: 'APY',
      color: CHART_COLORS.buyback,
    },
  };

  return (
    <Card className="max-w-full border p-6">
      <h3 className="text-heading-sm">{t('lastWeekAPYBreakdown')}</h3>
      <div className="flex h-full w-full translate-x-[-50px] items-center justify-center">
        <div className="w-[260px]">
          <ChartContainer config={apyChartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={apyData}
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={0}
                  dataKey="value"
                  stroke="none"
                >
                  {apyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        <div className="flex flex-1 flex-col items-start space-y-4">
          <BreakdownItem
            title="poolAPY"
            value={`${poolApyPercent.toFixed(2)}%`}
            color={CHART_COLORS.pool}
            hasTooltip={true}
            tooltipText={'poolAPYTooltip'}
          />
          <BreakdownItem
            title="buyback"
            value={`${buybackApyPercent.toFixed(2)}%`}
            color={CHART_COLORS.buyback}
            hasTooltip={true}
            tooltipText="buybackTooltip"
          />
          <BreakdownItem
            title="fallenWizards"
            value={`${fallenWizardApyPercent.toFixed(2)}%`}
            color={CHART_COLORS.fallenWizards}
            hasTooltip={true}
            tooltipText="fallenWizardsTooltip"
          />
        </div>
      </div>
    </Card>
  );
};

export default WeekBreakdown;
