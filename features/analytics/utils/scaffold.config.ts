import * as chains from 'viem/chains';

export type ScaffoldConfig = {
  targetNetworks: readonly chains.Chain[];
  pollingInterval: number;
  alchemyApiKey: string;
  walletConnectProjectId: string;
  onlyLocalBurnerWallet: boolean;
  walletAutoConnect: boolean;
};
let target =
  process.env.NEXT_APP_TARGET_NETWORK === 'hardhat'
    ? chains.hardhat
    : process.env.NEXT_APP_TARGET_NETWORK === 'sepolia'
      ? chains.sepolia
      : chains.mainnet;

const scaffoldConfig = {
  // The networks on which your DApp is live
  targetNetworks: [target],

  // The interval at which your front-end polls the RPC servers for new data
  // it has no effect if you only target the local network (default is 4000)
  pollingInterval: 30000,

  // This is ours Alchemy's default API key.
  // You can get your own at https://dashboard.alchemyapi.io
  // It's recommended to store it in an env variable:
  // .env.local for local testing, and in the Vercel/system env config for live apps.
  alchemyApiKey:
    process.env.NEXT_APP_ALCHEMY_RPC_API || 'XOGrzkGpLTjzPG4yMD-vh_WS2A0mZAtc',

  // This is ours WalletConnect's default project ID.
  // You can get your own at https://cloud.walletconnect.com
  // It's recommended to store it in an env variable:
  // .env.local for local testing, and in the Vercel/system env config for live apps.
  walletConnectProjectId:
    process.env.NEXT_APP_PROJECT_ID || 'abc9963bae7aada93688306adde907e5',

  // Only show the Burner Wallet when running on hardhat network
  onlyLocalBurnerWallet: true,

  /**
   * Auto connect:
   * 1. If the user was connected into a wallet before, on page reload reconnect automatically
   * 2. If user is not connected to any wallet:  On reload, connect to burner wallet if burnerWallet.enabled is true && burnerWallet.onlyLocal is false
   */
  walletAutoConnect: true,
} as const satisfies ScaffoldConfig;

export default scaffoldConfig;
