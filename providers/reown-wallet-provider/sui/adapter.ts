import { CoinBalance, SuiClient } from '@mysten/sui/client';
import { Wallet } from '@mysten/wallet-standard';
import { AppKit, AppKitOptions } from '@reown/appkit';
import {
  CaipNetwork,
  ChainNamespace,
  ConstantsUtil,
  NumberUtil,
} from '@reown/appkit-common';
import {
  AccountType,
  AlertController,
  AssetController,
  ChainController,
  CoreHelperUtil,
  NamespaceTypeMap,
  ProviderEventListener,
  StorageUtil,
} from '@reown/appkit-controllers';
import { ErrorUtil } from '@reown/appkit-utils';
import { AdapterBlueprint } from '@reown/appkit/adapters';
import { WalletConnectConnector } from '@reown/appkit/connectors';
import UniversalProvider from '@walletconnect/universal-provider';

import { SuiWalletConnectProvider } from '@/providers/reown-wallet-provider/sui/providers/sui-wallet-connect-provider';
import { sui } from '@/providers/reown-wallet-provider/sui/utils/chains';
import { SuiProvider } from '@/providers/reown-wallet-provider/sui/utils/provider-event-emitter';
import { watchStandard } from '@/providers/reown-wallet-provider/sui/utils/watch-standard';

// Basic implementation of SuiAdapter with logging
export class SuiAdapter extends AdapterBlueprint<SuiProvider> {
  connectionSettings: {
    httpAgent: boolean;
    commitment: string;
    endpoint: string;
  };
  chain?: CaipNetwork;
  provider?: any;

  namespace: ChainNamespace;
  caipNetworks?: CaipNetwork[];
  projectId?: string;
  adapterType: string;
  wallets?: Wallet[];
  balancePromises: {
    [key: string]: Promise<AdapterBlueprint.GetBalanceResult>;
  };
  providerHandlers: Partial<
    Record<keyof SuiProvider['listeners'], (data: any) => void>
  > = {};

  constructor(
    options: AdapterBlueprint.Params & {
      connectionSettings: {
        httpAgent: boolean;
        commitment: string;
        endpoint: string;
      };
      wallets?: Wallet[];
    }
  ) {
    super({});
    // @ts-ignore
    ConstantsUtil.CHAIN.SUI = 'sui';
    // @ts-ignore
    ConstantsUtil.CHAIN_NAME_MAP.sui = 'Sui';

    // @ts-ignore
    this.namespace = ConstantsUtil.CHAIN.SUI;
    this.adapterType = 'sui';
    this.projectId = options.projectId;

    this.caipNetworks = [sui];

    this.balancePromises = {};
    this.connectionSettings = options.connectionSettings || 'confirmed';
    this.wallets = options.wallets;

    AssetController.setChainImage(
      sui.chainNamespace,
      'https://assets.coingecko.com/coins/images/26375/standard/sui-ocean-square.png'
    );
    AssetController.setConnectorImage(
      sui.chainNamespace,
      'https://assets.coingecko.com/coins/images/26375/standard/sui-ocean-square.png'
    );
    AssetController.setNetworkImage(
      sui.chainNamespace,
      'https://assets.coingecko.com/coins/images/26375/standard/sui-ocean-square.png'
    );

    // Set connection settings with defaults for any undefined values
    const connectionSettings = options.connectionSettings || {};
    this.connectionSettings = {
      httpAgent:
        connectionSettings.httpAgent !== undefined
          ? connectionSettings.httpAgent
          : false,
      commitment: connectionSettings.commitment || 'immediate',
      endpoint: connectionSettings.endpoint,
    };
  }

  syncConnectors(options?: AppKitOptions, appKit?: AppKit): void {
    if (!options?.projectId) {
      AlertController.open(
        ErrorUtil.ALERT_ERRORS.PROJECT_ID_NOT_CONFIGURED,
        'error'
      );
    }
    const getActiveChain = () => appKit?.getCaipNetwork(this.namespace);

    if (CoreHelperUtil.isClient()) {
      console.info('SuiAdapter: isClient, adding connector from window');
    }

    watchStandard(
      this.caipNetworks || [],
      getActiveChain,
      this.addConnector.bind(this),
      this
    );
  }

  setUniversalProvider(universalProvider: UniversalProvider): void {
    this.addConnector(
      new SuiWalletConnectProvider({
        provider: universalProvider,
        chains: this.caipNetworks,
        getActiveChain: () =>
          ChainController.getCaipNetworkByNamespace(this.namespace),
      }) as unknown as SuiProvider
    );
  }
  getWalletConnectProvider(
    params: AdapterBlueprint.GetWalletConnectProviderParams
  ): AdapterBlueprint.GetWalletConnectProviderResult {
    return new SuiWalletConnectProvider({
      provider: params.provider,
      chains: params.caipNetworks,
      getActiveChain: () =>
        ChainController.getCaipNetworkByNamespace(this.namespace),
    }) as unknown as UniversalProvider;
  }
  getWalletConnectConnector(): WalletConnectConnector {
    return this.connector as unknown as WalletConnectConnector;
  }

  connectWalletConnect(
    _chainId?: number | string
  ): Promise<{ clientId: string }> {
    throw new Error('Method not implemented.');
  }
  async connect(
    params: AdapterBlueprint.ConnectParams
  ): Promise<AdapterBlueprint.ConnectResult> {
    // Get the first available connector
    const connector = this.connectors.find((c) => c.id === params.id);
    if (!connector) {
      throw new Error(
        'connectionControllerClient:connectExternal - connector is undefined'
      );
    }
    const chain =
      connector.chains.find((c) => c.id === params.chainId) ||
      connector.chains[0];

    if (!chain) {
      throw new Error(
        'The connector does not support any of the requested chains'
      );
    }

    this.connector = connector;
    this.provider = connector.provider as unknown as SuiProvider;
    this.chain = chain;
    // this.listenProviderEvents(this.provider);
    // this.removeProviderListeners(this.connector);

    const account = await connector.connect(params);
    this.emit('accountChanged', {
      address: account.address,
      chainId: chain.id,
    });

    return {
      id: connector.id,
      type: connector.type,
      address: account.address,
      chainId: chain.id,
      provider: connector.provider,
    };
  }
  disconnect(params?: AdapterBlueprint.DisconnectParams): Promise<void> {
    if (this.provider) {
      this.provider.disconnect();
      this.emit('disconnect', undefined);
      this.connector = undefined;
      this.provider = undefined;

      return Promise.resolve();
    }

    return Promise.reject();
  }
  async reconnect(params: AdapterBlueprint.ReconnectParams): Promise<void> {
    const { address, chainId } = await this.connect(params);
    this.emit('accountChanged', { address, chainId: chainId });
  }

  async switchNetwork(
    params: AdapterBlueprint.SwitchNetworkParams
  ): Promise<void> {
    await super.switchNetwork(params);
    this.emit('switchNetwork', { chainId: params.caipNetwork.id });
  }
  async syncConnection(
    params: AdapterBlueprint.SyncConnectionParams
  ): Promise<AdapterBlueprint.ConnectResult> {
    const connector = this.connectors.find((c) => c.id === params.id);

    if (!connector) {
      throw new Error(
        'connectionControllerClient:connectExternal - connector is undefined'
      );
    }

    return this.connect({ ...params, type: connector.type });
  }
  async getAccounts(
    params: AdapterBlueprint.GetAccountsParams
  ): Promise<AdapterBlueprint.GetAccountsResult> {
    const connector = this.connectors.find((c) => c.id === params.id);

    if (!connector) {
      throw new Error('No connector available');
    }

    const addresses = new Set<string>();
    // TODO: filter by chains
    // @ts-ignore
    const mappedAccounts = (connector.wallet?.accounts || [])
      .map((acc: any) => ({
        namespace: this.chain,
        type: 'eoa' as NamespaceTypeMap['eip155'],
        address: acc.address,
        publicKey: Buffer.from(acc.publicKey).toString('hex'),
      }))
      .filter((acc: any) => {
        if (addresses.has(acc.address)) {
          return false;
        }
        addresses.add(acc.address);
        return true;
      });

    return Promise.resolve({
      accounts: mappedAccounts?.map(
        ({ namespace, type, address, publicKey }: any) =>
          CoreHelperUtil.createAccount(namespace, address, type, publicKey)
      ) as AccountType[],
    });
  }
  async getBalance(
    params: AdapterBlueprint.GetBalanceParams
  ): Promise<AdapterBlueprint.GetBalanceResult> {
    const address = params.address;
    const caipNetwork = this.caipNetworks?.find(
      (network) => network.id === params.chainId
    );
    if (!address) {
      return Promise.resolve({ balance: '0.00', symbol: 'SUI' });
    }
    if (caipNetwork) {
      const connection = new SuiClient({
        url: caipNetwork.rpcUrls.default.http[0],
      });
      const caipAddress = `${caipNetwork.caipNetworkId}:${params.address}`;
      const cachedPromise = this.balancePromises[caipAddress];
      if (cachedPromise) {
        return cachedPromise;
      }
      const cachedBalance =
        StorageUtil.getNativeBalanceCacheForCaipAddress(caipAddress);
      if (cachedBalance) {
        return { balance: cachedBalance.balance, symbol: cachedBalance.symbol };
      }
      this.balancePromises[caipAddress] =
        new Promise<AdapterBlueprint.GetBalanceResult>(async (resolve) => {
          const balance: CoinBalance = await connection.getBalance({
            owner: address,
          });
          const formattedBalance = (
            NumberUtil.bigNumber(balance.totalBalance) /
            10 ** caipNetwork.nativeCurrency.decimals
          ).toString();
          StorageUtil.updateNativeBalanceCache({
            caipAddress,
            balance: formattedBalance,
            symbol: caipNetwork.nativeCurrency.symbol,
            timestamp: Date.now(),
          });
          resolve({
            balance: formattedBalance,
            symbol: caipNetwork.nativeCurrency.symbol,
          });
        }).finally(() => {
          delete this.balancePromises[caipAddress];
        });
      return (
        this.balancePromises[caipAddress] || {
          balance: '0.00',
          symbol: caipNetwork.nativeCurrency.symbol,
        }
      );
    }
    return { balance: '', symbol: '' };
  }
  getProfile(
    params: AdapterBlueprint.GetProfileParams
  ): Promise<AdapterBlueprint.GetProfileResult> {
    throw new Error('Method not implemented.');
  }
  signMessage(
    params: AdapterBlueprint.SignMessageParams
  ): Promise<AdapterBlueprint.SignMessageResult> {
    if (!this.connector) {
      throw new Error('No connector available');
    }
    return this.connector.signMessage(params);
  }
  estimateGas(
    params: AdapterBlueprint.EstimateGasTransactionArgs
  ): Promise<AdapterBlueprint.EstimateGasTransactionResult> {
    throw new Error('Method not implemented.');
  }
  sendTransaction(
    params: AdapterBlueprint.SendTransactionParams
  ): Promise<AdapterBlueprint.SendTransactionResult> {
    if (!this.connector) {
      throw new Error('No connector available');
    }
    return this.connector.sendTransaction(params);
  }
  writeContract(
    params: AdapterBlueprint.WriteContractParams
  ): Promise<AdapterBlueprint.WriteContractResult> {
    throw new Error('Method not implemented.');
  }
  getEnsAddress(
    params: AdapterBlueprint.GetEnsAddressParams
  ): Promise<AdapterBlueprint.GetEnsAddressResult> {
    throw new Error('Method not implemented.');
  }
  parseUnits(
    params: AdapterBlueprint.ParseUnitsParams
  ): AdapterBlueprint.ParseUnitsResult {
    throw new Error('Method not implemented.');
  }
  formatUnits(
    params: AdapterBlueprint.FormatUnitsParams
  ): AdapterBlueprint.FormatUnitsResult {
    return NumberUtil.formatNumberToLocalString(
      NumberUtil.bigNumber(params.value) / 10 ** params.decimals
    );
  }
  getCapabilities(
    params: AdapterBlueprint.GetCapabilitiesParams
  ): Promise<unknown> {
    throw new Error('Method not implemented.');
  }
  grantPermissions(
    params: AdapterBlueprint.GrantPermissionsParams
  ): Promise<unknown> {
    throw new Error('Method not implemented.');
  }
  revokePermissions(
    params: AdapterBlueprint.RevokePermissionsParams
  ): Promise<`0x${string}`> {
    throw new Error('Method not implemented.');
  }
  walletGetAssets(
    params: AdapterBlueprint.WalletGetAssetsParams
  ): Promise<AdapterBlueprint.WalletGetAssetsResponse> {
    throw new Error('Method not implemented.');
  }
  listenProviderEvents(provider: SuiProvider) {
    const disconnectHandler = () => {
      this.removeProviderListeners(provider);
      this.emit('disconnect');
    };
    const accountsChangedHandler = (accounts: string[]) => {
      this.emit('accountChanged', { address: accounts?.at(0) || '' });
    };

    this.providerHandlers = Object.entries({
      connect: accountsChangedHandler,
      disconnect: disconnectHandler,
      accountsChanged: accountsChangedHandler,
      pendingTransaction: () => this.emit('pendingTransactions'),
    })
      .map(([key, handler]) => {
        provider.on(key as keyof ProviderEventListener, handler);

        return [key, handler];
      })
      .reduce(
        (obj, [key, handler]) => ({
          ...obj,
          [key as keyof ProviderEventListener]: handler,
        }),
        {}
      );
  }
  removeProviderListeners(provider: SuiProvider) {
    this.providerHandlers = Object.entries(this.providerHandlers)
      .map(([key, handler]) => {
        provider.removeListener(key, handler);
      })
      .reduce((obj) => obj, {});
  }
}
