'use client';

import { useQuery } from '@apollo/client';
import { ChartLine, Coins, DollarSign, Eye } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { formatUnits } from 'viem';

import { StatsCard } from '@/features/analytics/components/stats-card';
import {
  useScaffoldContract,
  useScaffoldReadContract,
} from '@/features/analytics/hooks/scaffold-eth';
import { StatCardData } from '@/features/analytics/types';
import { usePriceUsdQuery } from '@/graphql/generated';

const formatter = Intl.NumberFormat('en', { notation: 'compact' });

const Stats = () => {
  const t = useTranslations('analytics');
  const [rewardsPaid, setRewardsPaid] = useState(0n);
  const [tvl, setTvl] = useState(0);

  const { data: stakerContract } = useScaffoldContract({
    contractName: 'Staker',
  });

  const { data: poolData } = useScaffoldReadContract({
    contractName: 'Staker',
    functionName: 'pool',
  } as any);

  const { data: tokensLocked } = useScaffoldReadContract({
    contractName: 'Houdini',
    functionName: 'balanceOf',
    args: [stakerContract?.address],
  } as any);

  const { data: priceUsd, loading: loadingPrice } = usePriceUsdQuery();

  const { data: tokenSupply } = useScaffoldReadContract({
    contractName: 'Houdini',
    functionName: 'totalSupply',
  } as any);

  useEffect(() => {
    setTvl(
      (priceUsd?.priceUsd ?? 0) *
        parseFloat(formatUnits((tokensLocked as any) ?? 0n, 18))
    );
  }, [priceUsd, tokensLocked]);

  useEffect(() => {
    if (poolData) {
      const poolDataArr = poolData as any;
      setRewardsPaid(poolDataArr[6]);
    }
  }, [poolData]);

  const statsData: StatCardData[] = [
    {
      title: t('totalStaked'),
      value: formatter.format(
        Math.round(parseFloat(formatUnits((tokensLocked as any) ?? 0n, 18)))
      ),
      icon: <ChartLine width={14} height={14} />,
      token: {
        symbol: '$LOCK',
        icon: (
          <Image
            src="./houdini-logo.svg"
            alt="Houdini Logo"
            width={18}
            height={18}
          />
        ),
      },
    },
    {
      title: t('percentOfSupply'),
      value: tokenSupply
        ? (
            (parseFloat(formatUnits((tokensLocked as any) ?? 0n, 18)) * 100) /
            parseFloat(
              formatUnits((tokenSupply as unknown as bigint) ?? 0n, 18)
            )
          ).toFixed(2) + '%'
        : '0%',
      icon: <Eye width={14} height={14} />,
      token: {
        symbol: '$LOCK',
        icon: (
          <Image
            src="./houdini-logo.svg"
            alt="Houdini Logo"
            width={18}
            height={18}
          />
        ),
      },
    },
    {
      title: t('totalTVL'),
      value: `$${tvl ? formatter.format(Math.round(tvl)) : 0}`,
      icon: <Coins width={14} height={14} />,
      token: {
        symbol: '$USD',
        icon: (
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500 p-1">
            <DollarSign size={16} />
          </div>
        ),
      },
    },
    {
      title: t('totalRewardsPaid'),
      value: formatter.format(
        Math.round(parseFloat(formatUnits(rewardsPaid, 18)))
      ),
      icon: <ChartLine width={14} height={14} />,
      token: {
        symbol: '$LOCK',
        icon: (
          <Image
            src="./houdini-logo.svg"
            alt="Houdini Logo"
            width={18}
            height={18}
          />
        ),
      },
    },
  ];

  return (
    <>
      {statsData.map((stat, index) => (
        <StatsCard key={index} data={stat} />
      ))}
    </>
  );
};

export default Stats;
