import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTimeISO: { input: string; output: string; }
  JSON: { input: any; output: any; }
  JSONObject: { input: any; output: any; }
  Upload: { input: File; output: File; }
};

export type ApprovalResponse = {
  __typename?: 'ApprovalResponse';
  approvals: Array<ApproveTransaction>;
  signatures: Array<ApprovalTypedData>;
};

export type ApprovalTypedData = {
  __typename?: 'ApprovalTypedData';
  data: Eip712TypedData;
  isComplete: Scalars['Boolean']['output'];
  key: Scalars['String']['output'];
  step: Scalars['Float']['output'];
  totalSteps: Scalars['Float']['output'];
  type: Scalars['String']['output'];
};

/** Approve Transaction data */
export type ApproveTransaction = {
  __typename?: 'ApproveTransaction';
  data?: Maybe<Scalars['String']['output']>;
  from?: Maybe<Scalars['String']['output']>;
  fromChain: Chain;
  to?: Maybe<Scalars['String']['output']>;
};

export type BlockedRoute = {
  __typename?: 'BlockedRoute';
  created: Scalars['DateTimeISO']['output'];
  id: Scalars['ID']['output'];
  modified?: Maybe<Scalars['DateTimeISO']['output']>;
  tokenIn: Token;
  tokenOut: Token;
};

export type Chain = {
  __typename?: 'Chain';
  addressUrl: Scalars['String']['output'];
  addressValidation?: Maybe<Scalars['String']['output']>;
  chainId?: Maybe<Scalars['Float']['output']>;
  created?: Maybe<Scalars['DateTimeISO']['output']>;
  customRpc?: Maybe<Scalars['String']['output']>;
  enabled?: Maybe<Scalars['Boolean']['output']>;
  explorerUrl: Scalars['String']['output'];
  hashUrl?: Maybe<Scalars['String']['output']>;
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  kind: Scalars['String']['output'];
  memoNeeded?: Maybe<Scalars['Boolean']['output']>;
  modified?: Maybe<Scalars['DateTimeISO']['output']>;
  name: Scalars['String']['output'];
  priority?: Maybe<Scalars['Float']['output']>;
  shortName: Scalars['String']['output'];
  shortNameV1: Scalars['String']['output'];
  swapChains?: Maybe<Array<SwapChain>>;
  tokenAddressValidation?: Maybe<Scalars['String']['output']>;
};

/** ClaimTx result */
export type ClaimTxResult = {
  __typename?: 'ClaimTxResult';
  metadata?: Maybe<Scalars['JSON']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type Config = {
  __typename?: 'Config';
  created?: Maybe<Scalars['DateTimeISO']['output']>;
  id: Scalars['ID']['output'];
  key: Scalars['String']['output'];
  modified?: Maybe<Scalars['DateTimeISO']['output']>;
  public: Scalars['Boolean']['output'];
  value?: Maybe<Scalars['String']['output']>;
};

export type Eip712TypedData = {
  __typename?: 'EIP712TypedData';
  domain: TypedDataDomain;
  message: Scalars['JSON']['output'];
  primaryType: Scalars['String']['output'];
  types: Scalars['JSON']['output'];
};

/** Earned Stat */
export type EarnedStat = {
  __typename?: 'EarnedStat';
  apy?: Maybe<Scalars['Float']['output']>;
  block: Scalars['Float']['output'];
  label: Scalars['String']['output'];
  timestamp: Scalars['Float']['output'];
  values: Array<Scalars['Float']['output']>;
};

/** Error result */
export type ErrorResult = {
  __typename?: 'ErrorResult';
  code?: Maybe<Scalars['Float']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  requestId?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  userMessage?: Maybe<Scalars['String']['output']>;
};

export type FavoriteTokenEntity = {
  __typename?: 'FavoriteTokenEntity';
  created?: Maybe<Scalars['DateTimeISO']['output']>;
  id: Scalars['ID']['output'];
  modified?: Maybe<Scalars['DateTimeISO']['output']>;
  tokens: Array<Token>;
  wallet: Wallet;
};

export type GeneratePrivateId = {
  __typename?: 'GeneratePrivateId';
  privateId: Scalars['String']['output'];
};

export type Listing = {
  __typename?: 'Listing';
  address?: Maybe<Scalars['String']['output']>;
  cgId?: Maybe<Scalars['String']['output']>;
  chain: Scalars['String']['output'];
  created: Scalars['DateTimeISO']['output'];
  decimals: Scalars['Float']['output'];
  icon: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  launchDate?: Maybe<Scalars['DateTimeISO']['output']>;
  modified?: Maybe<Scalars['DateTimeISO']['output']>;
  name: Scalars['String']['output'];
  paid?: Maybe<Scalars['Boolean']['output']>;
  status: ListingStatus;
  symbol: Scalars['String']['output'];
  token?: Maybe<Token>;
  website?: Maybe<Scalars['String']['output']>;
};

export enum ListingStatus {
  Approved = 'APPROVED',
  Rejected = 'REJECTED',
  Submitted = 'SUBMITTED'
}

export type Mutation = {
  __typename?: 'Mutation';
  addFavoriteToken: FavoriteTokenEntity;
  /** Create short url */
  addShortUrl?: Maybe<ShortUrl>;
  /** Claims the order tokens */
  claimTx?: Maybe<ClaimTxResult>;
  /** Pushes a message to support with the tx hash and houdini ID to confirm a deposit that got stuck */
  confirmDeposit?: Maybe<Scalars['Boolean']['output']>;
  /** Updates the order status with the initial TX hash */
  confirmTx?: Maybe<Scalars['Boolean']['output']>;
  /** Creates a new listing */
  createListing?: Maybe<Listing>;
  /** Executes an exchange using provided parameters and path */
  dexExchange?: Maybe<OrderWithErrorResult>;
  /** Anonimize the order data */
  eraseOrder?: Maybe<Scalars['Boolean']['output']>;
  /** Executes an exchange using provided parameters and path */
  exchange?: Maybe<OrderWithErrorResult>;
  generatePrivateOrderLink: GeneratePrivateId;
  /** Link account. Must include address, and signature. Will return a boolean */
  linkAccount?: Maybe<Scalars['Boolean']['output']>;
  /** Executes an exchange using provided parameters and path */
  multiExchange?: Maybe<Array<OrderWithErrorResult>>;
  removeFavoriteToken: FavoriteTokenEntity;
  /** Force retry a multiExchange Order */
  retryMultiOrder?: Maybe<Scalars['Boolean']['output']>;
  sendBug: Scalars['Boolean']['output'];
  sendContact: Scalars['Boolean']['output'];
  /** Update order walletInfo */
  updateWalletInfo?: Maybe<Scalars['Boolean']['output']>;
};


export type MutationAddFavoriteTokenArgs = {
  tokenId: Scalars['String']['input'];
};


export type MutationAddShortUrlArgs = {
  data: ShortUrlInput;
};


export type MutationClaimTxArgs = {
  id: Scalars['String']['input'];
  txHash?: InputMaybe<Scalars['String']['input']>;
};


export type MutationConfirmDepositArgs = {
  hash: Scalars['String']['input'];
  id: Scalars['String']['input'];
};


export type MutationConfirmTxArgs = {
  id: Scalars['String']['input'];
  txHash?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCreateListingArgs = {
  address?: InputMaybe<Scalars['String']['input']>;
  cgId: Scalars['String']['input'];
  chain: Scalars['String']['input'];
  decimals: Scalars['Float']['input'];
  icon: Scalars['String']['input'];
  name: Scalars['String']['input'];
  symbol: Scalars['String']['input'];
  website?: InputMaybe<Scalars['String']['input']>;
};


export type MutationDexExchangeArgs = {
  addressFrom: Scalars['String']['input'];
  addressTo: Scalars['String']['input'];
  amount: Scalars['Float']['input'];
  destinationTag?: InputMaybe<Scalars['String']['input']>;
  deviceInfo?: InputMaybe<Scalars['String']['input']>;
  isMobile?: InputMaybe<Scalars['Boolean']['input']>;
  partnerId?: InputMaybe<Scalars['String']['input']>;
  quoteId?: InputMaybe<Scalars['String']['input']>;
  route: Scalars['JSONObject']['input'];
  signatures?: InputMaybe<Array<Scalars['String']['input']>>;
  slippage?: InputMaybe<Scalars['Float']['input']>;
  swap: Scalars['String']['input'];
  tokenIdFrom: Scalars['String']['input'];
  tokenIdTo: Scalars['String']['input'];
  walletId?: InputMaybe<Scalars['String']['input']>;
  walletInfo?: InputMaybe<Scalars['String']['input']>;
  widgetMode?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationEraseOrderArgs = {
  id: Scalars['String']['input'];
};


export type MutationExchangeArgs = {
  addressTo: Scalars['String']['input'];
  amount: Scalars['Float']['input'];
  anonymous: Scalars['Boolean']['input'];
  destinationTag?: InputMaybe<Scalars['String']['input']>;
  deviceInfo?: InputMaybe<Scalars['String']['input']>;
  from: Scalars['String']['input'];
  inQuoteId?: InputMaybe<Scalars['String']['input']>;
  isMobile?: InputMaybe<Scalars['Boolean']['input']>;
  multiId?: InputMaybe<Scalars['String']['input']>;
  outQuoteId?: InputMaybe<Scalars['String']['input']>;
  partnerId?: InputMaybe<Scalars['String']['input']>;
  to: Scalars['String']['input'];
  useXmr?: InputMaybe<Scalars['Boolean']['input']>;
  walletId?: InputMaybe<Scalars['String']['input']>;
  walletInfo?: InputMaybe<Scalars['String']['input']>;
  widgetMode?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationGeneratePrivateOrderLinkArgs = {
  houdiniId: Scalars['String']['input'];
};


export type MutationLinkAccountArgs = {
  address: Scalars['String']['input'];
  inputAccount: Scalars['String']['input'];
  inputAccountUrl: Scalars['String']['input'];
};


export type MutationMultiExchangeArgs = {
  deviceInfo?: InputMaybe<Scalars['String']['input']>;
  isMobile?: InputMaybe<Scalars['Boolean']['input']>;
  orders: Array<OrderInput>;
  partnerId?: InputMaybe<Scalars['String']['input']>;
  walletId?: InputMaybe<Scalars['String']['input']>;
  walletInfo?: InputMaybe<Scalars['String']['input']>;
  widgetMode?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationRemoveFavoriteTokenArgs = {
  tokenId: Scalars['String']['input'];
};


export type MutationRetryMultiOrderArgs = {
  id: Scalars['String']['input'];
};


export type MutationSendBugArgs = {
  description: Scalars['String']['input'];
  discord: Scalars['String']['input'];
  email: Scalars['String']['input'];
  files: Array<Scalars['Upload']['input']>;
  telegram: Scalars['String']['input'];
  twitter: Scalars['String']['input'];
};


export type MutationSendContactArgs = {
  description: Scalars['String']['input'];
  discord: Scalars['String']['input'];
  email: Scalars['String']['input'];
  referral: Scalars['String']['input'];
  telegram: Scalars['String']['input'];
  token: Scalars['String']['input'];
  tokenChain: Scalars['String']['input'];
  twitter: Scalars['String']['input'];
  website: Scalars['String']['input'];
};


export type MutationUpdateWalletInfoArgs = {
  id: Scalars['String']['input'];
  walletInfo: Scalars['String']['input'];
};

/** Order exchange input object */
export type OrderInput = {
  addressTo: Scalars['String']['input'];
  amount: Scalars['Float']['input'];
  anonymous: Scalars['Boolean']['input'];
  destinationTag?: InputMaybe<Scalars['String']['input']>;
  from: Scalars['String']['input'];
  inQuoteId?: InputMaybe<Scalars['String']['input']>;
  outQuoteId?: InputMaybe<Scalars['String']['input']>;
  to: Scalars['String']['input'];
  useXmr?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Exchange Status result */
export type OrderStatusResult = {
  __typename?: 'OrderStatusResult';
  actionRequired?: Maybe<Scalars['Boolean']['output']>;
  anonymous?: Maybe<Scalars['Boolean']['output']>;
  created?: Maybe<Scalars['DateTimeISO']['output']>;
  /** ETA in minutes for usual transactions */
  eta?: Maybe<Scalars['Float']['output']>;
  /** 30 minutes from created */
  expires?: Maybe<Scalars['DateTimeISO']['output']>;
  fallbackAmount?: Maybe<Scalars['Float']['output']>;
  fallbackTokenAddress?: Maybe<Scalars['String']['output']>;
  /** Explorer url for the blockchain net */
  hashUrl?: Maybe<Scalars['String']['output']>;
  houdiniId?: Maybe<Scalars['String']['output']>;
  /** The unique identifier of the order */
  id?: Maybe<Scalars['String']['output']>;
  inAmount?: Maybe<Scalars['Float']['output']>;
  inAmountUsd?: Maybe<Scalars['Float']['output']>;
  inCreated?: Maybe<Scalars['DateTimeISO']['output']>;
  /** Status of the input swap partner. Possible values: NEW(0), WAITING(1), CONFIRMING(2), EXCHANGING(3), SENDING(4), FINISHED(5), FAILED(6), REFUNDED(7), VERIFYING(8), EXPIRED(9), FALLBACK(10) */
  inStatus?: Maybe<Scalars['Float']['output']>;
  inSymbol?: Maybe<Scalars['String']['output']>;
  inToken?: Maybe<Token>;
  isDex?: Maybe<Scalars['Boolean']['output']>;
  metadata?: Maybe<Scalars['JSON']['output']>;
  modified?: Maybe<Scalars['DateTimeISO']['output']>;
  multiId?: Maybe<Scalars['String']['output']>;
  /** Path does not allow refunds if user sends funds on the wrong chain. Frontend will show an alert */
  nonRefundable?: Maybe<Scalars['Boolean']['output']>;
  notified?: Maybe<Scalars['Boolean']['output']>;
  outAmount?: Maybe<Scalars['Float']['output']>;
  outCreated?: Maybe<Scalars['DateTimeISO']['output']>;
  /** Status of the output swap partner. Possible values: NEW(0), WAITING(1), CONFIRMING(2), EXCHANGING(3), SENDING(4), FINISHED(5), FAILED(6), REFUNDED(7), VERIFYING(8), EXPIRED(9), FALLBACK(10) */
  outStatus?: Maybe<Scalars['Float']['output']>;
  outSwapName?: Maybe<Scalars['String']['output']>;
  outSymbol?: Maybe<Scalars['String']['output']>;
  outToken?: Maybe<Token>;
  quote?: Maybe<QuotePrice>;
  /** Where to receive the funds */
  receiverAddress?: Maybe<Scalars['String']['output']>;
  /** Destination address tag/memo */
  receiverTag?: Maybe<Scalars['String']['output']>;
  /** Where to send funds to */
  senderAddress?: Maybe<Scalars['String']['output']>;
  /** Deposit address tag/memo */
  senderTag?: Maybe<Scalars['String']['output']>;
  status: Scalars['Float']['output'];
  swapName?: Maybe<Scalars['String']['output']>;
  transactionHash?: Maybe<Scalars['String']['output']>;
  xmrAmountUsd?: Maybe<Scalars['Float']['output']>;
};

/** Order status result that can also return an error */
export type OrderWithErrorResult = {
  __typename?: 'OrderWithErrorResult';
  error?: Maybe<ErrorResult>;
  order?: Maybe<OrderStatusResult>;
};

/** Pairs result filters */
export type PairFilters = {
  address?: InputMaybe<Scalars['String']['input']>;
  chain?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  symbol?: InputMaybe<Scalars['String']['input']>;
};

/** Pairs result with total pages */
export type Pairs = {
  __typename?: 'Pairs';
  pairs?: Maybe<Array<Array<Token>>>;
  totalPages?: Maybe<Scalars['Float']['output']>;
};

export type PrivateOrderResponse = {
  __typename?: 'PrivateOrderResponse';
  created: Scalars['DateTimeISO']['output'];
  eta?: Maybe<Scalars['Float']['output']>;
  inAmount: Scalars['Float']['output'];
  inAmountUsd?: Maybe<Scalars['Float']['output']>;
  inSymbol: Scalars['String']['output'];
  inToken?: Maybe<Token>;
  modified?: Maybe<Scalars['DateTimeISO']['output']>;
  orderFinishedReceived?: Maybe<Scalars['DateTimeISO']['output']>;
  outAmount: Scalars['Float']['output'];
  outSymbol: Scalars['String']['output'];
  outToken?: Maybe<Token>;
  privateId: Scalars['String']['output'];
  quote?: Maybe<Quote>;
  status: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  Account?: Maybe<WalletInfo>;
  accountExists?: Maybe<Scalars['Boolean']['output']>;
  /** Returns a list of required token approve data for dex/route. To be polled until empty list is returned. */
  approve?: Maybe<ApprovalResponse>;
  /** Returns all blocked routes */
  blockedRoutes: Array<BlockedRoute>;
  /** Chain signatures for multi-step signature processes. Used to feed previous signatures and get the next one in the chain. */
  chainSignatures: Array<ApprovalTypedData>;
  /** Check if a address is a contract or not, some contracts are allowed like multisig. Returns true if it is a contract, false if it is not. Allowed only if false is returned */
  checkDestinationAddress?: Maybe<Scalars['Boolean']['output']>;
  /** Check if a list of token addresses exist in the database */
  checkTokenAddresses?: Maybe<Array<Token>>;
  /** Returns a single public config */
  config?: Maybe<Config>;
  /** Returns all public configs */
  configs?: Maybe<Array<Config>>;
  /** Returns the list of available tokens */
  dexNetworks?: Maybe<Array<Chain>>;
  /** Returns an estimated swap value, min/max */
  dexQuote?: Maybe<RoutesWithErrorResult>;
  /** user earn history */
  earnedHistory?: Maybe<Array<EarnedStat>>;
  getFavoriteTokens: FavoriteTokenEntity;
  /** Get all popular tokens */
  getPopularTokens?: Maybe<Array<Token>>;
  getPrivateOrder: PrivateOrderResponse;
  /** Return short url */
  getShortUrl?: Maybe<ShortUrl>;
  getSymbolUSDPrice?: Maybe<WalletStats>;
  /** user history */
  history?: Maybe<Array<StakerEvent>>;
  /** Returns all approved listings with launch date between from and to */
  launchingListings?: Maybe<Array<Listing>>;
  /** Returns the usd price for the curent token */
  minMax?: Maybe<Array<Scalars['Float']['output']>>;
  /** Returns the exchange status */
  multiStatus?: Maybe<Array<OrderStatusResult>>;
  /** Returns the list of available tokens */
  networks?: Maybe<Array<Chain>>;
  /** Token pairs. */
  pairs?: Maybe<Pairs>;
  /** Returns partner url by nickname */
  partnerUrlByNickname?: Maybe<Scalars['String']['output']>;
  /** usd price of 1 $BLOCK */
  priceUsd?: Maybe<Scalars['Float']['output']>;
  /** Returns an estimated swap value, min/max */
  quote?: Maybe<QuoteWithErrorResult>;
  /** Returns the exchange status */
  status?: Maybe<OrderStatusResult>;
  /** Returns all supported chains */
  supportedChains?: Maybe<Array<Chain>>;
  /** Returns all swaps */
  swaps?: Maybe<Swaps>;
  /** Search a token by id */
  token: Token;
  /** Search for tokens, both cex and dex. Sorted by rank, volume, chain priority, symbol. To view all, set term to empty and limit to 10000000000 */
  tokenSearch?: Maybe<Array<Token>>;
  tokenStats?: Maybe<Array<TokenStatsResult>>;
  /** Returns the list of available tokens */
  tokens?: Maybe<Array<Token>>;
  /** totalVolume stats */
  totalVolume?: Maybe<TotalVolume>;
  /** Returns the exchange status */
  trackOrder?: Maybe<TrackOrderStatus>;
  transactions?: Maybe<Array<TransactionStatus>>;
  /** Returns the usd price for the curent token */
  usdPrice?: Maybe<Scalars['Float']['output']>;
  validateAccountId?: Maybe<Scalars['Boolean']['output']>;
  wallet?: Maybe<Wallet>;
};


export type QueryAccountArgs = {
  address: Scalars['String']['input'];
};


export type QueryAccountExistsArgs = {
  inputAccount: Scalars['String']['input'];
};


export type QueryApproveArgs = {
  addressFrom: Scalars['String']['input'];
  amount: Scalars['Float']['input'];
  route: Scalars['JSONObject']['input'];
  swap: Scalars['String']['input'];
  tokenIdFrom: Scalars['String']['input'];
  tokenIdTo: Scalars['String']['input'];
  usePermit?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryChainSignaturesArgs = {
  addressFrom: Scalars['String']['input'];
  previousSignature: Scalars['String']['input'];
  route: Scalars['JSONObject']['input'];
  signatureKey: Scalars['String']['input'];
  signatureStep: Scalars['Float']['input'];
  swap: Scalars['String']['input'];
  tokenIdFrom: Scalars['String']['input'];
  tokenIdTo: Scalars['String']['input'];
};


export type QueryCheckDestinationAddressArgs = {
  address: Scalars['String']['input'];
  chainId?: InputMaybe<Scalars['Float']['input']>;
  isDex?: InputMaybe<Scalars['Boolean']['input']>;
  kind?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCheckTokenAddressesArgs = {
  addresses: Array<Scalars['String']['input']>;
  chain?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Float']['input']>;
  page?: InputMaybe<Scalars['Float']['input']>;
};


export type QueryConfigArgs = {
  key: Scalars['String']['input'];
};


export type QueryDexQuoteArgs = {
  amount: Scalars['Float']['input'];
  clientId?: InputMaybe<Scalars['String']['input']>;
  deviceInfo?: InputMaybe<Scalars['String']['input']>;
  fromAddress?: InputMaybe<Scalars['String']['input']>;
  isMobile?: InputMaybe<Scalars['Boolean']['input']>;
  partnerId?: InputMaybe<Scalars['String']['input']>;
  quoteRequestId?: InputMaybe<Scalars['String']['input']>;
  slippage?: InputMaybe<Scalars['Float']['input']>;
  toAddress?: InputMaybe<Scalars['String']['input']>;
  tokenIdFrom: Scalars['String']['input'];
  tokenIdTo: Scalars['String']['input'];
};


export type QueryEarnedHistoryArgs = {
  address: Scalars['String']['input'];
};


export type QueryGetPopularTokensArgs = {
  chain?: InputMaybe<Scalars['String']['input']>;
  days?: InputMaybe<Scalars['Float']['input']>;
  limit?: InputMaybe<Scalars['Float']['input']>;
};


export type QueryGetPrivateOrderArgs = {
  privateId: Scalars['String']['input'];
};


export type QueryGetShortUrlArgs = {
  id: Scalars['String']['input'];
};


export type QueryHistoryArgs = {
  address: Scalars['String']['input'];
};


export type QueryLaunchingListingsArgs = {
  from: Scalars['DateTimeISO']['input'];
  limit?: InputMaybe<Scalars['Float']['input']>;
  to: Scalars['DateTimeISO']['input'];
};


export type QueryMinMaxArgs = {
  anonymous: Scalars['Boolean']['input'];
  cexOnly?: InputMaybe<Scalars['Boolean']['input']>;
  from: Scalars['String']['input'];
  to: Scalars['String']['input'];
  useXmr?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryMultiStatusArgs = {
  multiId: Scalars['String']['input'];
};


export type QueryPairsArgs = {
  filters?: InputMaybe<PairFilters>;
  limit?: InputMaybe<Scalars['Float']['input']>;
  page?: InputMaybe<Scalars['Float']['input']>;
};


export type QueryPartnerUrlByNicknameArgs = {
  nickname: Scalars['String']['input'];
};


export type QueryQuoteArgs = {
  amount: Scalars['Float']['input'];
  anonymous: Scalars['Boolean']['input'];
  clientId?: InputMaybe<Scalars['String']['input']>;
  deviceInfo?: InputMaybe<Scalars['String']['input']>;
  from: Scalars['String']['input'];
  isMobile?: InputMaybe<Scalars['Boolean']['input']>;
  partnerId?: InputMaybe<Scalars['String']['input']>;
  quoteRequestId?: InputMaybe<Scalars['String']['input']>;
  to: Scalars['String']['input'];
  useXmr?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryStatusArgs = {
  id: Scalars['String']['input'];
};


export type QueryTokenArgs = {
  id: Scalars['String']['input'];
};


export type QueryTokenSearchArgs = {
  all?: InputMaybe<Scalars['Boolean']['input']>;
  chain?: InputMaybe<Scalars['String']['input']>;
  hasCex?: InputMaybe<Scalars['Boolean']['input']>;
  hasDex?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Float']['input']>;
  mainnet?: InputMaybe<Scalars['Boolean']['input']>;
  term: Scalars['String']['input'];
};


export type QueryTokenStatsArgs = {
  id: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Float']['input']>;
  resolution: Scalars['Float']['input'];
  to?: InputMaybe<Scalars['Float']['input']>;
  unit: Scalars['String']['input'];
};


export type QueryTotalVolumeArgs = {
  lastMonth?: InputMaybe<Scalars['Boolean']['input']>;
  lastWeek?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryTrackOrderArgs = {
  id: Scalars['String']['input'];
};


export type QueryTransactionsArgs = {
  id: Scalars['String']['input'];
  maker?: InputMaybe<Scalars['String']['input']>;
  page: Scalars['Float']['input'];
  pageSize: Scalars['Float']['input'];
};


export type QueryUsdPriceArgs = {
  fallbackQuote?: InputMaybe<Scalars['Boolean']['input']>;
  from: Scalars['String']['input'];
  fromDb?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryValidateAccountIdArgs = {
  address: Scalars['String']['input'];
  inputAccount: Scalars['String']['input'];
  inputAccountUrl: Scalars['String']['input'];
};

/** Quote result */
export type Quote = {
  __typename?: 'Quote';
  amountIn?: Maybe<Scalars['Float']['output']>;
  amountOut?: Maybe<Scalars['Float']['output']>;
  amountOutUsd?: Maybe<Scalars['Float']['output']>;
  duration?: Maybe<Scalars['Float']['output']>;
  inQuoteId?: Maybe<Scalars['String']['output']>;
  logoUrl?: Maybe<Scalars['String']['output']>;
  max?: Maybe<Scalars['Float']['output']>;
  min?: Maybe<Scalars['Float']['output']>;
  /** Out quote id, only for private quotes */
  outQuoteId?: Maybe<Scalars['String']['output']>;
  /** Out swap ID, only for private quotes */
  outSwap?: Maybe<Scalars['String']['output']>;
  /** Out swap name, only for private quotes */
  outSwapName?: Maybe<Scalars['String']['output']>;
  /** Unique ID for the quote. It is the same as the inQuoteId for standard quotes and the outQuoteId for private quotes */
  quoteId?: Maybe<Scalars['String']['output']>;
  swap?: Maybe<Scalars['String']['output']>;
  swapName?: Maybe<Scalars['String']['output']>;
  type?: Maybe<QuoteType>;
};

/** Exchange Status quote */
export type QuotePrice = {
  __typename?: 'QuotePrice';
  amountIn?: Maybe<Scalars['Float']['output']>;
  amountOut?: Maybe<Scalars['Float']['output']>;
  max?: Maybe<Scalars['Float']['output']>;
  min?: Maybe<Scalars['Float']['output']>;
};

export enum QuoteType {
  Dex = 'DEX',
  Private = 'PRIVATE',
  Standard = 'STANDARD'
}

/** Quote result that can also return an error */
export type QuoteWithErrorResult = {
  __typename?: 'QuoteWithErrorResult';
  error?: Maybe<ErrorResult>;
  quote?: Maybe<Quote>;
};

/** Route result */
export type Route = {
  __typename?: 'Route';
  /** Estimated Amout Out in native token out units */
  amountOut: Scalars['Float']['output'];
  /** Estimated Amout Out in USD */
  amountOutUsd?: Maybe<Scalars['Float']['output']>;
  /** Estimated Bridge Fee in USD */
  bridgeFeeUsd?: Maybe<Scalars['Float']['output']>;
  /** Duration in minutes */
  duration?: Maybe<Scalars['Float']['output']>;
  /** Error message */
  error?: Maybe<Scalars['String']['output']>;
  /** Estimated Fee in USD on the source chain using native token, not GAS */
  feeUsd?: Maybe<Scalars['Float']['output']>;
  /** Route filtered */
  filtered?: Maybe<Scalars['Boolean']['output']>;
  /** Estimated gas cost in native gas units */
  gas?: Maybe<Scalars['Float']['output']>;
  /** Estimated gas cost in USD */
  gasUsd?: Maybe<Scalars['Float']['output']>;
  /** Logo URL */
  logoUrl?: Maybe<Scalars['String']['output']>;
  /** Estimated Amout Out in USD, after deducting fees - BUT NOT GAS */
  netAmountOut?: Maybe<Scalars['Float']['output']>;
  /** Route path */
  path?: Maybe<Array<Scalars['String']['output']>>;
  /** Optional quote ID, sometimes needed by frontend adapter */
  quoteId?: Maybe<Scalars['String']['output']>;
  /** Raw data */
  raw: Scalars['JSON']['output'];
  /** Whether this route supports EIP-712 signatures for approvals */
  supportsSignatures?: Maybe<Scalars['Boolean']['output']>;
  /** Swap name */
  swap: Scalars['String']['output'];
  /** Partner Full Name, mapped from swap table */
  swapName?: Maybe<Scalars['String']['output']>;
  type?: Maybe<QuoteType>;
};

/** Route result that can also return an error */
export type RoutesWithErrorResult = {
  __typename?: 'RoutesWithErrorResult';
  error?: Maybe<ErrorResult>;
  routes?: Maybe<Array<Route>>;
};

export type ShortUrl = {
  __typename?: 'ShortUrl';
  created: Scalars['DateTimeISO']['output'];
  id: Scalars['ID']['output'];
  modified?: Maybe<Scalars['DateTimeISO']['output']>;
  swaps?: Maybe<Scalars['String']['output']>;
};

export type ShortUrlInput = {
  swaps: Scalars['String']['input'];
};

export type StakerEvent = {
  __typename?: 'StakerEvent';
  block: Scalars['Float']['output'];
  chain: Scalars['Float']['output'];
  created?: Maybe<Scalars['DateTimeISO']['output']>;
  hash: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  modified?: Maybe<Scalars['DateTimeISO']['output']>;
  name: Scalars['String']['output'];
  timestamp: Scalars['DateTimeISO']['output'];
  user: Scalars['String']['output'];
  value: Scalars['Float']['output'];
};

export type Subscription = {
  __typename?: 'Subscription';
  /** Returns available cex routes for a pair of tokens as they are resolved */
  cexQuoteSub: Array<Quote>;
  /** Returns available dex routes for a pair of tokens as they are resolved */
  dexQuoteSub: Array<Route>;
  /** Returns new order status when it changes */
  orderStatusSub: OrderStatusResult;
};


export type SubscriptionCexQuoteSubArgs = {
  anonymous?: InputMaybe<Scalars['Boolean']['input']>;
  quoteRequestIds?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type SubscriptionDexQuoteSubArgs = {
  quoteRequestIds?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type SubscriptionOrderStatusSubArgs = {
  houdiniIds: Array<Scalars['String']['input']>;
};

export type Swap = {
  __typename?: 'Swap';
  enabled?: Maybe<Scalars['Boolean']['output']>;
  /** Is this a DEX? */
  isDex?: Maybe<Scalars['Boolean']['output']>;
  logoUrl?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
};

export type SwapChain = {
  __typename?: 'SwapChain';
  chain: Scalars['String']['output'];
  manual?: Maybe<Scalars['Boolean']['output']>;
  rawData: Scalars['JSON']['output'];
  swap: Scalars['String']['output'];
};

export type SwapToken = {
  __typename?: 'SwapToken';
  chain?: Maybe<Scalars['String']['output']>;
  disabled?: Maybe<Scalars['Boolean']['output']>;
  manual?: Maybe<Scalars['Boolean']['output']>;
  rawData?: Maybe<Scalars['JSON']['output']>;
  suggested?: Maybe<Scalars['Boolean']['output']>;
  swap: Scalars['String']['output'];
  token?: Maybe<Scalars['String']['output']>;
  unmapped?: Maybe<Scalars['Boolean']['output']>;
  version?: Maybe<Scalars['Float']['output']>;
};

export type Swaps = {
  __typename?: 'Swaps';
  cexes: Array<Swap>;
  created: Scalars['DateTimeISO']['output'];
  dexes: Array<Swap>;
  id: Scalars['ID']['output'];
  modified?: Maybe<Scalars['DateTimeISO']['output']>;
};

export type Token = {
  __typename?: 'Token';
  _id: Scalars['String']['output'];
  address?: Maybe<Scalars['String']['output']>;
  /** Token Id to use for CEX quote/exchange functions */
  cexTokenId?: Maybe<Scalars['String']['output']>;
  cgId?: Maybe<Scalars['String']['output']>;
  cgRaw?: Maybe<Scalars['JSON']['output']>;
  chain: Scalars['String']['output'];
  chainData: Chain;
  change?: Maybe<Scalars['Float']['output']>;
  created: Scalars['DateTimeISO']['output'];
  decimals: Scalars['Float']['output'];
  description?: Maybe<Scalars['String']['output']>;
  enabled: Scalars['Boolean']['output'];
  fdv?: Maybe<Scalars['Float']['output']>;
  hasCex?: Maybe<Scalars['Boolean']['output']>;
  hasDex?: Maybe<Scalars['Boolean']['output']>;
  icon?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  keyword?: Maybe<Scalars['String']['output']>;
  mainnet?: Maybe<Scalars['Boolean']['output']>;
  marketCap?: Maybe<Scalars['Float']['output']>;
  modified?: Maybe<Scalars['DateTimeISO']['output']>;
  name: Scalars['String']['output'];
  price?: Maybe<Scalars['Float']['output']>;
  priority?: Maybe<Scalars['Float']['output']>;
  rank?: Maybe<Scalars['Float']['output']>;
  swapsToken?: Maybe<Array<SwapToken>>;
  symbol: Scalars['String']['output'];
  volume?: Maybe<Scalars['Float']['output']>;
};

export type TokenStatsResult = {
  __typename?: 'TokenStatsResult';
  close?: Maybe<Scalars['Float']['output']>;
  high?: Maybe<Scalars['Float']['output']>;
  low?: Maybe<Scalars['Float']['output']>;
  open?: Maybe<Scalars['Float']['output']>;
  timestamp: Scalars['DateTimeISO']['output'];
  volume?: Maybe<Scalars['Float']['output']>;
};

/** TotalVolume stats */
export type TotalVolume = {
  __typename?: 'TotalVolume';
  count?: Maybe<Scalars['Float']['output']>;
  totalBuyback?: Maybe<Scalars['Float']['output']>;
  totalBuybackUSD?: Maybe<Scalars['Float']['output']>;
  totalTransactedUSD?: Maybe<Scalars['Float']['output']>;
};

/** Track order status result */
export type TrackOrderStatus = {
  __typename?: 'TrackOrderStatus';
  anonymous?: Maybe<Scalars['Boolean']['output']>;
  /** The date and time when the order was created */
  created?: Maybe<Scalars['DateTimeISO']['output']>;
  /** ETA in minutes for usual transactions */
  eta?: Maybe<Scalars['Float']['output']>;
  /** 30 minutes from created */
  expires?: Maybe<Scalars['DateTimeISO']['output']>;
  fallbackAmount?: Maybe<Scalars['Float']['output']>;
  fallbackTokenAddress?: Maybe<Scalars['String']['output']>;
  /** Explorer url for the blockchain net */
  hashUrl?: Maybe<Scalars['String']['output']>;
  /** The unique identifier of the order */
  id: Scalars['String']['output'];
  inAmount?: Maybe<Scalars['Float']['output']>;
  inAmountUsd?: Maybe<Scalars['Float']['output']>;
  /** The date and time when the first swap result is created (new) (status 0) */
  inCreated?: Maybe<Scalars['DateTimeISO']['output']>;
  inSymbol?: Maybe<Scalars['String']['output']>;
  isDex?: Maybe<Scalars['Boolean']['output']>;
  /** The date and time when the order got updated */
  modified?: Maybe<Scalars['DateTimeISO']['output']>;
  multiId?: Maybe<Scalars['String']['output']>;
  notified?: Maybe<Scalars['Boolean']['output']>;
  outAmount?: Maybe<Scalars['Float']['output']>;
  /** The date and time when the first swap result is created when the swap is anonymous (new) (status 0) */
  outCreated?: Maybe<Scalars['DateTimeISO']['output']>;
  outSymbol?: Maybe<Scalars['String']['output']>;
  /** Where to receive the funds */
  receiverAddress?: Maybe<Scalars['String']['output']>;
  /** Destination address tag/memo */
  receiverTag?: Maybe<Scalars['String']['output']>;
  status: Scalars['Float']['output'];
  transactionHash?: Maybe<Scalars['String']['output']>;
  xmrAmountUsd?: Maybe<Scalars['Float']['output']>;
};

export type TransactionStatus = {
  __typename?: 'TransactionStatus';
  /** created date */
  created: Scalars['DateTimeISO']['output'];
  /** maker address */
  maker?: Maybe<Scalars['String']['output']>;
  /** price in wei */
  priceNumber?: Maybe<Scalars['Float']['output']>;
  /** transaction hash */
  txhash: Scalars['String']['output'];
  /** type of transaction: buy or sell */
  type: Scalars['String']['output'];
  /** token 0 amount in wei */
  volumeNumber0?: Maybe<Scalars['String']['output']>;
  /** token 1 amount in wei */
  volumeNumber1?: Maybe<Scalars['String']['output']>;
};

export type TypedDataDomain = {
  __typename?: 'TypedDataDomain';
  chainId?: Maybe<Scalars['Float']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  salt?: Maybe<Scalars['String']['output']>;
  verifyingContract?: Maybe<Scalars['String']['output']>;
  version?: Maybe<Scalars['String']['output']>;
};

export type Wallet = {
  __typename?: 'Wallet';
  address: Scalars['String']['output'];
  created?: Maybe<Scalars['DateTimeISO']['output']>;
  id: Scalars['ID']['output'];
  modified?: Maybe<Scalars['DateTimeISO']['output']>;
  nickname?: Maybe<Scalars['String']['output']>;
  referralCode?: Maybe<Scalars['String']['output']>;
  referralUrl?: Maybe<Scalars['String']['output']>;
  roles: Array<Scalars['String']['output']>;
  staked?: Maybe<Scalars['Float']['output']>;
  tierCommissionFee?: Maybe<Scalars['Float']['output']>;
  tierCommissionFeeOverride?: Maybe<Scalars['Float']['output']>;
};

/** Wallet info */
export type WalletInfo = {
  __typename?: 'WalletInfo';
  id: Scalars['String']['output'];
  referralCode?: Maybe<Scalars['String']['output']>;
  referralUrl?: Maybe<Scalars['String']['output']>;
};

/** Wallet stats */
export type WalletStats = {
  __typename?: 'WalletStats';
  count?: Maybe<Scalars['Float']['output']>;
  customTier?: Maybe<Scalars['Float']['output']>;
  fees?: Maybe<Scalars['Float']['output']>;
  value?: Maybe<Scalars['Float']['output']>;
};

export type PriceUsdQueryVariables = Exact<{ [key: string]: never; }>;


export type PriceUsdQuery = { __typename?: 'Query', priceUsd?: number | null };

export type PerformanceStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type PerformanceStatsQuery = { __typename?: 'Query', totalVolume?: { __typename?: 'TotalVolume', count?: number | null, totalTransactedUSD?: number | null, totalBuyback?: number | null, totalBuybackUSD?: number | null } | null, lastMonth?: { __typename?: 'TotalVolume', count?: number | null, totalTransactedUSD?: number | null, totalBuyback?: number | null, totalBuybackUSD?: number | null } | null, lastWeek?: { __typename?: 'TotalVolume', count?: number | null, totalTransactedUSD?: number | null, totalBuyback?: number | null, totalBuybackUSD?: number | null } | null, nextBurnAmount?: { __typename?: 'Config', value?: string | null } | null, nextBurnDate?: { __typename?: 'Config', value?: string | null } | null };

export type EarnedHistoryQueryVariables = Exact<{
  address: Scalars['String']['input'];
}>;


export type EarnedHistoryQuery = { __typename?: 'Query', earnedHistory?: Array<{ __typename?: 'EarnedStat', label: string, values: Array<number> }> | null };

export type HistoryQueryVariables = Exact<{
  address: Scalars['String']['input'];
}>;


export type HistoryQuery = { __typename?: 'Query', history?: Array<{ __typename?: 'StakerEvent', block: number, name: string, hash: string, chain: number, user: string, value: number, timestamp: string }> | null };

export type SendContactMutationVariables = Exact<{
  email: Scalars['String']['input'];
  telegram: Scalars['String']['input'];
  discord: Scalars['String']['input'];
  twitter: Scalars['String']['input'];
  website: Scalars['String']['input'];
  description: Scalars['String']['input'];
  referral: Scalars['String']['input'];
  token: Scalars['String']['input'];
  tokenChain: Scalars['String']['input'];
}>;


export type SendContactMutation = { __typename?: 'Mutation', sendContact: boolean };

export type EaseOrderMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type EaseOrderMutation = { __typename?: 'Mutation', eraseOrder?: boolean | null };

export type StatusQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type StatusQuery = { __typename?: 'Query', status?: { __typename?: 'OrderStatusResult', id?: string | null, houdiniId?: string | null, created?: string | null, modified?: string | null, senderAddress?: string | null, receiverAddress?: string | null, status: number, anonymous?: boolean | null, expires?: string | null, hashUrl?: string | null, transactionHash?: string | null, senderTag?: string | null, receiverTag?: string | null, notified?: boolean | null, nonRefundable?: boolean | null, inAmount?: number | null, inSymbol?: string | null, inCreated?: string | null, outAmount?: number | null, outSymbol?: string | null, outCreated?: string | null, eta?: number | null, inAmountUsd?: number | null, xmrAmountUsd?: number | null, multiId?: string | null, metadata?: any | null, isDex?: boolean | null, fallbackAmount?: number | null, fallbackTokenAddress?: string | null, actionRequired?: boolean | null, inStatus?: number | null, outStatus?: number | null, swapName?: string | null, outSwapName?: string | null, quote?: { __typename?: 'QuotePrice', amountIn?: number | null, amountOut?: number | null, min?: number | null, max?: number | null } | null, inToken?: { __typename?: 'Token', symbol: string, icon?: string | null, address?: string | null, decimals: number, mainnet?: boolean | null, chainData: { __typename?: 'Chain', name: string, chainId?: number | null, kind: string, addressUrl: string } } | null, outToken?: { __typename?: 'Token', symbol: string, icon?: string | null, chainData: { __typename?: 'Chain', name: string, addressUrl: string } } | null } | null };

export type OrderStatusSubscriptionSubscriptionVariables = Exact<{
  houdiniIds: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type OrderStatusSubscriptionSubscription = { __typename?: 'Subscription', orderStatusSub: { __typename?: 'OrderStatusResult', id?: string | null, houdiniId?: string | null, created?: string | null, modified?: string | null, senderAddress?: string | null, receiverAddress?: string | null, status: number, anonymous?: boolean | null, expires?: string | null, hashUrl?: string | null, transactionHash?: string | null, senderTag?: string | null, receiverTag?: string | null, notified?: boolean | null, nonRefundable?: boolean | null, inAmount?: number | null, inSymbol?: string | null, inCreated?: string | null, outAmount?: number | null, outSymbol?: string | null, outCreated?: string | null, eta?: number | null, inAmountUsd?: number | null, xmrAmountUsd?: number | null, multiId?: string | null, metadata?: any | null, isDex?: boolean | null, fallbackAmount?: number | null, fallbackTokenAddress?: string | null, actionRequired?: boolean | null, inStatus?: number | null, outStatus?: number | null, swapName?: string | null, outSwapName?: string | null, quote?: { __typename?: 'QuotePrice', amountIn?: number | null, amountOut?: number | null, min?: number | null, max?: number | null } | null, inToken?: { __typename?: 'Token', symbol: string, icon?: string | null, address?: string | null, decimals: number, mainnet?: boolean | null, chainData: { __typename?: 'Chain', name: string, chainId?: number | null, kind: string, addressUrl: string } } | null, outToken?: { __typename?: 'Token', symbol: string, icon?: string | null, chainData: { __typename?: 'Chain', name: string, addressUrl: string } } | null } };

export type MultiStatusQueryVariables = Exact<{
  multiId: Scalars['String']['input'];
}>;


export type MultiStatusQuery = { __typename?: 'Query', multiStatus?: Array<{ __typename?: 'OrderStatusResult', id?: string | null, houdiniId?: string | null, created?: string | null, modified?: string | null, senderAddress?: string | null, receiverAddress?: string | null, status: number, anonymous?: boolean | null, expires?: string | null, hashUrl?: string | null, transactionHash?: string | null, senderTag?: string | null, receiverTag?: string | null, notified?: boolean | null, nonRefundable?: boolean | null, inAmount?: number | null, inSymbol?: string | null, inCreated?: string | null, outAmount?: number | null, outSymbol?: string | null, outCreated?: string | null, eta?: number | null, inAmountUsd?: number | null, xmrAmountUsd?: number | null, multiId?: string | null, metadata?: any | null, isDex?: boolean | null, fallbackAmount?: number | null, fallbackTokenAddress?: string | null, actionRequired?: boolean | null, inStatus?: number | null, outStatus?: number | null, swapName?: string | null, outSwapName?: string | null, quote?: { __typename?: 'QuotePrice', amountIn?: number | null, amountOut?: number | null, min?: number | null, max?: number | null } | null, inToken?: { __typename?: 'Token', symbol: string, icon?: string | null, address?: string | null, decimals: number, mainnet?: boolean | null, chainData: { __typename?: 'Chain', name: string, chainId?: number | null, kind: string, addressUrl: string } } | null, outToken?: { __typename?: 'Token', symbol: string, icon?: string | null, chainData: { __typename?: 'Chain', name: string, addressUrl: string } } | null }> | null };

export type TrackOrderQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type TrackOrderQuery = { __typename?: 'Query', trackOrder?: { __typename?: 'TrackOrderStatus', id: string, created?: string | null, modified?: string | null, receiverAddress?: string | null, status: number, anonymous?: boolean | null, expires?: string | null, hashUrl?: string | null, transactionHash?: string | null, receiverTag?: string | null, notified?: boolean | null, inAmount?: number | null, inSymbol?: string | null, inCreated?: string | null, outAmount?: number | null, outSymbol?: string | null, outCreated?: string | null, eta?: number | null, inAmountUsd?: number | null, xmrAmountUsd?: number | null, multiId?: string | null, isDex?: boolean | null, fallbackAmount?: number | null, fallbackTokenAddress?: string | null } | null };

export type ConfirmTxMutationVariables = Exact<{
  id: Scalars['String']['input'];
  txHash?: InputMaybe<Scalars['String']['input']>;
}>;


export type ConfirmTxMutation = { __typename?: 'Mutation', confirmTx?: boolean | null };

export type DexExchangeMutationVariables = Exact<{
  tokenIdFrom: Scalars['String']['input'];
  tokenIdTo: Scalars['String']['input'];
  amount: Scalars['Float']['input'];
  addressFrom: Scalars['String']['input'];
  route: Scalars['JSONObject']['input'];
  addressTo: Scalars['String']['input'];
  swap: Scalars['String']['input'];
  quoteId: Scalars['String']['input'];
  walletInfo?: InputMaybe<Scalars['String']['input']>;
  deviceInfo?: InputMaybe<Scalars['String']['input']>;
  isMobile?: InputMaybe<Scalars['Boolean']['input']>;
  signatures?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  destinationTag?: InputMaybe<Scalars['String']['input']>;
}>;


export type DexExchangeMutation = { __typename?: 'Mutation', dexExchange?: { __typename?: 'OrderWithErrorResult', order?: { __typename?: 'OrderStatusResult', id?: string | null, houdiniId?: string | null, eta?: number | null, inAmountUsd?: number | null, metadata?: any | null } | null, error?: { __typename?: 'ErrorResult', requestId?: string | null, userMessage?: string | null, code?: number | null } | null } | null };

export type CexStandardExchangeMutationVariables = Exact<{
  amount: Scalars['Float']['input'];
  from: Scalars['String']['input'];
  to: Scalars['String']['input'];
  addressTo: Scalars['String']['input'];
  destinationTag?: InputMaybe<Scalars['String']['input']>;
  inQuoteId?: InputMaybe<Scalars['String']['input']>;
}>;


export type CexStandardExchangeMutation = { __typename?: 'Mutation', exchange?: { __typename?: 'OrderWithErrorResult', order?: { __typename?: 'OrderStatusResult', houdiniId?: string | null } | null, error?: { __typename?: 'ErrorResult', requestId?: string | null, userMessage?: string | null, code?: number | null } | null } | null };

export type CexPrivateExchangeMutationVariables = Exact<{
  amount: Scalars['Float']['input'];
  from: Scalars['String']['input'];
  to: Scalars['String']['input'];
  addressTo: Scalars['String']['input'];
  destinationTag?: InputMaybe<Scalars['String']['input']>;
  useXmr?: InputMaybe<Scalars['Boolean']['input']>;
  inQuoteId?: InputMaybe<Scalars['String']['input']>;
  outQuoteId?: InputMaybe<Scalars['String']['input']>;
}>;


export type CexPrivateExchangeMutation = { __typename?: 'Mutation', exchange?: { __typename?: 'OrderWithErrorResult', order?: { __typename?: 'OrderStatusResult', houdiniId?: string | null } | null, error?: { __typename?: 'ErrorResult', requestId?: string | null, userMessage?: string | null, code?: number | null } | null } | null };

export type MultiExchangeMutationVariables = Exact<{
  orders: Array<OrderInput> | OrderInput;
}>;


export type MultiExchangeMutation = { __typename?: 'Mutation', multiExchange?: Array<{ __typename?: 'OrderWithErrorResult', order?: { __typename?: 'OrderStatusResult', multiId?: string | null } | null, error?: { __typename?: 'ErrorResult', requestId?: string | null, userMessage?: string | null, code?: number | null } | null }> | null };

export type UpdateOrderWalletInfoMutationVariables = Exact<{
  walletInfo: Scalars['String']['input'];
  id: Scalars['String']['input'];
}>;


export type UpdateOrderWalletInfoMutation = { __typename?: 'Mutation', updateWalletInfo?: boolean | null };

export type GetTokenByIdQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetTokenByIdQuery = { __typename?: 'Query', token: { __typename?: 'Token', _id: string, id?: string | null, symbol: string, address?: string | null, chain: string, name: string, icon?: string | null, hasCex?: boolean | null, hasDex?: boolean | null, mainnet?: boolean | null, cexTokenId?: string | null, price?: number | null, rank?: number | null, priority?: number | null, chainData: { __typename?: 'Chain', chainId?: number | null, addressValidation?: string | null, icon?: string | null, name: string, memoNeeded?: boolean | null, kind: string, addressUrl: string, explorerUrl: string } } };

export type GetSwapTokensByIdsQueryVariables = Exact<{
  tokenInId: Scalars['String']['input'];
  tokenOutId: Scalars['String']['input'];
}>;


export type GetSwapTokensByIdsQuery = { __typename?: 'Query', tokenIn: { __typename?: 'Token', _id: string, id?: string | null, symbol: string, address?: string | null, chain: string, name: string, icon?: string | null, hasCex?: boolean | null, hasDex?: boolean | null, mainnet?: boolean | null, cexTokenId?: string | null, price?: number | null, rank?: number | null, priority?: number | null, chainData: { __typename?: 'Chain', chainId?: number | null, addressValidation?: string | null, icon?: string | null, name: string, memoNeeded?: boolean | null, kind: string, addressUrl: string, explorerUrl: string } }, tokenOut: { __typename?: 'Token', _id: string, id?: string | null, symbol: string, address?: string | null, chain: string, name: string, icon?: string | null, hasCex?: boolean | null, hasDex?: boolean | null, mainnet?: boolean | null, cexTokenId?: string | null, price?: number | null, rank?: number | null, priority?: number | null, chainData: { __typename?: 'Chain', chainId?: number | null, addressValidation?: string | null, icon?: string | null, name: string, memoNeeded?: boolean | null, kind: string, addressUrl: string, explorerUrl: string } } };

export type ApproveQueryVariables = Exact<{
  tokenIdFrom: Scalars['String']['input'];
  tokenIdTo: Scalars['String']['input'];
  addressFrom: Scalars['String']['input'];
  route: Scalars['JSONObject']['input'];
  swap: Scalars['String']['input'];
  amount: Scalars['Float']['input'];
}>;


export type ApproveQuery = { __typename?: 'Query', approve?: { __typename?: 'ApprovalResponse', approvals: Array<{ __typename?: 'ApproveTransaction', data?: string | null, to?: string | null, from?: string | null, fromChain: { __typename?: 'Chain', chainId?: number | null } }>, signatures: Array<{ __typename?: 'ApprovalTypedData', type: string, totalSteps: number, step: number, isComplete: boolean, key: string, data: { __typename?: 'EIP712TypedData', types: any, primaryType: string, message: any, domain: { __typename?: 'TypedDataDomain', name?: string | null, version?: string | null, chainId?: number | null, verifyingContract?: string | null, salt?: string | null } } }> } | null };

export type ChainSignaturesQueryVariables = Exact<{
  tokenIdFrom: Scalars['String']['input'];
  tokenIdTo: Scalars['String']['input'];
  addressFrom: Scalars['String']['input'];
  route: Scalars['JSONObject']['input'];
  swap: Scalars['String']['input'];
  previousSignature: Scalars['String']['input'];
  signatureKey: Scalars['String']['input'];
  signatureStep: Scalars['Float']['input'];
}>;


export type ChainSignaturesQuery = { __typename?: 'Query', chainSignatures: Array<{ __typename?: 'ApprovalTypedData', type: string, totalSteps: number, step: number, isComplete: boolean, key: string, data: { __typename?: 'EIP712TypedData', types: any, primaryType: string, message: any, domain: { __typename?: 'TypedDataDomain', name?: string | null, version?: string | null, chainId?: number | null, verifyingContract?: string | null, salt?: string | null } } }> };

export type GetTokenBySearchTermQueryVariables = Exact<{
  search: Scalars['String']['input'];
  hasCex?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type GetTokenBySearchTermQuery = { __typename?: 'Query', tokenSearch?: Array<{ __typename?: 'Token', _id: string, id?: string | null, symbol: string, address?: string | null, chain: string, name: string, icon?: string | null, hasCex?: boolean | null, hasDex?: boolean | null, mainnet?: boolean | null, cexTokenId?: string | null, price?: number | null, rank?: number | null, priority?: number | null, chainData: { __typename?: 'Chain', chainId?: number | null, addressValidation?: string | null, icon?: string | null, name: string, memoNeeded?: boolean | null, kind: string, addressUrl: string, explorerUrl: string } }> | null };

export type GetPopularTokensQueryVariables = Exact<{
  chain?: InputMaybe<Scalars['String']['input']>;
  days?: InputMaybe<Scalars['Float']['input']>;
  limit?: InputMaybe<Scalars['Float']['input']>;
}>;


export type GetPopularTokensQuery = { __typename?: 'Query', getPopularTokens?: Array<{ __typename?: 'Token', id?: string | null, symbol: string, address?: string | null, chain: string, name: string, icon?: string | null, cexTokenId?: string | null, rank?: number | null, priority?: number | null }> | null };

export type GetAllQuoteQueryVariables = Exact<{
  amount: Scalars['Float']['input'];
  tokenIdFrom: Scalars['String']['input'];
  tokenIdTo: Scalars['String']['input'];
  cexTokenIdFrom: Scalars['String']['input'];
  cexTokenIdTo: Scalars['String']['input'];
  clientId: Scalars['String']['input'];
  slippage?: InputMaybe<Scalars['Float']['input']>;
  toAddress?: InputMaybe<Scalars['String']['input']>;
  fromAddress?: InputMaybe<Scalars['String']['input']>;
  useXmr?: InputMaybe<Scalars['Boolean']['input']>;
  quoteRequestId?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetAllQuoteQuery = { __typename?: 'Query', dexMinMax?: Array<number> | null, standardCexMinMax?: Array<number> | null, privateCexMinMax?: Array<number> | null, dexQuote?: { __typename?: 'RoutesWithErrorResult', error?: { __typename?: 'ErrorResult', userMessage?: string | null } | null, routes?: Array<{ __typename?: 'Route', swap: string, quoteId?: string | null, path?: Array<string> | null, duration?: number | null, gas?: number | null, gasUsd?: number | null, amountOut: number, amountOutUsd?: number | null, feeUsd?: number | null, bridgeFeeUsd?: number | null, raw: any, netAmountOut?: number | null, supportsSignatures?: boolean | null, error?: string | null, swapName?: string | null, type?: QuoteType | null, filtered?: boolean | null, logoUrl?: string | null }> | null } | null, standardCexQuote?: { __typename?: 'QuoteWithErrorResult', quote?: { __typename?: 'Quote', amountIn?: number | null, amountOut?: number | null, min?: number | null, max?: number | null, duration?: number | null, amountOutUsd?: number | null, swap?: string | null, quoteId?: string | null, outSwap?: string | null, outQuoteId?: string | null, type?: QuoteType | null, swapName?: string | null, logoUrl?: string | null, inQuoteId?: string | null } | null, error?: { __typename?: 'ErrorResult', message?: string | null, type?: string | null, requestId?: string | null, userMessage?: string | null, code?: number | null } | null } | null, privateCexQuote?: { __typename?: 'QuoteWithErrorResult', quote?: { __typename?: 'Quote', amountIn?: number | null, amountOut?: number | null, min?: number | null, max?: number | null, duration?: number | null, amountOutUsd?: number | null, swap?: string | null, quoteId?: string | null, outSwap?: string | null, outQuoteId?: string | null, type?: QuoteType | null, swapName?: string | null, logoUrl?: string | null, inQuoteId?: string | null } | null, error?: { __typename?: 'ErrorResult', message?: string | null, type?: string | null, requestId?: string | null, userMessage?: string | null } | null } | null };

export type CheckDestinationAddressQueryVariables = Exact<{
  isDex: Scalars['Boolean']['input'];
  chainId: Scalars['Float']['input'];
  kind: Scalars['String']['input'];
  address: Scalars['String']['input'];
}>;


export type CheckDestinationAddressQuery = { __typename?: 'Query', checkDestinationAddress?: boolean | null };

export type GetSwapsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSwapsQuery = { __typename?: 'Query', swaps?: { __typename?: 'Swaps', dexes: Array<{ __typename?: 'Swap', name: string, isDex?: boolean | null, logoUrl?: string | null, enabled?: boolean | null }>, cexes: Array<{ __typename?: 'Swap', name: string, isDex?: boolean | null, logoUrl?: string | null, enabled?: boolean | null }> } | null };

export type DexQuoteSubscriptionSubscriptionVariables = Exact<{
  quoteRequestIds?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type DexQuoteSubscriptionSubscription = { __typename?: 'Subscription', dexQuoteSub: Array<{ __typename?: 'Route', swap: string, quoteId?: string | null, path?: Array<string> | null, duration?: number | null, gas?: number | null, gasUsd?: number | null, amountOut: number, amountOutUsd?: number | null, feeUsd?: number | null, bridgeFeeUsd?: number | null, raw: any, netAmountOut?: number | null, error?: string | null, swapName?: string | null, type?: QuoteType | null, filtered?: boolean | null, supportsSignatures?: boolean | null, logoUrl?: string | null }> };

export type CexStandardQuoteSubSubscriptionVariables = Exact<{
  anonymous?: InputMaybe<Scalars['Boolean']['input']>;
  quoteRequestIds?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type CexStandardQuoteSubSubscription = { __typename?: 'Subscription', cexQuoteSub: Array<{ __typename?: 'Quote', amountIn?: number | null, amountOut?: number | null, min?: number | null, max?: number | null, duration?: number | null, amountOutUsd?: number | null, swap?: string | null, quoteId?: string | null, outSwap?: string | null, outQuoteId?: string | null, type?: QuoteType | null, swapName?: string | null, logoUrl?: string | null, inQuoteId?: string | null }> };

export type CexPrivateQuoteSubSubscriptionVariables = Exact<{
  anonymous?: InputMaybe<Scalars['Boolean']['input']>;
  quoteRequestIds?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type CexPrivateQuoteSubSubscription = { __typename?: 'Subscription', cexQuoteSub: Array<{ __typename?: 'Quote', amountIn?: number | null, amountOut?: number | null, min?: number | null, max?: number | null, duration?: number | null, amountOutUsd?: number | null, swap?: string | null, quoteId?: string | null, outSwap?: string | null, outQuoteId?: string | null, type?: QuoteType | null, logoUrl?: string | null, inQuoteId?: string | null }> };

export type SupportedChainsQueryVariables = Exact<{ [key: string]: never; }>;


export type SupportedChainsQuery = { __typename?: 'Query', supportedChains?: Array<{ __typename?: 'Chain', id: string, name: string, shortName: string, shortNameV1: string, chainId?: number | null, kind: string, icon?: string | null, addressValidation?: string | null, tokenAddressValidation?: string | null, explorerUrl: string, addressUrl: string, enabled?: boolean | null, priority?: number | null }> | null };

export type TokenFieldsFragment = { __typename?: 'Token', _id: string, id?: string | null, symbol: string, address?: string | null, chain: string, name: string, icon?: string | null, hasCex?: boolean | null, hasDex?: boolean | null, mainnet?: boolean | null, cexTokenId?: string | null, price?: number | null, rank?: number | null, priority?: number | null, chainData: { __typename?: 'Chain', chainId?: number | null, addressValidation?: string | null, icon?: string | null, name: string, memoNeeded?: boolean | null, kind: string, addressUrl: string, explorerUrl: string } };

export type SwapsTokenFieldsFragment = { __typename?: 'Token', swapsToken?: Array<{ __typename?: 'SwapToken', swap: string, disabled?: boolean | null, token?: string | null }> | null };

export type ChainDataFieldsFragment = { __typename?: 'Token', chainData: { __typename?: 'Chain', chainId?: number | null, addressValidation?: string | null, icon?: string | null, name: string, memoNeeded?: boolean | null, kind: string, addressUrl: string, explorerUrl: string } };

export type OrderStatusFieldsFragment = { __typename?: 'OrderStatusResult', id?: string | null, houdiniId?: string | null, created?: string | null, modified?: string | null, senderAddress?: string | null, receiverAddress?: string | null, status: number, anonymous?: boolean | null, expires?: string | null, hashUrl?: string | null, transactionHash?: string | null, senderTag?: string | null, receiverTag?: string | null, notified?: boolean | null, nonRefundable?: boolean | null, inAmount?: number | null, inSymbol?: string | null, inCreated?: string | null, outAmount?: number | null, outSymbol?: string | null, outCreated?: string | null, eta?: number | null, inAmountUsd?: number | null, xmrAmountUsd?: number | null, multiId?: string | null, metadata?: any | null, isDex?: boolean | null, fallbackAmount?: number | null, fallbackTokenAddress?: string | null, actionRequired?: boolean | null, inStatus?: number | null, outStatus?: number | null, swapName?: string | null, outSwapName?: string | null, quote?: { __typename?: 'QuotePrice', amountIn?: number | null, amountOut?: number | null, min?: number | null, max?: number | null } | null, inToken?: { __typename?: 'Token', symbol: string, icon?: string | null, address?: string | null, decimals: number, mainnet?: boolean | null, chainData: { __typename?: 'Chain', name: string, chainId?: number | null, kind: string, addressUrl: string } } | null, outToken?: { __typename?: 'Token', symbol: string, icon?: string | null, chainData: { __typename?: 'Chain', name: string, addressUrl: string } } | null };

export type TrackOrderStatusFieldsFragment = { __typename?: 'TrackOrderStatus', id: string, created?: string | null, modified?: string | null, receiverAddress?: string | null, status: number, anonymous?: boolean | null, expires?: string | null, hashUrl?: string | null, transactionHash?: string | null, receiverTag?: string | null, notified?: boolean | null, inAmount?: number | null, inSymbol?: string | null, inCreated?: string | null, outAmount?: number | null, outSymbol?: string | null, outCreated?: string | null, eta?: number | null, inAmountUsd?: number | null, xmrAmountUsd?: number | null, multiId?: string | null, isDex?: boolean | null, fallbackAmount?: number | null, fallbackTokenAddress?: string | null };

export type QuoteFieldsFragment = { __typename?: 'Quote', amountIn?: number | null, amountOut?: number | null, min?: number | null, max?: number | null, duration?: number | null, amountOutUsd?: number | null, swap?: string | null, quoteId?: string | null, outSwap?: string | null, outQuoteId?: string | null, type?: QuoteType | null, swapName?: string | null, logoUrl?: string | null, inQuoteId?: string | null };

export type RouteFieldsFragment = { __typename?: 'Route', swap: string, quoteId?: string | null, path?: Array<string> | null, duration?: number | null, gas?: number | null, gasUsd?: number | null, amountOut: number, amountOutUsd?: number | null, feeUsd?: number | null, bridgeFeeUsd?: number | null, raw: any, netAmountOut?: number | null, supportsSignatures?: boolean | null, error?: string | null, swapName?: string | null, type?: QuoteType | null, filtered?: boolean | null, logoUrl?: string | null };

export type GetConfigQueryVariables = Exact<{
  key: Scalars['String']['input'];
}>;


export type GetConfigQuery = { __typename?: 'Query', config?: { __typename?: 'Config', key: string, value?: string | null, created?: string | null, modified?: string | null, id: string } | null };

export type PartnerUrlByNicknameQueryVariables = Exact<{
  nickname: Scalars['String']['input'];
}>;


export type PartnerUrlByNicknameQuery = { __typename?: 'Query', partnerUrlByNickname?: string | null };

export type TokenDataQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type TokenDataQuery = { __typename?: 'Query', token: { __typename?: 'Token', symbol: string, chain: string, name: string, icon?: string | null, cexTokenId?: string | null, price?: number | null, cgRaw?: any | null, marketCap?: number | null, volume?: number | null, change?: number | null, modified?: string | null } };

export type PairsQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Float']['input']>;
  limit?: InputMaybe<Scalars['Float']['input']>;
  filters?: InputMaybe<PairFilters>;
}>;


export type PairsQuery = { __typename?: 'Query', pairs?: { __typename?: 'Pairs', pairs?: Array<Array<{ __typename?: 'Token', symbol: string, chain: string, name: string, icon?: string | null, cexTokenId?: string | null, price?: number | null, cgRaw?: any | null, marketCap?: number | null, volume?: number | null, change?: number | null }>> | null } | null };

export const ChainDataFieldsFragmentDoc = gql`
    fragment ChainDataFields on Token {
  chainData {
    chainId
    addressValidation
    icon
    name
    memoNeeded
    kind
    addressUrl
    explorerUrl
  }
}
    `;
export const TokenFieldsFragmentDoc = gql`
    fragment TokenFields on Token {
  _id
  id
  symbol
  address
  chain
  name
  icon
  hasCex
  hasDex
  mainnet
  cexTokenId
  price
  rank
  priority
  ...ChainDataFields
}
    ${ChainDataFieldsFragmentDoc}`;
export const SwapsTokenFieldsFragmentDoc = gql`
    fragment SwapsTokenFields on Token {
  swapsToken {
    swap
    disabled
    token
  }
}
    `;
export const OrderStatusFieldsFragmentDoc = gql`
    fragment OrderStatusFields on OrderStatusResult {
  id
  houdiniId
  created
  modified
  senderAddress
  receiverAddress
  status
  anonymous
  expires
  hashUrl
  transactionHash
  senderTag
  receiverTag
  notified
  nonRefundable
  inAmount
  inSymbol
  inCreated
  outAmount
  outSymbol
  outCreated
  eta
  inAmountUsd
  xmrAmountUsd
  multiId
  quote {
    amountIn
    amountOut
    min
    max
  }
  metadata
  isDex
  fallbackAmount
  fallbackTokenAddress
  actionRequired
  inStatus
  outStatus
  swapName
  outSwapName
  inToken {
    symbol
    icon
    address
    decimals
    mainnet
    chainData {
      name
      chainId
      kind
      addressUrl
    }
  }
  outToken {
    symbol
    icon
    chainData {
      name
      addressUrl
    }
  }
}
    `;
export const TrackOrderStatusFieldsFragmentDoc = gql`
    fragment TrackOrderStatusFields on TrackOrderStatus {
  id
  created
  modified
  receiverAddress
  status
  anonymous
  expires
  hashUrl
  transactionHash
  receiverTag
  notified
  inAmount
  inSymbol
  inCreated
  outAmount
  outSymbol
  outCreated
  eta
  inAmountUsd
  xmrAmountUsd
  multiId
  isDex
  fallbackAmount
  fallbackTokenAddress
}
    `;
export const QuoteFieldsFragmentDoc = gql`
    fragment QuoteFields on Quote {
  amountIn
  amountOut
  min
  max
  duration
  amountOutUsd
  swap
  quoteId
  outSwap
  outQuoteId
  type
  swapName
  logoUrl
  inQuoteId
}
    `;
export const RouteFieldsFragmentDoc = gql`
    fragment RouteFields on Route {
  swap
  quoteId
  path
  duration
  gas
  gasUsd
  amountOut
  amountOutUsd
  feeUsd
  bridgeFeeUsd
  raw
  netAmountOut
  supportsSignatures
  error
  swapName
  type
  filtered
  supportsSignatures
  logoUrl
}
    `;
export const PriceUsdDocument = gql`
    query priceUsd {
  priceUsd
}
    `;

/**
 * __usePriceUsdQuery__
 *
 * To run a query within a React component, call `usePriceUsdQuery` and pass it any options that fit your needs.
 * When your component renders, `usePriceUsdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePriceUsdQuery({
 *   variables: {
 *   },
 * });
 */
export function usePriceUsdQuery(baseOptions?: Apollo.QueryHookOptions<PriceUsdQuery, PriceUsdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PriceUsdQuery, PriceUsdQueryVariables>(PriceUsdDocument, options);
      }
export function usePriceUsdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PriceUsdQuery, PriceUsdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PriceUsdQuery, PriceUsdQueryVariables>(PriceUsdDocument, options);
        }
export function usePriceUsdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<PriceUsdQuery, PriceUsdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<PriceUsdQuery, PriceUsdQueryVariables>(PriceUsdDocument, options);
        }
export type PriceUsdQueryHookResult = ReturnType<typeof usePriceUsdQuery>;
export type PriceUsdLazyQueryHookResult = ReturnType<typeof usePriceUsdLazyQuery>;
export type PriceUsdSuspenseQueryHookResult = ReturnType<typeof usePriceUsdSuspenseQuery>;
export type PriceUsdQueryResult = Apollo.QueryResult<PriceUsdQuery, PriceUsdQueryVariables>;
export const PerformanceStatsDocument = gql`
    query performanceStats {
  totalVolume: totalVolume {
    count
    totalTransactedUSD
    totalBuyback
    totalBuybackUSD
  }
  lastMonth: totalVolume(lastMonth: true) {
    count
    totalTransactedUSD
    totalBuyback
    totalBuybackUSD
  }
  lastWeek: totalVolume(lastWeek: true) {
    count
    totalTransactedUSD
    totalBuyback
    totalBuybackUSD
  }
  nextBurnAmount: config(key: "burn_amount") {
    value
  }
  nextBurnDate: config(key: "burn_date") {
    value
  }
}
    `;

/**
 * __usePerformanceStatsQuery__
 *
 * To run a query within a React component, call `usePerformanceStatsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePerformanceStatsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePerformanceStatsQuery({
 *   variables: {
 *   },
 * });
 */
export function usePerformanceStatsQuery(baseOptions?: Apollo.QueryHookOptions<PerformanceStatsQuery, PerformanceStatsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PerformanceStatsQuery, PerformanceStatsQueryVariables>(PerformanceStatsDocument, options);
      }
export function usePerformanceStatsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PerformanceStatsQuery, PerformanceStatsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PerformanceStatsQuery, PerformanceStatsQueryVariables>(PerformanceStatsDocument, options);
        }
export function usePerformanceStatsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<PerformanceStatsQuery, PerformanceStatsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<PerformanceStatsQuery, PerformanceStatsQueryVariables>(PerformanceStatsDocument, options);
        }
export type PerformanceStatsQueryHookResult = ReturnType<typeof usePerformanceStatsQuery>;
export type PerformanceStatsLazyQueryHookResult = ReturnType<typeof usePerformanceStatsLazyQuery>;
export type PerformanceStatsSuspenseQueryHookResult = ReturnType<typeof usePerformanceStatsSuspenseQuery>;
export type PerformanceStatsQueryResult = Apollo.QueryResult<PerformanceStatsQuery, PerformanceStatsQueryVariables>;
export const EarnedHistoryDocument = gql`
    query earnedHistory($address: String!) {
  earnedHistory(address: $address) {
    label
    values
  }
}
    `;

/**
 * __useEarnedHistoryQuery__
 *
 * To run a query within a React component, call `useEarnedHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useEarnedHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEarnedHistoryQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useEarnedHistoryQuery(baseOptions: Apollo.QueryHookOptions<EarnedHistoryQuery, EarnedHistoryQueryVariables> & ({ variables: EarnedHistoryQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EarnedHistoryQuery, EarnedHistoryQueryVariables>(EarnedHistoryDocument, options);
      }
export function useEarnedHistoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EarnedHistoryQuery, EarnedHistoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EarnedHistoryQuery, EarnedHistoryQueryVariables>(EarnedHistoryDocument, options);
        }
export function useEarnedHistorySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<EarnedHistoryQuery, EarnedHistoryQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<EarnedHistoryQuery, EarnedHistoryQueryVariables>(EarnedHistoryDocument, options);
        }
export type EarnedHistoryQueryHookResult = ReturnType<typeof useEarnedHistoryQuery>;
export type EarnedHistoryLazyQueryHookResult = ReturnType<typeof useEarnedHistoryLazyQuery>;
export type EarnedHistorySuspenseQueryHookResult = ReturnType<typeof useEarnedHistorySuspenseQuery>;
export type EarnedHistoryQueryResult = Apollo.QueryResult<EarnedHistoryQuery, EarnedHistoryQueryVariables>;
export const HistoryDocument = gql`
    query history($address: String!) {
  history(address: $address) {
    block
    name
    hash
    chain
    user
    value
    timestamp
  }
}
    `;

/**
 * __useHistoryQuery__
 *
 * To run a query within a React component, call `useHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHistoryQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useHistoryQuery(baseOptions: Apollo.QueryHookOptions<HistoryQuery, HistoryQueryVariables> & ({ variables: HistoryQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HistoryQuery, HistoryQueryVariables>(HistoryDocument, options);
      }
export function useHistoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HistoryQuery, HistoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HistoryQuery, HistoryQueryVariables>(HistoryDocument, options);
        }
export function useHistorySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<HistoryQuery, HistoryQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<HistoryQuery, HistoryQueryVariables>(HistoryDocument, options);
        }
export type HistoryQueryHookResult = ReturnType<typeof useHistoryQuery>;
export type HistoryLazyQueryHookResult = ReturnType<typeof useHistoryLazyQuery>;
export type HistorySuspenseQueryHookResult = ReturnType<typeof useHistorySuspenseQuery>;
export type HistoryQueryResult = Apollo.QueryResult<HistoryQuery, HistoryQueryVariables>;
export const SendContactDocument = gql`
    mutation sendContact($email: String!, $telegram: String!, $discord: String!, $twitter: String!, $website: String!, $description: String!, $referral: String!, $token: String!, $tokenChain: String!) {
  sendContact(
    email: $email
    telegram: $telegram
    discord: $discord
    twitter: $twitter
    website: $website
    description: $description
    referral: $referral
    token: $token
    tokenChain: $tokenChain
  )
}
    `;
export type SendContactMutationFn = Apollo.MutationFunction<SendContactMutation, SendContactMutationVariables>;

/**
 * __useSendContactMutation__
 *
 * To run a mutation, you first call `useSendContactMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendContactMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendContactMutation, { data, loading, error }] = useSendContactMutation({
 *   variables: {
 *      email: // value for 'email'
 *      telegram: // value for 'telegram'
 *      discord: // value for 'discord'
 *      twitter: // value for 'twitter'
 *      website: // value for 'website'
 *      description: // value for 'description'
 *      referral: // value for 'referral'
 *      token: // value for 'token'
 *      tokenChain: // value for 'tokenChain'
 *   },
 * });
 */
export function useSendContactMutation(baseOptions?: Apollo.MutationHookOptions<SendContactMutation, SendContactMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendContactMutation, SendContactMutationVariables>(SendContactDocument, options);
      }
export type SendContactMutationHookResult = ReturnType<typeof useSendContactMutation>;
export type SendContactMutationResult = Apollo.MutationResult<SendContactMutation>;
export type SendContactMutationOptions = Apollo.BaseMutationOptions<SendContactMutation, SendContactMutationVariables>;
export const EaseOrderDocument = gql`
    mutation easeOrder($id: String!) {
  eraseOrder(id: $id)
}
    `;
export type EaseOrderMutationFn = Apollo.MutationFunction<EaseOrderMutation, EaseOrderMutationVariables>;

/**
 * __useEaseOrderMutation__
 *
 * To run a mutation, you first call `useEaseOrderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEaseOrderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [easeOrderMutation, { data, loading, error }] = useEaseOrderMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useEaseOrderMutation(baseOptions?: Apollo.MutationHookOptions<EaseOrderMutation, EaseOrderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EaseOrderMutation, EaseOrderMutationVariables>(EaseOrderDocument, options);
      }
export type EaseOrderMutationHookResult = ReturnType<typeof useEaseOrderMutation>;
export type EaseOrderMutationResult = Apollo.MutationResult<EaseOrderMutation>;
export type EaseOrderMutationOptions = Apollo.BaseMutationOptions<EaseOrderMutation, EaseOrderMutationVariables>;
export const StatusDocument = gql`
    query Status($id: String!) {
  status(id: $id) {
    ...OrderStatusFields
  }
}
    ${OrderStatusFieldsFragmentDoc}`;

/**
 * __useStatusQuery__
 *
 * To run a query within a React component, call `useStatusQuery` and pass it any options that fit your needs.
 * When your component renders, `useStatusQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStatusQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useStatusQuery(baseOptions: Apollo.QueryHookOptions<StatusQuery, StatusQueryVariables> & ({ variables: StatusQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<StatusQuery, StatusQueryVariables>(StatusDocument, options);
      }
export function useStatusLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StatusQuery, StatusQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<StatusQuery, StatusQueryVariables>(StatusDocument, options);
        }
export function useStatusSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<StatusQuery, StatusQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<StatusQuery, StatusQueryVariables>(StatusDocument, options);
        }
export type StatusQueryHookResult = ReturnType<typeof useStatusQuery>;
export type StatusLazyQueryHookResult = ReturnType<typeof useStatusLazyQuery>;
export type StatusSuspenseQueryHookResult = ReturnType<typeof useStatusSuspenseQuery>;
export type StatusQueryResult = Apollo.QueryResult<StatusQuery, StatusQueryVariables>;
export const OrderStatusSubscriptionDocument = gql`
    subscription orderStatusSubscription($houdiniIds: [String!]!) {
  orderStatusSub(houdiniIds: $houdiniIds) {
    ...OrderStatusFields
  }
}
    ${OrderStatusFieldsFragmentDoc}`;

/**
 * __useOrderStatusSubscriptionSubscription__
 *
 * To run a query within a React component, call `useOrderStatusSubscriptionSubscription` and pass it any options that fit your needs.
 * When your component renders, `useOrderStatusSubscriptionSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrderStatusSubscriptionSubscription({
 *   variables: {
 *      houdiniIds: // value for 'houdiniIds'
 *   },
 * });
 */
export function useOrderStatusSubscriptionSubscription(baseOptions: Apollo.SubscriptionHookOptions<OrderStatusSubscriptionSubscription, OrderStatusSubscriptionSubscriptionVariables> & ({ variables: OrderStatusSubscriptionSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<OrderStatusSubscriptionSubscription, OrderStatusSubscriptionSubscriptionVariables>(OrderStatusSubscriptionDocument, options);
      }
export type OrderStatusSubscriptionSubscriptionHookResult = ReturnType<typeof useOrderStatusSubscriptionSubscription>;
export type OrderStatusSubscriptionSubscriptionResult = Apollo.SubscriptionResult<OrderStatusSubscriptionSubscription>;
export const MultiStatusDocument = gql`
    query MultiStatus($multiId: String!) {
  multiStatus(multiId: $multiId) {
    ...OrderStatusFields
  }
}
    ${OrderStatusFieldsFragmentDoc}`;

/**
 * __useMultiStatusQuery__
 *
 * To run a query within a React component, call `useMultiStatusQuery` and pass it any options that fit your needs.
 * When your component renders, `useMultiStatusQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMultiStatusQuery({
 *   variables: {
 *      multiId: // value for 'multiId'
 *   },
 * });
 */
export function useMultiStatusQuery(baseOptions: Apollo.QueryHookOptions<MultiStatusQuery, MultiStatusQueryVariables> & ({ variables: MultiStatusQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MultiStatusQuery, MultiStatusQueryVariables>(MultiStatusDocument, options);
      }
export function useMultiStatusLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MultiStatusQuery, MultiStatusQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MultiStatusQuery, MultiStatusQueryVariables>(MultiStatusDocument, options);
        }
export function useMultiStatusSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MultiStatusQuery, MultiStatusQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MultiStatusQuery, MultiStatusQueryVariables>(MultiStatusDocument, options);
        }
export type MultiStatusQueryHookResult = ReturnType<typeof useMultiStatusQuery>;
export type MultiStatusLazyQueryHookResult = ReturnType<typeof useMultiStatusLazyQuery>;
export type MultiStatusSuspenseQueryHookResult = ReturnType<typeof useMultiStatusSuspenseQuery>;
export type MultiStatusQueryResult = Apollo.QueryResult<MultiStatusQuery, MultiStatusQueryVariables>;
export const TrackOrderDocument = gql`
    query TrackOrder($id: String!) {
  trackOrder(id: $id) {
    ...TrackOrderStatusFields
  }
}
    ${TrackOrderStatusFieldsFragmentDoc}`;

/**
 * __useTrackOrderQuery__
 *
 * To run a query within a React component, call `useTrackOrderQuery` and pass it any options that fit your needs.
 * When your component renders, `useTrackOrderQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTrackOrderQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useTrackOrderQuery(baseOptions: Apollo.QueryHookOptions<TrackOrderQuery, TrackOrderQueryVariables> & ({ variables: TrackOrderQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TrackOrderQuery, TrackOrderQueryVariables>(TrackOrderDocument, options);
      }
export function useTrackOrderLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TrackOrderQuery, TrackOrderQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TrackOrderQuery, TrackOrderQueryVariables>(TrackOrderDocument, options);
        }
export function useTrackOrderSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<TrackOrderQuery, TrackOrderQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<TrackOrderQuery, TrackOrderQueryVariables>(TrackOrderDocument, options);
        }
export type TrackOrderQueryHookResult = ReturnType<typeof useTrackOrderQuery>;
export type TrackOrderLazyQueryHookResult = ReturnType<typeof useTrackOrderLazyQuery>;
export type TrackOrderSuspenseQueryHookResult = ReturnType<typeof useTrackOrderSuspenseQuery>;
export type TrackOrderQueryResult = Apollo.QueryResult<TrackOrderQuery, TrackOrderQueryVariables>;
export const ConfirmTxDocument = gql`
    mutation confirmTx($id: String!, $txHash: String) {
  confirmTx(id: $id, txHash: $txHash)
}
    `;
export type ConfirmTxMutationFn = Apollo.MutationFunction<ConfirmTxMutation, ConfirmTxMutationVariables>;

/**
 * __useConfirmTxMutation__
 *
 * To run a mutation, you first call `useConfirmTxMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useConfirmTxMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [confirmTxMutation, { data, loading, error }] = useConfirmTxMutation({
 *   variables: {
 *      id: // value for 'id'
 *      txHash: // value for 'txHash'
 *   },
 * });
 */
export function useConfirmTxMutation(baseOptions?: Apollo.MutationHookOptions<ConfirmTxMutation, ConfirmTxMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ConfirmTxMutation, ConfirmTxMutationVariables>(ConfirmTxDocument, options);
      }
export type ConfirmTxMutationHookResult = ReturnType<typeof useConfirmTxMutation>;
export type ConfirmTxMutationResult = Apollo.MutationResult<ConfirmTxMutation>;
export type ConfirmTxMutationOptions = Apollo.BaseMutationOptions<ConfirmTxMutation, ConfirmTxMutationVariables>;
export const DexExchangeDocument = gql`
    mutation dexExchange($tokenIdFrom: String!, $tokenIdTo: String!, $amount: Float!, $addressFrom: String!, $route: JSONObject!, $addressTo: String!, $swap: String!, $quoteId: String!, $walletInfo: String, $deviceInfo: String, $isMobile: Boolean, $signatures: [String!], $destinationTag: String) {
  dexExchange(
    tokenIdFrom: $tokenIdFrom
    tokenIdTo: $tokenIdTo
    amount: $amount
    addressFrom: $addressFrom
    route: $route
    addressTo: $addressTo
    swap: $swap
    quoteId: $quoteId
    walletInfo: $walletInfo
    deviceInfo: $deviceInfo
    isMobile: $isMobile
    signatures: $signatures
    destinationTag: $destinationTag
  ) {
    order {
      id
      houdiniId
      eta
      inAmountUsd
      metadata
    }
    error {
      requestId
      userMessage
      code
    }
  }
}
    `;
export type DexExchangeMutationFn = Apollo.MutationFunction<DexExchangeMutation, DexExchangeMutationVariables>;

/**
 * __useDexExchangeMutation__
 *
 * To run a mutation, you first call `useDexExchangeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDexExchangeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [dexExchangeMutation, { data, loading, error }] = useDexExchangeMutation({
 *   variables: {
 *      tokenIdFrom: // value for 'tokenIdFrom'
 *      tokenIdTo: // value for 'tokenIdTo'
 *      amount: // value for 'amount'
 *      addressFrom: // value for 'addressFrom'
 *      route: // value for 'route'
 *      addressTo: // value for 'addressTo'
 *      swap: // value for 'swap'
 *      quoteId: // value for 'quoteId'
 *      walletInfo: // value for 'walletInfo'
 *      deviceInfo: // value for 'deviceInfo'
 *      isMobile: // value for 'isMobile'
 *      signatures: // value for 'signatures'
 *      destinationTag: // value for 'destinationTag'
 *   },
 * });
 */
export function useDexExchangeMutation(baseOptions?: Apollo.MutationHookOptions<DexExchangeMutation, DexExchangeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DexExchangeMutation, DexExchangeMutationVariables>(DexExchangeDocument, options);
      }
export type DexExchangeMutationHookResult = ReturnType<typeof useDexExchangeMutation>;
export type DexExchangeMutationResult = Apollo.MutationResult<DexExchangeMutation>;
export type DexExchangeMutationOptions = Apollo.BaseMutationOptions<DexExchangeMutation, DexExchangeMutationVariables>;
export const CexStandardExchangeDocument = gql`
    mutation cexStandardExchange($amount: Float!, $from: String!, $to: String!, $addressTo: String!, $destinationTag: String, $inQuoteId: String) {
  exchange(
    amount: $amount
    from: $from
    to: $to
    addressTo: $addressTo
    anonymous: false
    destinationTag: $destinationTag
    inQuoteId: $inQuoteId
  ) {
    order {
      houdiniId
    }
    error {
      requestId
      userMessage
      code
    }
  }
}
    `;
export type CexStandardExchangeMutationFn = Apollo.MutationFunction<CexStandardExchangeMutation, CexStandardExchangeMutationVariables>;

/**
 * __useCexStandardExchangeMutation__
 *
 * To run a mutation, you first call `useCexStandardExchangeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCexStandardExchangeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cexStandardExchangeMutation, { data, loading, error }] = useCexStandardExchangeMutation({
 *   variables: {
 *      amount: // value for 'amount'
 *      from: // value for 'from'
 *      to: // value for 'to'
 *      addressTo: // value for 'addressTo'
 *      destinationTag: // value for 'destinationTag'
 *      inQuoteId: // value for 'inQuoteId'
 *   },
 * });
 */
export function useCexStandardExchangeMutation(baseOptions?: Apollo.MutationHookOptions<CexStandardExchangeMutation, CexStandardExchangeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CexStandardExchangeMutation, CexStandardExchangeMutationVariables>(CexStandardExchangeDocument, options);
      }
export type CexStandardExchangeMutationHookResult = ReturnType<typeof useCexStandardExchangeMutation>;
export type CexStandardExchangeMutationResult = Apollo.MutationResult<CexStandardExchangeMutation>;
export type CexStandardExchangeMutationOptions = Apollo.BaseMutationOptions<CexStandardExchangeMutation, CexStandardExchangeMutationVariables>;
export const CexPrivateExchangeDocument = gql`
    mutation cexPrivateExchange($amount: Float!, $from: String!, $to: String!, $addressTo: String!, $destinationTag: String, $useXmr: Boolean, $inQuoteId: String, $outQuoteId: String) {
  exchange(
    amount: $amount
    from: $from
    to: $to
    addressTo: $addressTo
    anonymous: true
    destinationTag: $destinationTag
    useXmr: $useXmr
    inQuoteId: $inQuoteId
    outQuoteId: $outQuoteId
  ) {
    order {
      houdiniId
    }
    error {
      requestId
      userMessage
      code
    }
  }
}
    `;
export type CexPrivateExchangeMutationFn = Apollo.MutationFunction<CexPrivateExchangeMutation, CexPrivateExchangeMutationVariables>;

/**
 * __useCexPrivateExchangeMutation__
 *
 * To run a mutation, you first call `useCexPrivateExchangeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCexPrivateExchangeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cexPrivateExchangeMutation, { data, loading, error }] = useCexPrivateExchangeMutation({
 *   variables: {
 *      amount: // value for 'amount'
 *      from: // value for 'from'
 *      to: // value for 'to'
 *      addressTo: // value for 'addressTo'
 *      destinationTag: // value for 'destinationTag'
 *      useXmr: // value for 'useXmr'
 *      inQuoteId: // value for 'inQuoteId'
 *      outQuoteId: // value for 'outQuoteId'
 *   },
 * });
 */
export function useCexPrivateExchangeMutation(baseOptions?: Apollo.MutationHookOptions<CexPrivateExchangeMutation, CexPrivateExchangeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CexPrivateExchangeMutation, CexPrivateExchangeMutationVariables>(CexPrivateExchangeDocument, options);
      }
export type CexPrivateExchangeMutationHookResult = ReturnType<typeof useCexPrivateExchangeMutation>;
export type CexPrivateExchangeMutationResult = Apollo.MutationResult<CexPrivateExchangeMutation>;
export type CexPrivateExchangeMutationOptions = Apollo.BaseMutationOptions<CexPrivateExchangeMutation, CexPrivateExchangeMutationVariables>;
export const MultiExchangeDocument = gql`
    mutation multiExchange($orders: [OrderInput!]!) {
  multiExchange(orders: $orders) {
    order {
      multiId
    }
    error {
      requestId
      userMessage
      code
    }
  }
}
    `;
export type MultiExchangeMutationFn = Apollo.MutationFunction<MultiExchangeMutation, MultiExchangeMutationVariables>;

/**
 * __useMultiExchangeMutation__
 *
 * To run a mutation, you first call `useMultiExchangeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMultiExchangeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [multiExchangeMutation, { data, loading, error }] = useMultiExchangeMutation({
 *   variables: {
 *      orders: // value for 'orders'
 *   },
 * });
 */
export function useMultiExchangeMutation(baseOptions?: Apollo.MutationHookOptions<MultiExchangeMutation, MultiExchangeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MultiExchangeMutation, MultiExchangeMutationVariables>(MultiExchangeDocument, options);
      }
export type MultiExchangeMutationHookResult = ReturnType<typeof useMultiExchangeMutation>;
export type MultiExchangeMutationResult = Apollo.MutationResult<MultiExchangeMutation>;
export type MultiExchangeMutationOptions = Apollo.BaseMutationOptions<MultiExchangeMutation, MultiExchangeMutationVariables>;
export const UpdateOrderWalletInfoDocument = gql`
    mutation updateOrderWalletInfo($walletInfo: String!, $id: String!) {
  updateWalletInfo(walletInfo: $walletInfo, id: $id)
}
    `;
export type UpdateOrderWalletInfoMutationFn = Apollo.MutationFunction<UpdateOrderWalletInfoMutation, UpdateOrderWalletInfoMutationVariables>;

/**
 * __useUpdateOrderWalletInfoMutation__
 *
 * To run a mutation, you first call `useUpdateOrderWalletInfoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateOrderWalletInfoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateOrderWalletInfoMutation, { data, loading, error }] = useUpdateOrderWalletInfoMutation({
 *   variables: {
 *      walletInfo: // value for 'walletInfo'
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUpdateOrderWalletInfoMutation(baseOptions?: Apollo.MutationHookOptions<UpdateOrderWalletInfoMutation, UpdateOrderWalletInfoMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateOrderWalletInfoMutation, UpdateOrderWalletInfoMutationVariables>(UpdateOrderWalletInfoDocument, options);
      }
export type UpdateOrderWalletInfoMutationHookResult = ReturnType<typeof useUpdateOrderWalletInfoMutation>;
export type UpdateOrderWalletInfoMutationResult = Apollo.MutationResult<UpdateOrderWalletInfoMutation>;
export type UpdateOrderWalletInfoMutationOptions = Apollo.BaseMutationOptions<UpdateOrderWalletInfoMutation, UpdateOrderWalletInfoMutationVariables>;
export const GetTokenByIdDocument = gql`
    query getTokenById($id: String!) {
  token(id: $id) {
    ...TokenFields
  }
}
    ${TokenFieldsFragmentDoc}`;

/**
 * __useGetTokenByIdQuery__
 *
 * To run a query within a React component, call `useGetTokenByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTokenByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTokenByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetTokenByIdQuery(baseOptions: Apollo.QueryHookOptions<GetTokenByIdQuery, GetTokenByIdQueryVariables> & ({ variables: GetTokenByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTokenByIdQuery, GetTokenByIdQueryVariables>(GetTokenByIdDocument, options);
      }
export function useGetTokenByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTokenByIdQuery, GetTokenByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTokenByIdQuery, GetTokenByIdQueryVariables>(GetTokenByIdDocument, options);
        }
export function useGetTokenByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTokenByIdQuery, GetTokenByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTokenByIdQuery, GetTokenByIdQueryVariables>(GetTokenByIdDocument, options);
        }
export type GetTokenByIdQueryHookResult = ReturnType<typeof useGetTokenByIdQuery>;
export type GetTokenByIdLazyQueryHookResult = ReturnType<typeof useGetTokenByIdLazyQuery>;
export type GetTokenByIdSuspenseQueryHookResult = ReturnType<typeof useGetTokenByIdSuspenseQuery>;
export type GetTokenByIdQueryResult = Apollo.QueryResult<GetTokenByIdQuery, GetTokenByIdQueryVariables>;
export const GetSwapTokensByIdsDocument = gql`
    query GetSwapTokensByIds($tokenInId: String!, $tokenOutId: String!) {
  tokenIn: token(id: $tokenInId) {
    ...TokenFields
  }
  tokenOut: token(id: $tokenOutId) {
    ...TokenFields
  }
}
    ${TokenFieldsFragmentDoc}`;

/**
 * __useGetSwapTokensByIdsQuery__
 *
 * To run a query within a React component, call `useGetSwapTokensByIdsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSwapTokensByIdsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSwapTokensByIdsQuery({
 *   variables: {
 *      tokenInId: // value for 'tokenInId'
 *      tokenOutId: // value for 'tokenOutId'
 *   },
 * });
 */
export function useGetSwapTokensByIdsQuery(baseOptions: Apollo.QueryHookOptions<GetSwapTokensByIdsQuery, GetSwapTokensByIdsQueryVariables> & ({ variables: GetSwapTokensByIdsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSwapTokensByIdsQuery, GetSwapTokensByIdsQueryVariables>(GetSwapTokensByIdsDocument, options);
      }
export function useGetSwapTokensByIdsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSwapTokensByIdsQuery, GetSwapTokensByIdsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSwapTokensByIdsQuery, GetSwapTokensByIdsQueryVariables>(GetSwapTokensByIdsDocument, options);
        }
export function useGetSwapTokensByIdsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSwapTokensByIdsQuery, GetSwapTokensByIdsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSwapTokensByIdsQuery, GetSwapTokensByIdsQueryVariables>(GetSwapTokensByIdsDocument, options);
        }
export type GetSwapTokensByIdsQueryHookResult = ReturnType<typeof useGetSwapTokensByIdsQuery>;
export type GetSwapTokensByIdsLazyQueryHookResult = ReturnType<typeof useGetSwapTokensByIdsLazyQuery>;
export type GetSwapTokensByIdsSuspenseQueryHookResult = ReturnType<typeof useGetSwapTokensByIdsSuspenseQuery>;
export type GetSwapTokensByIdsQueryResult = Apollo.QueryResult<GetSwapTokensByIdsQuery, GetSwapTokensByIdsQueryVariables>;
export const ApproveDocument = gql`
    query approve($tokenIdFrom: String!, $tokenIdTo: String!, $addressFrom: String!, $route: JSONObject!, $swap: String!, $amount: Float!) {
  approve(
    amount: $amount
    tokenIdFrom: $tokenIdFrom
    tokenIdTo: $tokenIdTo
    addressFrom: $addressFrom
    route: $route
    swap: $swap
  ) {
    approvals {
      data
      to
      from
      fromChain {
        chainId
      }
    }
    signatures {
      data {
        domain {
          name
          version
          chainId
          verifyingContract
          salt
        }
        types
        primaryType
        message
      }
      type
      totalSteps
      step
      isComplete
      key
    }
  }
}
    `;

/**
 * __useApproveQuery__
 *
 * To run a query within a React component, call `useApproveQuery` and pass it any options that fit your needs.
 * When your component renders, `useApproveQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useApproveQuery({
 *   variables: {
 *      tokenIdFrom: // value for 'tokenIdFrom'
 *      tokenIdTo: // value for 'tokenIdTo'
 *      addressFrom: // value for 'addressFrom'
 *      route: // value for 'route'
 *      swap: // value for 'swap'
 *      amount: // value for 'amount'
 *   },
 * });
 */
export function useApproveQuery(baseOptions: Apollo.QueryHookOptions<ApproveQuery, ApproveQueryVariables> & ({ variables: ApproveQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ApproveQuery, ApproveQueryVariables>(ApproveDocument, options);
      }
export function useApproveLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ApproveQuery, ApproveQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ApproveQuery, ApproveQueryVariables>(ApproveDocument, options);
        }
export function useApproveSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ApproveQuery, ApproveQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ApproveQuery, ApproveQueryVariables>(ApproveDocument, options);
        }
export type ApproveQueryHookResult = ReturnType<typeof useApproveQuery>;
export type ApproveLazyQueryHookResult = ReturnType<typeof useApproveLazyQuery>;
export type ApproveSuspenseQueryHookResult = ReturnType<typeof useApproveSuspenseQuery>;
export type ApproveQueryResult = Apollo.QueryResult<ApproveQuery, ApproveQueryVariables>;
export const ChainSignaturesDocument = gql`
    query chainSignatures($tokenIdFrom: String!, $tokenIdTo: String!, $addressFrom: String!, $route: JSONObject!, $swap: String!, $previousSignature: String!, $signatureKey: String!, $signatureStep: Float!) {
  chainSignatures(
    tokenIdFrom: $tokenIdFrom
    tokenIdTo: $tokenIdTo
    addressFrom: $addressFrom
    route: $route
    swap: $swap
    previousSignature: $previousSignature
    signatureKey: $signatureKey
    signatureStep: $signatureStep
  ) {
    data {
      domain {
        name
        version
        chainId
        verifyingContract
        salt
      }
      types
      primaryType
      message
    }
    type
    totalSteps
    step
    isComplete
    key
  }
}
    `;

/**
 * __useChainSignaturesQuery__
 *
 * To run a query within a React component, call `useChainSignaturesQuery` and pass it any options that fit your needs.
 * When your component renders, `useChainSignaturesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChainSignaturesQuery({
 *   variables: {
 *      tokenIdFrom: // value for 'tokenIdFrom'
 *      tokenIdTo: // value for 'tokenIdTo'
 *      addressFrom: // value for 'addressFrom'
 *      route: // value for 'route'
 *      swap: // value for 'swap'
 *      previousSignature: // value for 'previousSignature'
 *      signatureKey: // value for 'signatureKey'
 *      signatureStep: // value for 'signatureStep'
 *   },
 * });
 */
export function useChainSignaturesQuery(baseOptions: Apollo.QueryHookOptions<ChainSignaturesQuery, ChainSignaturesQueryVariables> & ({ variables: ChainSignaturesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ChainSignaturesQuery, ChainSignaturesQueryVariables>(ChainSignaturesDocument, options);
      }
export function useChainSignaturesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ChainSignaturesQuery, ChainSignaturesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ChainSignaturesQuery, ChainSignaturesQueryVariables>(ChainSignaturesDocument, options);
        }
export function useChainSignaturesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ChainSignaturesQuery, ChainSignaturesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ChainSignaturesQuery, ChainSignaturesQueryVariables>(ChainSignaturesDocument, options);
        }
export type ChainSignaturesQueryHookResult = ReturnType<typeof useChainSignaturesQuery>;
export type ChainSignaturesLazyQueryHookResult = ReturnType<typeof useChainSignaturesLazyQuery>;
export type ChainSignaturesSuspenseQueryHookResult = ReturnType<typeof useChainSignaturesSuspenseQuery>;
export type ChainSignaturesQueryResult = Apollo.QueryResult<ChainSignaturesQuery, ChainSignaturesQueryVariables>;
export const GetTokenBySearchTermDocument = gql`
    query getTokenBySearchTerm($search: String!, $hasCex: Boolean) {
  tokenSearch(term: $search, limit: 50, hasCex: $hasCex) {
    ...TokenFields
  }
}
    ${TokenFieldsFragmentDoc}`;

/**
 * __useGetTokenBySearchTermQuery__
 *
 * To run a query within a React component, call `useGetTokenBySearchTermQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTokenBySearchTermQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTokenBySearchTermQuery({
 *   variables: {
 *      search: // value for 'search'
 *      hasCex: // value for 'hasCex'
 *   },
 * });
 */
export function useGetTokenBySearchTermQuery(baseOptions: Apollo.QueryHookOptions<GetTokenBySearchTermQuery, GetTokenBySearchTermQueryVariables> & ({ variables: GetTokenBySearchTermQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTokenBySearchTermQuery, GetTokenBySearchTermQueryVariables>(GetTokenBySearchTermDocument, options);
      }
export function useGetTokenBySearchTermLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTokenBySearchTermQuery, GetTokenBySearchTermQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTokenBySearchTermQuery, GetTokenBySearchTermQueryVariables>(GetTokenBySearchTermDocument, options);
        }
export function useGetTokenBySearchTermSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTokenBySearchTermQuery, GetTokenBySearchTermQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTokenBySearchTermQuery, GetTokenBySearchTermQueryVariables>(GetTokenBySearchTermDocument, options);
        }
export type GetTokenBySearchTermQueryHookResult = ReturnType<typeof useGetTokenBySearchTermQuery>;
export type GetTokenBySearchTermLazyQueryHookResult = ReturnType<typeof useGetTokenBySearchTermLazyQuery>;
export type GetTokenBySearchTermSuspenseQueryHookResult = ReturnType<typeof useGetTokenBySearchTermSuspenseQuery>;
export type GetTokenBySearchTermQueryResult = Apollo.QueryResult<GetTokenBySearchTermQuery, GetTokenBySearchTermQueryVariables>;
export const GetPopularTokensDocument = gql`
    query getPopularTokens($chain: String = "", $days: Float = 7, $limit: Float = 20) {
  getPopularTokens(chain: $chain, days: $days, limit: $limit) {
    id
    symbol
    address
    chain
    name
    icon
    cexTokenId
    rank
    priority
  }
}
    `;

/**
 * __useGetPopularTokensQuery__
 *
 * To run a query within a React component, call `useGetPopularTokensQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPopularTokensQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPopularTokensQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *      days: // value for 'days'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetPopularTokensQuery(baseOptions?: Apollo.QueryHookOptions<GetPopularTokensQuery, GetPopularTokensQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPopularTokensQuery, GetPopularTokensQueryVariables>(GetPopularTokensDocument, options);
      }
export function useGetPopularTokensLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPopularTokensQuery, GetPopularTokensQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPopularTokensQuery, GetPopularTokensQueryVariables>(GetPopularTokensDocument, options);
        }
export function useGetPopularTokensSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPopularTokensQuery, GetPopularTokensQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPopularTokensQuery, GetPopularTokensQueryVariables>(GetPopularTokensDocument, options);
        }
export type GetPopularTokensQueryHookResult = ReturnType<typeof useGetPopularTokensQuery>;
export type GetPopularTokensLazyQueryHookResult = ReturnType<typeof useGetPopularTokensLazyQuery>;
export type GetPopularTokensSuspenseQueryHookResult = ReturnType<typeof useGetPopularTokensSuspenseQuery>;
export type GetPopularTokensQueryResult = Apollo.QueryResult<GetPopularTokensQuery, GetPopularTokensQueryVariables>;
export const GetAllQuoteDocument = gql`
    query getAllQuote($amount: Float!, $tokenIdFrom: String!, $tokenIdTo: String!, $cexTokenIdFrom: String!, $cexTokenIdTo: String!, $clientId: String!, $slippage: Float, $toAddress: String, $fromAddress: String, $useXmr: Boolean, $quoteRequestId: String) {
  dexQuote(
    quoteRequestId: $quoteRequestId
    tokenIdFrom: $tokenIdFrom
    tokenIdTo: $tokenIdTo
    amount: $amount
    clientId: $clientId
    slippage: $slippage
    toAddress: $toAddress
    fromAddress: $fromAddress
  ) {
    error {
      userMessage
    }
    routes {
      ...RouteFields
    }
  }
  dexMinMax: minMax(
    from: $tokenIdFrom
    to: $tokenIdTo
    anonymous: false
    cexOnly: false
  )
  standardCexQuote: quote(
    quoteRequestId: $quoteRequestId
    to: $cexTokenIdTo
    from: $cexTokenIdFrom
    amount: $amount
    anonymous: false
    clientId: $clientId
  ) {
    quote {
      ...QuoteFields
    }
    error {
      message
      type
      requestId
      userMessage
      code
    }
  }
  standardCexMinMax: minMax(
    from: $cexTokenIdFrom
    to: $cexTokenIdTo
    anonymous: false
    cexOnly: true
  )
  privateCexQuote: quote(
    quoteRequestId: $quoteRequestId
    to: $cexTokenIdTo
    from: $cexTokenIdFrom
    amount: $amount
    anonymous: true
    useXmr: $useXmr
    clientId: $clientId
  ) {
    quote {
      ...QuoteFields
    }
    error {
      message
      type
      requestId
      userMessage
    }
  }
  privateCexMinMax: minMax(
    from: $cexTokenIdFrom
    to: $cexTokenIdTo
    anonymous: true
    cexOnly: true
  )
}
    ${RouteFieldsFragmentDoc}
${QuoteFieldsFragmentDoc}`;

/**
 * __useGetAllQuoteQuery__
 *
 * To run a query within a React component, call `useGetAllQuoteQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllQuoteQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllQuoteQuery({
 *   variables: {
 *      amount: // value for 'amount'
 *      tokenIdFrom: // value for 'tokenIdFrom'
 *      tokenIdTo: // value for 'tokenIdTo'
 *      cexTokenIdFrom: // value for 'cexTokenIdFrom'
 *      cexTokenIdTo: // value for 'cexTokenIdTo'
 *      clientId: // value for 'clientId'
 *      slippage: // value for 'slippage'
 *      toAddress: // value for 'toAddress'
 *      fromAddress: // value for 'fromAddress'
 *      useXmr: // value for 'useXmr'
 *      quoteRequestId: // value for 'quoteRequestId'
 *   },
 * });
 */
export function useGetAllQuoteQuery(baseOptions: Apollo.QueryHookOptions<GetAllQuoteQuery, GetAllQuoteQueryVariables> & ({ variables: GetAllQuoteQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllQuoteQuery, GetAllQuoteQueryVariables>(GetAllQuoteDocument, options);
      }
export function useGetAllQuoteLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllQuoteQuery, GetAllQuoteQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllQuoteQuery, GetAllQuoteQueryVariables>(GetAllQuoteDocument, options);
        }
export function useGetAllQuoteSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllQuoteQuery, GetAllQuoteQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllQuoteQuery, GetAllQuoteQueryVariables>(GetAllQuoteDocument, options);
        }
export type GetAllQuoteQueryHookResult = ReturnType<typeof useGetAllQuoteQuery>;
export type GetAllQuoteLazyQueryHookResult = ReturnType<typeof useGetAllQuoteLazyQuery>;
export type GetAllQuoteSuspenseQueryHookResult = ReturnType<typeof useGetAllQuoteSuspenseQuery>;
export type GetAllQuoteQueryResult = Apollo.QueryResult<GetAllQuoteQuery, GetAllQuoteQueryVariables>;
export const CheckDestinationAddressDocument = gql`
    query checkDestinationAddress($isDex: Boolean!, $chainId: Float!, $kind: String!, $address: String!) {
  checkDestinationAddress(
    isDex: $isDex
    chainId: $chainId
    kind: $kind
    address: $address
  )
}
    `;

/**
 * __useCheckDestinationAddressQuery__
 *
 * To run a query within a React component, call `useCheckDestinationAddressQuery` and pass it any options that fit your needs.
 * When your component renders, `useCheckDestinationAddressQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCheckDestinationAddressQuery({
 *   variables: {
 *      isDex: // value for 'isDex'
 *      chainId: // value for 'chainId'
 *      kind: // value for 'kind'
 *      address: // value for 'address'
 *   },
 * });
 */
export function useCheckDestinationAddressQuery(baseOptions: Apollo.QueryHookOptions<CheckDestinationAddressQuery, CheckDestinationAddressQueryVariables> & ({ variables: CheckDestinationAddressQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CheckDestinationAddressQuery, CheckDestinationAddressQueryVariables>(CheckDestinationAddressDocument, options);
      }
export function useCheckDestinationAddressLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CheckDestinationAddressQuery, CheckDestinationAddressQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CheckDestinationAddressQuery, CheckDestinationAddressQueryVariables>(CheckDestinationAddressDocument, options);
        }
export function useCheckDestinationAddressSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CheckDestinationAddressQuery, CheckDestinationAddressQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CheckDestinationAddressQuery, CheckDestinationAddressQueryVariables>(CheckDestinationAddressDocument, options);
        }
export type CheckDestinationAddressQueryHookResult = ReturnType<typeof useCheckDestinationAddressQuery>;
export type CheckDestinationAddressLazyQueryHookResult = ReturnType<typeof useCheckDestinationAddressLazyQuery>;
export type CheckDestinationAddressSuspenseQueryHookResult = ReturnType<typeof useCheckDestinationAddressSuspenseQuery>;
export type CheckDestinationAddressQueryResult = Apollo.QueryResult<CheckDestinationAddressQuery, CheckDestinationAddressQueryVariables>;
export const GetSwapsDocument = gql`
    query getSwaps {
  swaps {
    dexes {
      name
      isDex
      logoUrl
      enabled
    }
    cexes {
      name
      isDex
      logoUrl
      enabled
    }
  }
}
    `;

/**
 * __useGetSwapsQuery__
 *
 * To run a query within a React component, call `useGetSwapsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSwapsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSwapsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetSwapsQuery(baseOptions?: Apollo.QueryHookOptions<GetSwapsQuery, GetSwapsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSwapsQuery, GetSwapsQueryVariables>(GetSwapsDocument, options);
      }
export function useGetSwapsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSwapsQuery, GetSwapsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSwapsQuery, GetSwapsQueryVariables>(GetSwapsDocument, options);
        }
export function useGetSwapsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSwapsQuery, GetSwapsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSwapsQuery, GetSwapsQueryVariables>(GetSwapsDocument, options);
        }
export type GetSwapsQueryHookResult = ReturnType<typeof useGetSwapsQuery>;
export type GetSwapsLazyQueryHookResult = ReturnType<typeof useGetSwapsLazyQuery>;
export type GetSwapsSuspenseQueryHookResult = ReturnType<typeof useGetSwapsSuspenseQuery>;
export type GetSwapsQueryResult = Apollo.QueryResult<GetSwapsQuery, GetSwapsQueryVariables>;
export const DexQuoteSubscriptionDocument = gql`
    subscription dexQuoteSubscription($quoteRequestIds: [String!]) {
  dexQuoteSub(quoteRequestIds: $quoteRequestIds) {
    swap
    quoteId
    path
    duration
    gas
    gasUsd
    amountOut
    amountOutUsd
    feeUsd
    bridgeFeeUsd
    raw
    netAmountOut
    error
    swapName
    type
    filtered
    supportsSignatures
    logoUrl
  }
}
    `;

/**
 * __useDexQuoteSubscriptionSubscription__
 *
 * To run a query within a React component, call `useDexQuoteSubscriptionSubscription` and pass it any options that fit your needs.
 * When your component renders, `useDexQuoteSubscriptionSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDexQuoteSubscriptionSubscription({
 *   variables: {
 *      quoteRequestIds: // value for 'quoteRequestIds'
 *   },
 * });
 */
export function useDexQuoteSubscriptionSubscription(baseOptions?: Apollo.SubscriptionHookOptions<DexQuoteSubscriptionSubscription, DexQuoteSubscriptionSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<DexQuoteSubscriptionSubscription, DexQuoteSubscriptionSubscriptionVariables>(DexQuoteSubscriptionDocument, options);
      }
export type DexQuoteSubscriptionSubscriptionHookResult = ReturnType<typeof useDexQuoteSubscriptionSubscription>;
export type DexQuoteSubscriptionSubscriptionResult = Apollo.SubscriptionResult<DexQuoteSubscriptionSubscription>;
export const CexStandardQuoteSubDocument = gql`
    subscription cexStandardQuoteSub($anonymous: Boolean = false, $quoteRequestIds: [String!]) {
  cexQuoteSub(anonymous: $anonymous, quoteRequestIds: $quoteRequestIds) {
    amountIn
    amountOut
    min
    max
    duration
    amountOutUsd
    swap
    quoteId
    outSwap
    outQuoteId
    type
    swapName
    logoUrl
    inQuoteId
  }
}
    `;

/**
 * __useCexStandardQuoteSubSubscription__
 *
 * To run a query within a React component, call `useCexStandardQuoteSubSubscription` and pass it any options that fit your needs.
 * When your component renders, `useCexStandardQuoteSubSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCexStandardQuoteSubSubscription({
 *   variables: {
 *      anonymous: // value for 'anonymous'
 *      quoteRequestIds: // value for 'quoteRequestIds'
 *   },
 * });
 */
export function useCexStandardQuoteSubSubscription(baseOptions?: Apollo.SubscriptionHookOptions<CexStandardQuoteSubSubscription, CexStandardQuoteSubSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<CexStandardQuoteSubSubscription, CexStandardQuoteSubSubscriptionVariables>(CexStandardQuoteSubDocument, options);
      }
export type CexStandardQuoteSubSubscriptionHookResult = ReturnType<typeof useCexStandardQuoteSubSubscription>;
export type CexStandardQuoteSubSubscriptionResult = Apollo.SubscriptionResult<CexStandardQuoteSubSubscription>;
export const CexPrivateQuoteSubDocument = gql`
    subscription cexPrivateQuoteSub($anonymous: Boolean = true, $quoteRequestIds: [String!]) {
  cexQuoteSub(anonymous: $anonymous, quoteRequestIds: $quoteRequestIds) {
    amountIn
    amountOut
    min
    max
    duration
    amountOutUsd
    swap
    quoteId
    outSwap
    outQuoteId
    type
    logoUrl
    inQuoteId
  }
}
    `;

/**
 * __useCexPrivateQuoteSubSubscription__
 *
 * To run a query within a React component, call `useCexPrivateQuoteSubSubscription` and pass it any options that fit your needs.
 * When your component renders, `useCexPrivateQuoteSubSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCexPrivateQuoteSubSubscription({
 *   variables: {
 *      anonymous: // value for 'anonymous'
 *      quoteRequestIds: // value for 'quoteRequestIds'
 *   },
 * });
 */
export function useCexPrivateQuoteSubSubscription(baseOptions?: Apollo.SubscriptionHookOptions<CexPrivateQuoteSubSubscription, CexPrivateQuoteSubSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<CexPrivateQuoteSubSubscription, CexPrivateQuoteSubSubscriptionVariables>(CexPrivateQuoteSubDocument, options);
      }
export type CexPrivateQuoteSubSubscriptionHookResult = ReturnType<typeof useCexPrivateQuoteSubSubscription>;
export type CexPrivateQuoteSubSubscriptionResult = Apollo.SubscriptionResult<CexPrivateQuoteSubSubscription>;
export const SupportedChainsDocument = gql`
    query supportedChains {
  supportedChains {
    id
    name
    shortName
    shortNameV1
    chainId
    kind
    icon
    addressValidation
    tokenAddressValidation
    explorerUrl
    addressUrl
    enabled
    priority
  }
}
    `;

/**
 * __useSupportedChainsQuery__
 *
 * To run a query within a React component, call `useSupportedChainsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSupportedChainsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSupportedChainsQuery({
 *   variables: {
 *   },
 * });
 */
export function useSupportedChainsQuery(baseOptions?: Apollo.QueryHookOptions<SupportedChainsQuery, SupportedChainsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SupportedChainsQuery, SupportedChainsQueryVariables>(SupportedChainsDocument, options);
      }
export function useSupportedChainsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SupportedChainsQuery, SupportedChainsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SupportedChainsQuery, SupportedChainsQueryVariables>(SupportedChainsDocument, options);
        }
export function useSupportedChainsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SupportedChainsQuery, SupportedChainsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SupportedChainsQuery, SupportedChainsQueryVariables>(SupportedChainsDocument, options);
        }
export type SupportedChainsQueryHookResult = ReturnType<typeof useSupportedChainsQuery>;
export type SupportedChainsLazyQueryHookResult = ReturnType<typeof useSupportedChainsLazyQuery>;
export type SupportedChainsSuspenseQueryHookResult = ReturnType<typeof useSupportedChainsSuspenseQuery>;
export type SupportedChainsQueryResult = Apollo.QueryResult<SupportedChainsQuery, SupportedChainsQueryVariables>;
export const GetConfigDocument = gql`
    query getConfig($key: String!) {
  config(key: $key) {
    key
    value
    created
    modified
    id
  }
}
    `;

/**
 * __useGetConfigQuery__
 *
 * To run a query within a React component, call `useGetConfigQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetConfigQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetConfigQuery({
 *   variables: {
 *      key: // value for 'key'
 *   },
 * });
 */
export function useGetConfigQuery(baseOptions: Apollo.QueryHookOptions<GetConfigQuery, GetConfigQueryVariables> & ({ variables: GetConfigQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetConfigQuery, GetConfigQueryVariables>(GetConfigDocument, options);
      }
export function useGetConfigLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetConfigQuery, GetConfigQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetConfigQuery, GetConfigQueryVariables>(GetConfigDocument, options);
        }
export function useGetConfigSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetConfigQuery, GetConfigQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetConfigQuery, GetConfigQueryVariables>(GetConfigDocument, options);
        }
export type GetConfigQueryHookResult = ReturnType<typeof useGetConfigQuery>;
export type GetConfigLazyQueryHookResult = ReturnType<typeof useGetConfigLazyQuery>;
export type GetConfigSuspenseQueryHookResult = ReturnType<typeof useGetConfigSuspenseQuery>;
export type GetConfigQueryResult = Apollo.QueryResult<GetConfigQuery, GetConfigQueryVariables>;
export const PartnerUrlByNicknameDocument = gql`
    query partnerUrlByNickname($nickname: String!) {
  partnerUrlByNickname(nickname: $nickname)
}
    `;

/**
 * __usePartnerUrlByNicknameQuery__
 *
 * To run a query within a React component, call `usePartnerUrlByNicknameQuery` and pass it any options that fit your needs.
 * When your component renders, `usePartnerUrlByNicknameQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePartnerUrlByNicknameQuery({
 *   variables: {
 *      nickname: // value for 'nickname'
 *   },
 * });
 */
export function usePartnerUrlByNicknameQuery(baseOptions: Apollo.QueryHookOptions<PartnerUrlByNicknameQuery, PartnerUrlByNicknameQueryVariables> & ({ variables: PartnerUrlByNicknameQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PartnerUrlByNicknameQuery, PartnerUrlByNicknameQueryVariables>(PartnerUrlByNicknameDocument, options);
      }
export function usePartnerUrlByNicknameLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PartnerUrlByNicknameQuery, PartnerUrlByNicknameQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PartnerUrlByNicknameQuery, PartnerUrlByNicknameQueryVariables>(PartnerUrlByNicknameDocument, options);
        }
export function usePartnerUrlByNicknameSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<PartnerUrlByNicknameQuery, PartnerUrlByNicknameQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<PartnerUrlByNicknameQuery, PartnerUrlByNicknameQueryVariables>(PartnerUrlByNicknameDocument, options);
        }
export type PartnerUrlByNicknameQueryHookResult = ReturnType<typeof usePartnerUrlByNicknameQuery>;
export type PartnerUrlByNicknameLazyQueryHookResult = ReturnType<typeof usePartnerUrlByNicknameLazyQuery>;
export type PartnerUrlByNicknameSuspenseQueryHookResult = ReturnType<typeof usePartnerUrlByNicknameSuspenseQuery>;
export type PartnerUrlByNicknameQueryResult = Apollo.QueryResult<PartnerUrlByNicknameQuery, PartnerUrlByNicknameQueryVariables>;
export const TokenDataDocument = gql`
    query tokenData($id: String!) {
  token(id: $id) {
    symbol
    chain
    name
    icon
    chain
    cexTokenId
    price
    cgRaw
    marketCap
    volume
    change
    modified
  }
}
    `;

/**
 * __useTokenDataQuery__
 *
 * To run a query within a React component, call `useTokenDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useTokenDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTokenDataQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useTokenDataQuery(baseOptions: Apollo.QueryHookOptions<TokenDataQuery, TokenDataQueryVariables> & ({ variables: TokenDataQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TokenDataQuery, TokenDataQueryVariables>(TokenDataDocument, options);
      }
export function useTokenDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TokenDataQuery, TokenDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TokenDataQuery, TokenDataQueryVariables>(TokenDataDocument, options);
        }
export function useTokenDataSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<TokenDataQuery, TokenDataQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<TokenDataQuery, TokenDataQueryVariables>(TokenDataDocument, options);
        }
export type TokenDataQueryHookResult = ReturnType<typeof useTokenDataQuery>;
export type TokenDataLazyQueryHookResult = ReturnType<typeof useTokenDataLazyQuery>;
export type TokenDataSuspenseQueryHookResult = ReturnType<typeof useTokenDataSuspenseQuery>;
export type TokenDataQueryResult = Apollo.QueryResult<TokenDataQuery, TokenDataQueryVariables>;
export const PairsDocument = gql`
    query pairs($page: Float, $limit: Float, $filters: PairFilters) {
  pairs(page: $page, limit: $limit, filters: $filters) {
    pairs {
      symbol
      chain
      name
      icon
      chain
      cexTokenId
      price
      cgRaw
      marketCap
      volume
      change
    }
  }
}
    `;

/**
 * __usePairsQuery__
 *
 * To run a query within a React component, call `usePairsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePairsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePairsQuery({
 *   variables: {
 *      page: // value for 'page'
 *      limit: // value for 'limit'
 *      filters: // value for 'filters'
 *   },
 * });
 */
export function usePairsQuery(baseOptions?: Apollo.QueryHookOptions<PairsQuery, PairsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PairsQuery, PairsQueryVariables>(PairsDocument, options);
      }
export function usePairsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PairsQuery, PairsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PairsQuery, PairsQueryVariables>(PairsDocument, options);
        }
export function usePairsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<PairsQuery, PairsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<PairsQuery, PairsQueryVariables>(PairsDocument, options);
        }
export type PairsQueryHookResult = ReturnType<typeof usePairsQuery>;
export type PairsLazyQueryHookResult = ReturnType<typeof usePairsLazyQuery>;
export type PairsSuspenseQueryHookResult = ReturnType<typeof usePairsSuspenseQuery>;
export type PairsQueryResult = Apollo.QueryResult<PairsQuery, PairsQueryVariables>;