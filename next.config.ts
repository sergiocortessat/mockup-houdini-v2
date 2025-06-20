//import { withSentryConfig } from '@sentry/nextjs';
import createNextIntlPlugin from 'next-intl/plugin';
import type { RemotePattern } from 'next/dist/shared/lib/image-config';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  webpack: (config: any) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https' as const,
        hostname: 'api-refactor.houdiniswap.xyz',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https' as const,
        hostname: 'api-refactor.houdiniswap.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https' as const,
        hostname: 'api.houdiniswap.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https' as const,
        hostname: 'assets.coingecko.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'http' as const,
        hostname: '127.0.0.1',
        port: '3000',
        pathname: '**',
      },
      {
        protocol: 'http' as const,
        hostname: 'localhost',
        port: '3000',
        pathname: '**',
      }
    ] satisfies RemotePattern[],
  },
  compiler: {
    removeConsole:
      process.env.NEXT_APP_NODE_ENV === 'production'
        ? {
            exclude: ['error', 'warn', 'info'],
          }
        : false,
  },
};

module.exports = withNextIntl(nextConfig);


const { withSentryConfig } = require('@sentry/nextjs')

module.exports = withSentryConfig(module.exports, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: 'houdiniswap',
  project: 'houdiniswap',
  sentryUrl: 'https://api6.houdiniswap.com/',

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Automatically annotate React components to show their full name in breadcrumbs and session replay
  reactComponentAnnotation: {
    enabled: true,
  },

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: '/monitoring',

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
})

