import { Transaction } from '@mysten/sui/transactions';
import {
  IdentifierString,
  StandardConnect,
  StandardDisconnect,
  StandardEvents,
  SuiWalletFeatures,
  WalletWithFeatures,
  signAndExecuteTransaction,
  signTransaction,
} from '@mysten/wallet-standard';
import { ConnectorType } from '@reown/appkit';
import { ChainNamespace, ConstantsUtil } from '@reown/appkit-common';
import { AccountType, Provider } from '@reown/appkit-controllers';
import { PresetsUtil } from '@reown/appkit-utils';
import { AdapterBlueprint } from '@reown/appkit/adapters';

import { SuiAdapter } from '@/providers/reown-wallet-provider/sui/adapter';
import { MethodNotSupportedError } from '@/providers/reown-wallet-provider/sui/errors/method-not-supported-error';
import { chains } from '@/providers/reown-wallet-provider/sui/utils/chains';
import {
  ProviderEventEmitter,
  SuiProvider,
} from '@/providers/reown-wallet-provider/sui/utils/provider-event-emitter';

// Gas-related constants
const DEFAULT_GAS_PRICE = 1_000;
const DEFAULT_GAS_BUDGET = 10_000_000;

export class WalletStandardProvider
  extends ProviderEventEmitter
  implements SuiProvider
{
  chain: ChainNamespace = 'sui' as ChainNamespace;
  type: ConnectorType = 'ANNOUNCED';
  walletUnsubscribes: (() => void)[] = [];
  provider: any;
  wallet: WalletWithFeatures<SuiWalletFeatures>;
  requestedChains: any[] = [];
  getActiveChain: () => any;
  adapter: SuiAdapter;

  constructor({ wallet, getActiveChain, requestedChains, adapter }: any) {
    super();
    // @ts-ignore
    this.chain = ConstantsUtil.CHAIN.SUI as ChainNamespace;
    this.provider = this;
    this.wallet = wallet;
    this.getActiveChain = getActiveChain;
    this.requestedChains = requestedChains;
    this.adapter = adapter;
    this.bindEvents();
  }
  get id() {
    const name = this.name;
    return PresetsUtil.ConnectorExplorerIds[name] || name;
  }
  get name() {
    if (this.wallet.name === 'Trust') {
      return 'Trust Wallet';
    }
    return this.wallet.name;
  }
  get explorerId() {
    return PresetsUtil.ConnectorExplorerIds[this.name];
  }
  get publicKey() {
    const account = this.getAccount();
    if (account) {
      return account.publicKey as any;
    }
    return undefined;
  }
  get imageUrl() {
    return this.wallet.icon;
  }
  get chains() {
    const chains = this.wallet.chains
      .map((chainId) => {
        const chain = this.requestedChains.find(
          (chain) =>
            chain.id === chainId ||
            chain.caipNetworkId === chainId ||
            chain.chainNamespace === chainId.split(':').at(0)
        );
        return chain;
      })
      .filter(Boolean);
    return chains;
  }
  async connect(): Promise<AdapterBlueprint.ConnectResult> {
    const feature = this.getWalletFeature(StandardConnect);
    await feature.connect();
    const account = this.getAccount();
    const publicKey = account.publicKey;
    this.emit('connect', publicKey);

    return {
      id: this.id,
      type: this.type,
      address: account.address,
      chainId: this.getActiveChain()?.id,
      provider: this as unknown as Provider,
    };
  }
  async disconnect() {
    const feature = this.getWalletFeature(StandardDisconnect);
    await feature?.disconnect();
    this.emit('disconnect', undefined);
  }
  async signMessage(
    params: AdapterBlueprint.SignMessageParams
  ): Promise<AdapterBlueprint.SignMessageResult> {
    const feature = this.getWalletFeature('sui:signMessage');
    const account = this.getAccount();

    const encodedMessage: Uint8Array = new TextEncoder().encode(params.message);
    try {
      const result = await feature?.signMessage({
        message: encodedMessage,
        account,
      });
      if (!result) {
        throw new Error('Empty result');
      }
      return result;
    } catch (err: any) {
      console.error('WalletStandardProvider: signMessage error', err);
      return { signature: '' };
    }
  }

  async sendTransaction(
    params: AdapterBlueprint.SendTransactionParams
  ): Promise<AdapterBlueprint.SendTransactionResult> {
    const account = this.getAccount();

    // Create a transaction using the parameters from the wallet actions
    const transaction = new Transaction();

    transaction.setSender(
      params.address ||
        (account.address as AdapterBlueprint.SendTransactionParams['address'])
    );
    transaction.setGasPrice(params.gasPrice || DEFAULT_GAS_PRICE);
    transaction.setGasBudget(params.gas || DEFAULT_GAS_BUDGET);

    // TODO: add support for different coins
    // const token = transaction.object({
    //   type: 'object',
    //   objectId:
    //     '0x2::coin::Coin<0x375f70cf2ae4c00bf37117d0c85a2c71545e6ee05c4a5c7d282cd66a4504b068::usdt::USDT>',
    // });
    // const usdtCoinAddress =
    //   '0x4598648c5dc4681a78618b37ae11134bfe5d2839f6bbe20a31e8bb9eb054382e::usdt::USDT';
    // const usdcCoinAddress =
    //   '0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC';
    // const suiCoinAddress = '0x2::sui::SUI';
    // const usdt = transaction.object(usdtCoinAddress);
    // const usdc = transaction.object(usdcCoinAddress);
    // const sui = transaction.object(suiCoinAddress);
    // transaction.transferObjects(
    //   [
    //     // usdc,
    //     // usdt,
    //     // sui,
    //     suiCoinAddress,
    //   ],
    //   params.to
    // );

    // 2. Split 0.1 SUI from the gas coin (100,000,000 MIST)
    const [coin] = transaction.splitCoins(transaction.gas, [
      BigInt(params.value),
    ]);
    // 3. Transfer the new coin to recipient
    transaction.transferObjects([coin], params.to);
    // Execute the transaction
    const result = await signAndExecuteTransaction(this.wallet, {
      account,
      transaction: { toJSON: async () => transaction.toJSON() },
      chain: this.getActiveChainName(),
    });

    this.emit('pendingTransactions');

    return { hash: result.digest };
  }

  async signTransaction(
    params: AdapterBlueprint.SendTransactionParams
  ): Promise<AdapterBlueprint.SendTransactionResult> {
    const account = this.getAccount();

    // Create a transaction using the parameters from the wallet actions
    const transaction = new Transaction();

    transaction.setSender(
      params.address ||
        (account.address as AdapterBlueprint.SendTransactionParams['address'])
    );
    // TODO: set fallback gas and gas price
    if (params.gas) transaction.setGasBudget(params.gas || DEFAULT_GAS_BUDGET);
    if (params.gasPrice)
      transaction.setGasPrice(params.gasPrice || DEFAULT_GAS_PRICE);

    // 2. Split 0.1 SUI from the gas coin (100,000,000 MIST)
    const [coin] = transaction.splitCoins(transaction.gas, [params.value]);
    // 3. Transfer the new coin to recipient
    transaction.transferObjects([coin], params.to);

    // Execute the transaction
    const result = await signAndExecuteTransaction(this.wallet, {
      account,
      transaction,
      chain: this.getActiveChainName(),
    });

    return { hash: result.digest };
  }

  async request(_args: any) {
    return Promise.reject(
      new Error(
        'The "request" method is not supported on Wallet Standard Provider'
      )
    );
  }
  async getAccounts(
    params: AdapterBlueprint.GetAccountsParams
  ): Promise<AdapterBlueprint.GetAccountsResult> {
    return Promise.resolve({
      accounts: this.wallet.accounts.map((account) => ({
        namespace: this.chain,
        address: account.address,
        type: 'eoa',
        publicKey: account.publicKey,
      })) as unknown as AccountType[],
    });
  }
  getAccount() {
    const account = this.wallet.accounts[0];
    if (!account) {
      throw new Error('No account found');
    }
    return account;
  }
  parseUnits(
    params: AdapterBlueprint.ParseUnitsParams
  ): AdapterBlueprint.ParseUnitsResult {
    return this.provider.parseUnits(params);
  }
  formatUnits(
    params: AdapterBlueprint.FormatUnitsParams
  ): AdapterBlueprint.FormatUnitsResult {
    return this.provider.formatUnits(params);
  }
  getWalletFeature<T extends keyof SuiWalletFeatures>(
    feature: T
  ): SuiWalletFeatures[T] {
    if (!(feature in this.wallet.features)) {
      return new Proxy(
        {},
        {
          get: (target, prop) => {
            if (prop === 'version') {
              return null;
            }
            return (...args: any[]) => {
              throw new MethodNotSupportedError(
                [this.wallet.name, this.wallet.version].join(' '),
                feature,
                args
              );
            };
          },
        }
      ) as unknown as SuiWalletFeatures[T];
    }
    return this.wallet.features[feature];
  }
  getActiveChainName(): IdentifierString {
    const [chainName] =
      Object.entries(chains).find(
        ([, chain]) => chain.id === this.getActiveChain()?.id
      ) || [];

    if (!chainName) {
      throw new Error('Invalid chain id');
    }
    return chainName as IdentifierString;
  }
  bindEvents() {
    const features = this.getWalletFeature(StandardEvents);
    features.on('change', (params) => {
      console.log('change', params, this);
      if (params.accounts) {
        const account = params.accounts[0];
        if (account) {
          (this.adapter as any).emit('accountChanged', {
            address: account.address,
            chainId: this.getActiveChain()?.id,
          });
        }
      }
    });
  }
}
