import { type Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { BASE_URLS } from '@/constants/urls';
import GetApiAccess from '@/features/get-api-access/components/get-api-access';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata.getApiAccess');

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${BASE_URLS.APP}/get-api-access`,
      images: [
        {
          url: `${BASE_URLS.APP}/assets/og-images/partnerships.webp`,
        },
      ],
    },
    alternates: {
      canonical: `${BASE_URLS.APP}/get-api-access`,
    },
  };
}

export default function Page() {
  return <GetApiAccess />;
}
