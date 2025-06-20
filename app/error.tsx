'use client';

import * as Sentry from '@sentry/nextjs';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('common.errors');
  useEffect(() => {
    // Log the error to Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center">
      <h2 className="mb-4 text-2xl font-bold">{t('somethingWentWrong')}</h2>
      <button
        onClick={() => reset()}
        className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        {t('tryAgain')}
      </button>
    </div>
  );
}
