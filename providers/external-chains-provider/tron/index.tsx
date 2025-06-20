'use client';

import { WalletProvider } from '@tronweb3/tronwallet-adapter-react-hooks';
import {
  BybitWalletAdapter,
  FoxWalletAdapter,
  GateWalletAdapter,
  ImTokenAdapter,
  LedgerAdapter,
  OkxWalletAdapter,
  TokenPocketAdapter,
  TronLinkAdapter,
  TrustAdapter,
} from '@tronweb3/tronwallet-adapters';
import { ReactNode } from 'react';
import { useMemo } from 'react';

export const TronProvider = ({ children }: { children: ReactNode }) => {
  const tronAdapters = useMemo(() => {
    if (typeof window !== 'undefined') {
      return [
        new TronLinkAdapter(),
        new TrustAdapter(),
        new BybitWalletAdapter(),
        new LedgerAdapter(),
        new OkxWalletAdapter(),
        new ImTokenAdapter(),
        new TokenPocketAdapter(),
        new GateWalletAdapter(),
        new FoxWalletAdapter(),
      ];
    }
    return [];
  }, []);

  return (
    <WalletProvider adapters={tronAdapters} autoConnect={false}>
      {children}
    </WalletProvider>
  );
};
