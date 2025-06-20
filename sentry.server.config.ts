// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
import * as Sentry from '@sentry/nextjs';

import createSentryConfig from '@/lib/sentry-config';

Sentry.init(
  createSentryConfig({
    side: 'ssr',
  })
);

Sentry.setTag('side', 'ssr');
Sentry.setTag('appVersion', '4');
