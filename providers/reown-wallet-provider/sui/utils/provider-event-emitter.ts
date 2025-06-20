import { PublicKey } from '@mysten/sui/client';
import { CaipNetwork } from '@reown/appkit';
import { ChainNamespace } from '@reown/appkit-common';
import {
  ConnectorType,
  Provider,
  ProviderEventListener,
} from '@reown/appkit-controllers';
import type { W3mFrameProvider } from '@reown/appkit-wallet';
import {
  AdapterBlueprint,
  ChainAdapterConnector,
} from '@reown/appkit/adapters';
import UniversalProvider from '@walletconnect/universal-provider';

export abstract class ProviderEventEmitter
  implements Omit<Provider, 'connect' | 'disconnect' | 'request'>
{
  private listeners: Record<
    keyof ProviderEventListener,
    ProviderEventListener[keyof ProviderEventListener][]
  >;

  constructor() {
    this.listeners = {
      accountsChanged: [],
      chainChanged: [],
      connect: [],
      disconnect: [],
      display_uri: [],
      message: [],
    };
  }

  on<T extends keyof ProviderEventListener>(
    event: T,
    listener: ProviderEventListener[T]
  ): void {
    this.listeners[event].push(listener);
  }

  removeListener<T>(event: string, listener: (data: T) => void): void {
    if (event in this.listeners) {
      this.listeners[event as keyof ProviderEventListener] = this.listeners[
        event as keyof ProviderEventListener
      ].filter((l) => l !== listener);
    }
  }

  emit(event: string, data?: unknown): void {
    if (event in this.listeners) {
      this.listeners[event as keyof ProviderEventListener].forEach((listener) =>
        listener(data as any)
      );
    }
  }
}

export interface SuiProvider
  extends ProviderEventEmitter,
    Pick<Provider, 'disconnect' | 'request'>,
    ChainAdapterConnector {
  id: string;
  name: string;
  chains: CaipNetwork[];
  type: ConnectorType;
  chain: ChainNamespace;
  publicKey?: PublicKey;
  provider: Provider | W3mFrameProvider | UniversalProvider;
  connect(
    params: AdapterBlueprint.ConnectParams
  ): Promise<AdapterBlueprint.ConnectResult>;
  parseUnits(
    params: AdapterBlueprint.ParseUnitsParams
  ): AdapterBlueprint.ParseUnitsResult;
  formatUnits(
    params: AdapterBlueprint.FormatUnitsParams
  ): AdapterBlueprint.FormatUnitsResult;
  signMessage(
    params: AdapterBlueprint.SignMessageParams
  ): Promise<AdapterBlueprint.SignMessageResult>;
  sendTransaction(
    params: AdapterBlueprint.SendTransactionParams
  ): Promise<AdapterBlueprint.SendTransactionResult>;
  getAccounts(
    params: AdapterBlueprint.GetAccountsParams
  ): Promise<AdapterBlueprint.GetAccountsResult>;
}
