import {
  SuiFeatures,
  getWallets,
  isWalletWithRequiredFeatureSet,
} from '@mysten/wallet-standard';
import { CaipNetwork } from '@reown/appkit';

import { SuiAdapter } from '@/providers/reown-wallet-provider/sui/adapter';
import { WalletStandardProvider } from '@/providers/reown-wallet-provider/sui/providers/wallet-standard-provider';
import { SuiProvider } from '@/providers/reown-wallet-provider/sui/utils/provider-event-emitter';

const { get, on } = getWallets();

let standardAdapters: SuiProvider[] = [];

export function watchStandard(
  requestedChains: CaipNetwork[],
  getActiveChain: () => CaipNetwork | undefined,
  callback: (...adapters: SuiProvider[]) => void,
  adapter: SuiAdapter
): () => void {
  const listeners = [
    on('register', (...wallets) => {
      standardAdapters = [
        ...standardAdapters,
        ...wrapWalletsWithAdapters(
          wallets,
          requestedChains,
          getActiveChain,
          adapter
        ),
      ];
      callback(...standardAdapters);
    }),
    on('unregister', (...wallets) => {
      standardAdapters = standardAdapters.filter((standardAdapter) =>
        wallets.some(
          (wallet) =>
            wallet.name ===
            (standardAdapter as unknown as WalletStandardProvider).wallet.name
        )
      );
      callback(...standardAdapters);
    }),
  ];

  standardAdapters = wrapWalletsWithAdapters(
    get(),
    requestedChains,
    getActiveChain,
    adapter
  );
  callback(...standardAdapters);

  return () => listeners.forEach((off) => off());
}

function wrapWalletsWithAdapters(
  wallets: readonly any[],
  requestedChains: CaipNetwork[],
  getActiveChain: () => CaipNetwork | undefined,
  adapter: SuiAdapter
): SuiProvider[] {
  const suiWalletFeatures: (keyof SuiFeatures)[] = [
    // 'sui:signPersonalMessage',
    // 'sui:signMessage',
    // 'sui:reportTransactionEffects',
  ];
  return wallets
    .filter(
      (wallet) =>
        isWalletWithRequiredFeatureSet(wallet, [
          ...suiWalletFeatures,
          'sui:signTransaction',
          'sui:signAndExecuteTransaction',
        ]) ||
        // NOTE: backwards compatibility with older wallets
        isWalletWithRequiredFeatureSet(wallet, [
          ...suiWalletFeatures,
          'sui:signTransactionBlock',
          'sui:signAndExecuteTransactionBlock',
        ])
    )
    .map(
      (wallet) =>
        new WalletStandardProvider({
          wallet,
          requestedChains,
          getActiveChain,
          adapter,
        }) as unknown as SuiProvider
    );
}
