import * as Sentry from '@sentry/nextjs';

import { SENTRY_DSN } from '@/lib/sentry-config';

console.log('Sentry initialization started');

// This export will instrument router navigations. `captureRouterTransitionStart` is available from SDK version 9.12.0 onwards - upgrade if necessary!
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
Sentry.init({
  dsn: SENTRY_DSN,
  // Replay may only be enabled for the client-side
  integrations: [
    Sentry.replayIntegration({
      maskAllText: false,
      maskAllInputs: false,
    }),
    Sentry.captureConsoleIntegration({
      levels: ['error', 'warn'],
    }),
  ],
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for tracing.
  // We recommend adjusting this value in production
  // Learn more at
  // https://docs.sentry.io/platforms/javascript/configuration/options/#traces-sample-rate
  tracesSampleRate: 1.0,
  // Capture Replay for 10% of all sessions,
  // plus for 100% of sessions with an error
  // Learn more at
  // https://docs.sentry.io/platforms/javascript/session-replay/configuration/#general-integration-configuration
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
});

Sentry.setTag('side', 'frontend');
Sentry.setTag('appVersion', '4');
