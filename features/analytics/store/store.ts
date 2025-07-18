import { create } from 'zustand';

import { ChainWithAttributes } from '@/features/analytics/utils/scaffold-eth';
import scaffoldConfig from '@/features/analytics/utils/scaffold.config';

/**
 * Zustand Store
 *
 * You can add global state to the app using this useGlobalState, to get & set
 * values from anywhere in the app.
 *
 * Think about it as a global useState.
 */

type GlobalState = {
  nativeCurrencyPrice: number;
  setNativeCurrencyPrice: (newNativeCurrencyPriceState: number) => void;
  targetNetwork: ChainWithAttributes;
  setTargetNetwork: (newTargetNetwork: ChainWithAttributes) => void;
};

export const useGlobalState = create<GlobalState>((set) => ({
  nativeCurrencyPrice: 0,
  setNativeCurrencyPrice: (newValue: number): void =>
    set(() => ({ nativeCurrencyPrice: newValue })),
  targetNetwork: scaffoldConfig.targetNetworks[0],
  setTargetNetwork: (newTargetNetwork: ChainWithAttributes) =>
    set(() => ({ targetNetwork: newTargetNetwork })),
}));
