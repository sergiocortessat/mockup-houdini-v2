'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { HeaderSearchInput } from '@/components/layout/header-search-input';
import { Navigation } from '@/components/layout/navigation';
import { HamburgerMenu } from '@/components/ui/hamburger-menu';
import { ROUTES } from '@/constants/urls';
import WalletConnectButton from '@/features/wallet/components/wallet-connect-button';
import { WalletNetworkDropdown } from '@/features/wallet/components/wallet-network-dropdown';

export function Header() {
  const pathname = usePathname();
  const noHeaderPages = ['/widget'];
  const showHeader = !noHeaderPages.some((page) => pathname.startsWith(page));

  if (!showHeader) return null;

  const logo = (
    <Image src="/hs-main-logo.svg" alt="Logo" width={94} height={32} />
  );

  return (
    <header className="h-header bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur-sm">
      <div className="flex h-full items-center justify-between px-4 md:px-10">
        <div className="flex h-full items-center gap-10">
          <Link
            href={ROUTES.HOME}
            className="shrink-0"
            aria-label="Go to home page"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = ROUTES.HOME;
            }}
          >
            {logo}
          </Link>
          <div className="hidden h-full lg:block">
            <Navigation />
          </div>
        </div>
        <div className="flex min-h-[142px] items-center space-x-2">
          <HeaderSearchInput />
          <WalletNetworkDropdown />
          <WalletConnectButton />
          <HamburgerMenu />
        </div>
      </div>
    </header>
  );
}
