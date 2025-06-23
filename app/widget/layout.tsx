import '@mysten/dapp-kit/dist/index.css';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { headers } from 'next/headers';
import NextTopLoader from 'nextjs-toploader';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import { inter } from '@/app/fonts';
import '@/app/globals.css';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AllWalletProvider } from '@/providers/all-wallet-provider';
import { ApolloProviderWrapper } from '@/providers/apollo-provider';
import UserWalletsProvider from '@/providers/user-wallets-provider';

export const metadata: Metadata = {
  title: 'Houdini Widget',
  description: 'Houdini Swap Widget',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function WidgetLayout({
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
      <body className={`${inter.variable} antialiased`}>
        <NextTopLoader showSpinner={false} color="var(--primary)" />

        <NextIntlClientProvider messages={messages}>
          <ApolloProviderWrapper>
            <AllWalletProvider cookies={cookies}>
              <UserWalletsProvider>
                <NuqsAdapter>
                  <TooltipProvider delayDuration={0}>
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
