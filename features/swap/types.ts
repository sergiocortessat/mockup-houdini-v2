import { HandleWalletConnectionProps } from '@/features/wallet/constants';
import { GetAllQuoteQuery, Quote, Route, Token } from '@/graphql/generated';

export enum AllChainKind {
  ALL = 'all',
}

export enum ChainKind {
  EVM = 'evm',
  SOLANA = 'sol',
  BTC = 'bitcoin',
  SUI = 'sui',
  TRON = 'trx',
  TON = 'ton',
}

export enum RouteProtocol {
  DL = 'dl',
  WH = 'wh',
  CF = 'cf',
  RD = 'rd',
}

export enum DexExchangeStatus {
  IDLE = 'IDLE',
  APPROVING = 'APPROVING',
  SWAPPING = 'swapping',
  BROADCASTING = 'broadcasting',
  PENDING = 'pending',
  CONFIRMING = 'confirming',
  SUCCESS = 'success',
  ERROR = 'error',
}

export interface TokenCardProps {
  token: Token;
  onClick: (token: Token) => void;
  className?: string;
}
export interface SwapParams {
  tokenIn: string;
  tokenOut: string;
  amount: number;
  amountOut: number;
  isPrivate: boolean;
  useXmr: boolean;
}

export interface SwapBoxProps {
  className?: string;
  tokenInData: Token | undefined;
  tokenOutData: Token | undefined;
  amountIn: number;
  isLoading?: boolean;
  isSwapTokensLoading?: boolean;
  handleWalletConnection: (props: HandleWalletConnectionProps) => void;
  quoteRequestId: string;
}

export interface SwapInputProps {
  label: string;
  value?: string;
  onAmountChange?: (value: string) => void;
  onTokenChange?: (token: string) => void;
  token: Token;
  className?: string;
  usdPrice?: number;
  isSwapTokensLoading?: boolean;
  isBuyingInput?: boolean;
  isPrivate?: boolean;
  hideUsdPrice?: boolean;
}

export interface TokenModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (token: Token) => void;
  isPrivate?: boolean;
}

export interface TokenSearchResult {
  tokenSearch?: Token[];
}

export interface TokenModalState {
  pastSearches: Token[];
  searchTerm: string;
}

export enum RoutesListType {
  DEX = 'dexRoutes',
  STANDARD_CEX = 'standardCexRoutes',
  PRIVATE_CEX = 'privateCexRoutes',
}

export interface SelectedRoute {
  route: Route | Quote | null;
}

export enum SortOption {
  BEST = 'best',
  CHEAPEST = 'cheapest',
  QUICKEST = 'quickest',
}

export interface RoutesState {
  dexRoutes: Route[];
  standardCexRoutes: Quote[];
  privateCexRoutes: Quote[];
}

export type CombinedRoute = Quote | Route;

export enum RoutePartnerGroup {
  DEX = 'dex',
  CEX = 'cex',
}

export type RoutePartnerGroupType =
  | RoutePartnerGroup.DEX
  | RoutePartnerGroup.CEX;

export interface SwapPartner {
  name: string;
  isDex: boolean;
  logoUrl?: string;
  enabled: boolean;
}

export interface GroupPartners {
  dex: SwapPartner[];
  cex: SwapPartner[];
}

export enum SignatureType {
  SINGLE = 'single',
  CHAINED = 'chained',
}

export interface EIP712TypedData {
  domain: {
    name?: string;
    version?: string;
    chainId?: number | bigint;
    verifyingContract?: `0x${string}`;
    salt?: `0x${string}`;
  };
  types: Record<string, Array<{ name: string; type: string }>>;
  primaryType: string;
  message: Record<string, any>;
}

export interface ApprovalTypedData {
  data: EIP712TypedData;
  type: SignatureType;
  totalSteps: number;
  step: number;
  isComplete: boolean;
  key: string;
}

export interface MinMax {
  dex: GetAllQuoteQuery['dexMinMax'];
  standardCex: GetAllQuoteQuery['standardCexMinMax'];
  privateCex: GetAllQuoteQuery['privateCexMinMax'];
}

export interface SwapBoxRoutesProps {
  className?: string;
  tokenOutUsd: number;
  inAmount: number;
  inAmountUsd: number;
  refetchAllQuote: () => void;
  minMax: MinMax;
}

export interface RouteSlotProps {
  route: any;
  skeleton: any;
  isLoading: boolean;
  isPriorityRoute?: boolean;
  isInitial?: boolean;
  tokenOutUsd: number;
  inAmount: number;
  inAmountUsd: number;
  minMax?:
    | GetAllQuoteQuery['dexMinMax']
    | GetAllQuoteQuery['standardCexMinMax']
    | GetAllQuoteQuery['privateCexMinMax'];
  isBestRouteSlot?: boolean;
}

export interface RenderRouteCardByRouteTypeProps {
  route: Quote | Route;
  tokenOutUsd: number;
  inAmount: number;
  inAmountUsd: number;
  isPriorityRoute?: boolean;
  isNoAvailableRoute?: boolean;
  isInitial?: boolean;
  minMax?:
    | GetAllQuoteQuery['dexMinMax']
    | GetAllQuoteQuery['standardCexMinMax']
    | GetAllQuoteQuery['privateCexMinMax'];
  isBestRouteSlot?: boolean;
}
