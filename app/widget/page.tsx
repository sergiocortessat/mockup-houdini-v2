import { type Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { BASE_URLS } from '@/constants/urls';
import Widget from '@/features/widget/components';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata.widget');

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${BASE_URLS.APP}/widget`,
      images: [
        {
          url: `${BASE_URLS.APP}/assets/og-images/partnerships.webp`,
        },
      ],
    },
    alternates: {
      canonical: `${BASE_URLS.APP}/widget`,
    },
  };
}

export default function WidgetPage() {
  return (
    <main className="flex min-h-screen items-center justify-center gap-5 pt-5">
      <Widget />
    </main>
  );
}
