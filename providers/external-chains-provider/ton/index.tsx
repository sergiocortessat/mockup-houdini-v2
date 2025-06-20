'use client';

import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { ReactNode } from 'react';

const TonProvider = ({ children }: { children: ReactNode }) => {
  return (
    <TonConnectUIProvider manifestUrl="https://v4.houdiniswap.com/tonconnect-manifest.json">
      {children}
    </TonConnectUIProvider>
  );
};

export default TonProvider;
