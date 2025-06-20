import { type Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import { BASE_URLS } from '@/constants/urls';
import BuyToken from '@/features/analytics/sections/buy-token';
import History from '@/features/analytics/sections/history';
import HoudiniSwapPerformance from '@/features/analytics/sections/houdini-swap-performance';
import Stats from '@/features/analytics/sections/stats';
import WeekBreakdown from '@/features/analytics/sections/week-breakdown';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata.analytics');

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${BASE_URLS.APP}/analytics`,
      images: [
        {
          url: `${BASE_URLS.APP}/assets/og-images/partnerships.webp`,
        },
      ],
    },
    alternates: {
      canonical: `${BASE_URLS.APP}/analytics`,
    },
  };
}

export default function AnalyticsPage() {
  const t = useTranslations('analytics');
  return (
    <main className="container mx-auto space-y-8 px-4 py-8">
      <h1 className="text-display-xxs">{t('performanceData')}</h1>
      <div className="space-y-3">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <Stats />
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <BuyToken />

          <WeekBreakdown />
        </div>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <div className="col-span-1">
            <HoudiniSwapPerformance />
          </div>
          <div className="col-span-1">
            <History />
          </div>
        </div>
      </div>
    </main>
  );
}
