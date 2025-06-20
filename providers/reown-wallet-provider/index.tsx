'use client';

import {
  bevmMainnet,
  bitgert,
  bitlayer,
  blast,
  bob,
  bounceBit,
  coreDao,
  cronos,
  gnosis,
  gravity,
  hychain,
  kava,
  linea,
  lumiaMainnet,
  mainnet,
  manta,
  merlin,
  mode,
  morph,
  okc,
  opBNB,
  pulsechain,
  rootstock,
  scroll,
  sonic,
  taiko,
  telos,
  theta,
  tron,
  wanchain,
  worldchain,
  zetachain,
  zkLinkNova,
} from '@reown/appkit/networks';
import { createAppKit } from '@reown/appkit/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode } from 'react';
import { type Config, WagmiProvider, cookieToInitialState } from 'wagmi';

import {
  bitcoinAdapter,
  solanaAdapter,
  wagmiAdapter,
} from '@/providers/reown-wallet-provider/reown-wallet-provider-config';
import { networks } from '@/providers/reown-wallet-provider/reown-wallet-provider-networks';

const queryClient = new QueryClient();

const metadata = {
  name: 'Houdini Swap',
  description: 'Houdini Swap',
  url: 'https://v4.houdiniswap.com',
  icons: ['https://v4.houdiniswap.com/houdini-logo.svg'],
};

const chainImages: { [key: number]: string } = {
  [bevmMainnet.id]: 'https://api.houdiniswap.com/assets/dexchains/bevm.png',
  [bitgert.id]: 'https://api.houdiniswap.com/assets/networks/BRISE.png',
  [blast.id]: 'https://api.houdiniswap.com/assets/networks/BLAST.png',
  [bob.id]: 'https://api.houdiniswap.com/assets/dexchains/bob.png',
  [cronos.id]: 'https://api.houdiniswap.com/assets/networks/CRO.png',
  [gnosis.id]: 'https://api.houdiniswap.com/assets/dexchains/gnosis.png',
  [kava.id]: 'https://api.houdiniswap.com/assets/networks/KAVA.png',
  [linea.id]: 'https://api.houdiniswap.com/assets/dexchains/linea.png',
  [manta.id]: 'https://api.houdiniswap.com/assets/networks/MANTA.png',
  [merlin.id]: 'https://api.houdiniswap.com/assets/dexchains/merlin.png',
  [mode.id]: 'https://api.houdiniswap.com/assets/networks/MODE.png',
  [okc.id]: 'https://api.houdiniswap.com/assets/dexchains/oec.png',
  [opBNB.id]: 'https://api.houdiniswap.com/assets/networks/OPBNB.png',
  [rootstock.id]: 'https://api.houdiniswap.com/assets/dexchains/rootstock.png',
  [scroll.id]: 'https://api.houdiniswap.com/assets/dexchains/scroll.png',
  [taiko.id]: 'https://api.houdiniswap.com/assets/dexchains/taiko.png',
  [tron.id]: 'https://api.houdiniswap.com/assets/networks/TRX.png',
  [wanchain.id]: 'https://api.houdiniswap.com/assets/networks/WAN.png',
  [worldchain.id]:
    'https://api.houdiniswap.com/assets/dexchains/world-chain.png',
  [zkLinkNova.id]: 'https://api.houdiniswap.com/assets/dexchains/zklink.png',
  [telos.id]: 'https://api.houdiniswap.com/assets/networks/TLOS.png',
  [coreDao.id]:
    'https://api.houdiniswap.com/assets/dexchains/core-blockchain.png',
  [bitlayer.id]: 'https://api.houdiniswap.com/assets/dexchains/bitlayer.png',
  [zetachain.id]: 'https://api.houdiniswap.com/assets/dexchains/zetachain.png',
  [theta.id]: 'https://api.houdiniswap.com/assets/networks/THETA.png',
  [gravity.id]: 'https://api.houdiniswap.com/assets/dexchains/gravity.png',
  [bounceBit.id]: 'https://api.houdiniswap.com/assets/dexchains/bounce-bit.png',
  [morph.id]: 'https://api.houdiniswap.com/assets/dexchains/morph.png',
  [hychain.id]: 'https://api.houdiniswap.com/assets/networks/HYPE.png',
  [pulsechain.id]: 'https://api.houdiniswap.com/assets/networks/PLS.png',
  [sonic.id]: 'https://api.houdiniswap.com/assets/networks/FTM.png',
  [lumiaMainnet.id]: 'https://api.houdiniswap.com/assets/networks/LUMIA.png',
};

export const modal = createAppKit({
  adapters: [wagmiAdapter, solanaAdapter, bitcoinAdapter],
  networks: [...networks],
  defaultNetwork: mainnet,
  projectId: process.env.NEXT_PUBLIC_REOWN_PROJECT_ID!,
  themeMode: 'dark',
  debug: true,
  metadata,
  enableWalletConnect: true,
  features: {
    analytics: true,
    email: false,
    emailShowWallets: false,
    socials: false,
    onramp: false,
    swaps: false,
    send: false,
  },
  allowUnsupportedChain: true,
  chainImages,
  // chainImages: {
  //   [suiMainnet.id]: (suiMainnet as any).icon,
  //   [suiMainnet.chainNamespace]: (suiMainnet as any).icon,
  //   [tron.id]:
  //     'https://assets.coingecko.com/coins/images/1094/standard/tron-logo.png',
  // },
});

export function ReownWalletProvider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) {
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config,
    cookies
  );

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig as Config}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

export default ReownWalletProvider;
