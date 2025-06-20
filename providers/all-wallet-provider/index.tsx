'use client';

import dynamic from 'next/dynamic';

import { SuiProvider } from '@/providers/external-chains-provider/sui';
import { TronProvider } from '@/providers/external-chains-provider/tron';
import { ReownWalletProvider } from '@/providers/reown-wallet-provider';

// MEMO: it has to be no ssr. if we use ssr, we will lost ton modal in DOM.
const TonProvider = dynamic(
  () => import('../external-chains-provider/ton').then((mod) => mod.default),
  {
    ssr: false,
  }
);

export const AllWalletProvider = ({
  children,
  cookies,
}: {
  children: React.ReactNode;
  cookies: string | null;
}) => {
  return (
    <ReownWalletProvider cookies={cookies}>
      <TronProvider>
        <SuiProvider>
          <TonProvider>{children}</TonProvider>
        </SuiProvider>
      </TronProvider>
    </ReownWalletProvider>
  );
};
