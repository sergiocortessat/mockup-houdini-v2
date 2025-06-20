import '@mysten/dapp-kit/dist/index.css';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages, getTranslations } from 'next-intl/server';
import { headers } from 'next/headers';
import Script from 'next/script';
import NextTopLoader from 'nextjs-toploader';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import { inter } from '@/app/fonts';
import '@/app/globals.css';
import { Header } from '@/components/layout/header';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { BASE_URLS } from '@/constants/urls';
import { AllWalletProvider } from '@/providers/all-wallet-provider';
import { ApolloProviderWrapper } from '@/providers/apollo-provider';
import UserWalletsProvider from '@/providers/user-wallets-provider';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata.global');

  return {
    metadataBase: new URL(BASE_URLS.SITE),
    alternates: {
      canonical: '/',
    },
    title: {
      absolute: t('title'),
      template: '%s',
    },
    description: t('description'),
    openGraph: {
      type: 'website',
      siteName: 'Houdini Swap',
      locale: 'en_GB',
      title: {
        absolute: t('title'),
        template: '%s',
      },
      description: t('description'),
      images: {
        url: `${BASE_URLS.SITE}/assets/og-images/main.webp`,
        alt: 'Houdini Swap',
        width: 1200,
        height: 630,
      },
    },
  };
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersData = await headers();
  const cookies = headersData.get('cookie');
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <Script id="addressable-pixel" strategy="beforeInteractive">
          {`
            !function(w, d){
                w.__adrsbl = {
                    queue: [],
                    run: function(){
                        this.queue.push(arguments);
                    }
                };
                var s = d.createElement('script');
                s.async = true;
                s.src = 'https://tag.adrsbl.io/p.js?tid=14c16f293fda4d22a53aa5ad7ea515fc';
                var b = d.getElementsByTagName('script')[0];
                b.parentNode.insertBefore(s, b);
            }(window, document);
          `}
        </Script>
        {/* X Pixel */}
        <Script id="x-pixel" strategy="afterInteractive">
          {`
            !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);},s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a));
            twq('config','pwfzc');
          `}
        </Script>
      </head>
      <body className={`${inter.variable} antialiased`}>
        <NextTopLoader showSpinner={false} color="var(--primary)" />

        <NextIntlClientProvider messages={messages}>
          <ApolloProviderWrapper>
            <AllWalletProvider cookies={cookies}>
              <UserWalletsProvider>
                <NuqsAdapter>
                  <TooltipProvider delayDuration={0}>
                    <Header />
                    {children}
                  </TooltipProvider>
                </NuqsAdapter>
                <Toaster />
              </UserWalletsProvider>
            </AllWalletProvider>
          </ApolloProviderWrapper>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
