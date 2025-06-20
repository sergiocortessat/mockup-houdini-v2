import * as Sentry from '@sentry/nextjs';
import type { NextRequest } from 'next/server';

export const onRequestError = (error: Error, request: NextRequest) => {
  Sentry.captureException(error);
};

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}
