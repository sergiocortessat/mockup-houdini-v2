import { type Metadata, ResolvingMetadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata as MetadataRoot } from 'next/types';

import { BASE_URLS } from '@/constants/urls';
import ExchangePageContent from '@/features/exchange/components/exchange-page-content';
import { EXCHANGE_TOKEN_PAIRS_SEO } from '@/features/exchange/constants';
import { fetchExchangePageData } from '@/features/exchange/graphql/server-queries';

type ExchangePairPageProps = {
  params: Promise<{
    from: string;
    to: string;
  }>;
};

export async function generateMetadata(
  { params }: ExchangePairPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { from, to } = await params;
  const fromSymbol = from.toUpperCase();
  const toSymbol = to.toUpperCase();

  // Get the parent metadata to access default OG image
  const parentMetadata = await parent;
  const t = await getTranslations('metadata.exchange');

  return {
    title: t('title', { from: fromSymbol, to: toSymbol }),
    alternates: {
      canonical: `${BASE_URLS.APP}/exchange/${from}/${to}`,
    },
    description: t('description', { from: fromSymbol, to: toSymbol }),
    keywords: [
      `${fromSymbol}`,
      `${toSymbol}`,
      'swap',
      'exchange',
      'crypto',
      'private',
      'no KYC',
    ],
    openGraph: {
      ...(parentMetadata.openGraph as MetadataRoot['openGraph']),
      title: t('title', { from: fromSymbol, to: toSymbol }),
      description: t('description', { from: fromSymbol, to: toSymbol }),
    },
    twitter: {
      ...(parentMetadata.twitter as MetadataRoot['twitter']),
      title: t('title', { from: fromSymbol, to: toSymbol }),
      description: t('description', { from: fromSymbol, to: toSymbol }),
    },
  };
}

export async function generateStaticParams() {
  // Define token pairs manually for ISR (both directions),
  return EXCHANGE_TOKEN_PAIRS_SEO;
}

export const revalidate = 1; // Revalidate every second to get the latest data

export default async function ExchangePairPage({
  params,
}: ExchangePairPageProps) {
  const { from, to } = await params;

  try {
    const { fromToken, toToken, pairs } = await fetchExchangePageData(from, to);

    return (
      <ExchangePageContent
        fromToken={fromToken}
        toToken={toToken}
        pairs={pairs}
      />
    );
  } catch (error) {
    // redirect to 404
    notFound();
  }
}
