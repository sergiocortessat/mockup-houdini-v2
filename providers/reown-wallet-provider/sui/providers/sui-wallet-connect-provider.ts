// @ts-nocheck
import { PublicKey } from '@mysten/sui/client';
import { WcHelpersUtil } from '@reown/appkit';
import { AdapterBlueprint } from '@reown/appkit/adapters';
import { WalletConnectConnector } from '@reown/appkit/connectors';
import UniversalProvider from '@walletconnect/universal-provider';

import {
  ProviderEventEmitter,
  SuiProvider,
} from '@/providers/reown-wallet-provider/sui/utils/provider-event-emitter';

export class SuiWalletConnectProvider
  extends WalletConnectConnector
  implements SuiProvider
{
  private eventEmitter: ProviderEventEmitter;
  private getActiveChain: () => any;

  constructor({ provider, chains, getActiveChain }) {
    super({ caipNetworks: chains, namespace: 'sui', provider });
    this.eventEmitter = new ProviderEventEmitter();
    this.emit = this.eventEmitter.emit.bind(this.eventEmitter);
    this.on = this.eventEmitter.on.bind(this.eventEmitter);
    this.removeListener = this.eventEmitter.removeListener.bind(
      this.eventEmitter
    );
    this.getActiveChain = getActiveChain;
  }

  get session() {
    return this.provider.session;
  }

  get chains() {
    return this.sessionChains
      .map((sessionChainId) => {
        return this.caipNetworks.find(
          (chain) => chain.caipNetworkId === sessionChainId
        );
      })
      .filter(Boolean);
  }

  get publicKey(): PublicKey | undefined {
    const account = this.getAccount(false);
    if (account) {
      return account.publicKey;
    }
    return undefined;
  }

  async connect(
    params: AdapterBlueprint.ConnectParams
  ): Promise<AdapterBlueprint.ConnectResult> {
    await super.connectWalletConnect();
    const account = this.getAccount(true);
    this.emit('connect', {
      address: account.address,
      chainId: account.chainId,
    });
    return account;
  }

  async disconnect(): Promise<void> {
    await super.disconnect();
    this.emit('disconnect', undefined);
  }

  async signMessage(
    params: AdapterBlueprint.SignMessageParams
  ): Promise<AdapterBlueprint.SignMessageResult> {
    return this.internalRequest('sui_signMessage', {
      message: params.message,
      address: this.getAccount(true).address,
    });
  }

  async sendTransaction(
    params: AdapterBlueprint.SendTransactionParams
  ): Promise<AdapterBlueprint.SendTransactionResult> {
    const result = await this.internalRequest('sui_signAndExecuteTransaction', {
      transaction: params.transaction,
      address: this.getAccount(true).address,
    });
    this.emit('pendingTransaction', undefined);
    return result;
  }

  async getAccounts(
    params: AdapterBlueprint.GetAccountsParams
  ): Promise<AdapterBlueprint.GetAccountsResult> {
    const accounts = this.session?.namespaces['sui']?.accounts || [];
    return Promise.resolve(
      accounts.map((account) => ({
        namespace: this.chain,
        address: account.split(':')[2],
        type: 'eoa',
      }))
    );
  }

  parseUnits(
    params: AdapterBlueprint.ParseUnitsParams
  ): AdapterBlueprint.ParseUnitsResult {
    // Implement according to Sui's decimal handling
    return BigInt(params.value * Math.pow(10, params.decimals));
  }

  formatUnits(
    params: AdapterBlueprint.FormatUnitsParams
  ): AdapterBlueprint.FormatUnitsResult {
    // Implement according to Sui's decimal handling
    return Number(params.value) / Math.pow(10, params.decimals);
  }

  request(args: { method: string; params: any }): Promise<any> {
    return this.internalRequest(args.method, args.params);
  }

  private internalRequest(method: string, params: any): Promise<any> {
    const chain = this.chains.find((c) => this.getActiveChain()?.id === c.id);
    const chainId = chain?.caipNetworkId;
    return this.provider?.request({ method, params }, chainId);
  }

  private get sessionChains() {
    return WcHelpersUtil.getChainsFromNamespaces(this.session?.namespaces);
  }

  private getAccount(required: boolean) {
    const account = this.session?.namespaces['sui']?.accounts[0];
    if (!account) {
      if (required) {
        throw new Error('Account not found');
      }
      return undefined;
    }
    const address = account.split(':')[2];
    if (!address) {
      if (required) {
        throw new Error('Address not found');
      }
      return undefined;
    }
    return { address, publicKey: address };
  }
}
