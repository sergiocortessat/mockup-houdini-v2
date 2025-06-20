import { type Metadata, ResolvingMetadata } from 'next';
import { getTranslations } from 'next-intl/server';

import FluidCursor from '@/components/ui/fluid-cursor';
import SwapPageClient from '@/features/swap/components/swap-page-client';
import { DEFAULT_SWAP_PARAMS } from '@/features/swap/constants';

export async function generateMetadata(
  props: any,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const searchParams = await props.searchParams;

  const tokenIn = searchParams?.tokenIn || DEFAULT_SWAP_PARAMS.tokenIn;
  const tokenOut = searchParams?.tokenOut || DEFAULT_SWAP_PARAMS.tokenOut;
  const anonymous = searchParams?.anonymous || null;

  const meta = await parent;
  let canonicalPath = '/';

  const t = await getTranslations('metadata.home');

  let metadata: { title: string; description: string };

  if (tokenIn && tokenOut) {
    canonicalPath = `/?tokenIn=${tokenIn}&tokenOut=${tokenOut}`;
    if (anonymous === 'true') {
      canonicalPath += '&anonymous=true';
      metadata = {
        title: t('swap.anonymous.title', { tokenIn, tokenOut }),
        description: t('swap.anonymous.description', { tokenIn, tokenOut }),
      };
    } else if (tokenOut === 'LOCK') {
      metadata = {
        title: t('swap.lock.title', { tokenIn }),
        description: t('swap.lock.description', { tokenIn }),
      };
    } else {
      metadata = {
        title: t('swap.default.title', { tokenIn, tokenOut }),
        description: t('swap.default.description', { tokenIn, tokenOut }),
      };
    }
  } else {
    metadata = {
      title: t('default.title'),
      description: t('default.description'),
    };
  }

  return {
    alternates: {
      canonical: canonicalPath,
    },
    title: {
      absolute: metadata.title,
    },
    description: metadata.description,
    openGraph: {
      ...(meta.openGraph as Metadata['openGraph']),
      title: {
        absolute: metadata.title,
      },
      description: metadata.description,
    },
  };
}

export default function SwapPage() {
  return (
    <>
      <SwapPageClient />
      <FluidCursor />
    </>
  );
}
