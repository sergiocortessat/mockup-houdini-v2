import { type Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { headers } from 'next/headers';

import { BASE_URLS } from '@/constants/urls';
import { PaymentGeneratorPanel } from '@/features/payment-link/components/payment-generator-panel';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata.paymentLinkGenerator');

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${BASE_URLS.APP}/payment-link`,
      images: [
        {
          url: `${BASE_URLS.APP}/assets/og-images/partnerships.webp`, // TODO: add payment link generator image
        },
      ],
    },
    alternates: {
      canonical: `${BASE_URLS.APP}/payment-link`,
    },
  };
}

export default async function PaymentLinkPage() {
  const headersList = await headers();
  const basePath = headersList.get('host');

  return (
    <div className="flex flex-col items-center justify-center pt-16">
      <PaymentGeneratorPanel basePath={basePath} />
    </div>
  );
}
