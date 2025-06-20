export const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

const HYDRATION_ERROR_MESSAGES = [
  // Ignore React hydration errors
  'Hydration failed because the initial UI does not match what was rendered on the server',
  'There was an error while hydrating',
  'There was an error while hydrating but React was able to recover by instead client rendering the entire root.',
  'Hydration completed but contains mismatches',
  'Text content does not match server-rendered HTML',
];

export default function createSentryConfig(options?: {
  side: 'frontend' | 'ssr';
  additionalConfig?: Record<string, any>;
}) {
  return {
    environment: process.env.NEXT_APP_NODE_ENV,
    dsn: SENTRY_DSN,
    tracesSampleRate: 0.5,
    debug: false,
    ignoreErrors: HYDRATION_ERROR_MESSAGES,
    maxValueLength: 10000,
    maxBreadcrumbs: 100,
    beforeSend(event: any) {
      if (process.env.NEXT_APP_NODE_ENV === 'production') {
        const errorMessage = event?.exception?.values?.[0]?.value;
        if (
          errorMessage?.includes('hydrat') ||
          errorMessage?.includes('server-rendered')
        ) {
          return null;
        }
      }
      return event;
    },
    ...options?.additionalConfig,
  };
}
