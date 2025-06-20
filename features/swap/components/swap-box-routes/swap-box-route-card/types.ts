import { GetAllQuoteQuery, QuoteType } from '@/graphql/generated';

export type ProtocolType = QuoteType | string;

export interface SwapBoxRouteCardProps {
  amountOut: number;
  protocol: ProtocolType;
  routeId: string;
  tokenOutUsd: number;
  gasFeeUsd?: number | null;
  duration?: number | null;
  swapAggregator?: string;
  swapName?: string | null;
  path?: string;
  isDisabled?: boolean;
  inAmount: number;
  inAmountUsd: number;
  netOutAmount: number;
  netOutAmountUsd: number;
  isFiltered?: boolean | null;
  isNoAvailableRoute?: boolean;
  isInitial?: boolean;
  isPriorityRoute?: boolean;
  partnerLogoUrl?: string | null;
  minMax?:
    | GetAllQuoteQuery['dexMinMax']
    | GetAllQuoteQuery['standardCexMinMax']
    | GetAllQuoteQuery['privateCexMinMax'];
  isBestRouteSlot?: boolean;
  quoteType: QuoteType | string;
}

export interface RouteInfoProps {
  gasFeeUsd?: number | null;
  duration?: number | null;
  isSkeleton?: boolean;
}

export interface InfoTooltipProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
}

export interface AmountDisplayProps {
  amountOut: number;
  netOutAmount: number;
  isSkeleton?: boolean;
}

export interface ProtocolBadgeProps {
  protocol: ProtocolType;
  swapAggregator?: string;
  swapName?: string | null;
  path?: string;
  isFiltered?: boolean;
  isPriorityRoute?: boolean;
  isBestRouteSlot?: boolean;
}
