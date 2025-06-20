import { generalErrorMappings } from '@/features/swap/utils/error-helpers/error-mapping/general-error-mapping';
import { ErrorMapping } from '@/features/swap/utils/error-helpers/types';

export const solanaErrorMappings: ErrorMapping[] = [
  ...generalErrorMappings,
  // Jupiter Custom Program Errors
  {
    key: 'JupiterSlippageError',
    pattern: '0x1771',
    translationKey: 'errors.solana.jupiterSlippage',
  },
  {
    key: 'JupiterLiquidityError',
    pattern: '0x1770',
    translationKey: 'errors.solana.jupiterLiquidity',
  },
  {
    key: 'JupiterRouteError',
    pattern: '0x1772',
    translationKey: 'errors.solana.jupiterRoute',
  },
  {
    key: 'WhirlpoolInvalidTickArraySequence',
    pattern: '0x1787',
    translationKey: 'errors.solana.whirlpoolInvalidTickArray',
  },

  // Common Transaction Errors
  {
    key: 'BlockhashNotFound',
    pattern: 'BlockhashNotFound',
    translationKey: 'errors.solana.blockhashNotFound',
  },
  {
    key: 'SlippageToleranceExceeded',
    pattern: 'SlippageToleranceExceeded',
    translationKey: 'errors.solana.slippageToleranceExceeded',
  },
  {
    key: 'RequireGteViolated',
    pattern: 'RequireGteViolated',
    translationKey: 'errors.solana.requireGteViolated',
  },
  {
    key: 'InvalidAccountData',
    pattern: 'InvalidAccountData',
    translationKey: 'errors.solana.invalidAccountData',
  },
  {
    key: 'InsufficientFunds',
    pattern: 'insufficient funds',
    translationKey: 'errors.solana.insufficientFunds',
  },
  {
    key: 'TokenAccountNotFound',
    pattern: 'Token account not found',
    translationKey: 'errors.solana.tokenAccountNotFound',
  },

  // Jupiter-specific Errors
  {
    key: 'RouteNotFound',
    pattern: 'Route not found',
    translationKey: 'errors.solana.routeNotFound',
  },
  {
    key: 'PriceImpactTooHigh',
    pattern: 'Price impact too high',
    translationKey: 'errors.solana.priceImpactTooHigh',
  },
  {
    key: 'InsufficientLiquidity',
    pattern: 'Insufficient liquidity',
    translationKey: 'errors.solana.insufficientLiquidity',
  },

  // Whirlpool-specific Errors
  {
    key: 'WhirlpoolInvalidAccountData',
    pattern: /whirlLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc.*InvalidAccountData/,
    translationKey: 'errors.solana.whirlpoolInvalidAccountData',
  },
  {
    key: 'WhirlpoolInsufficientFunds',
    pattern: /whirlLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc.*insufficient funds/,
    translationKey: 'errors.solana.whirlpoolInsufficientFunds',
  },
  {
    key: 'WhirlpoolOverflow',
    pattern: /whirlLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc.*overflow/,
    translationKey: 'errors.solana.whirlpoolOverflow',
  },

  // Token Program Errors
  {
    key: 'TokenProgramInvalidAccountData',
    pattern: /Program invoked: Token Program.*InvalidAccountData/,
    translationKey: 'errors.solana.tokenProgramInvalidAccountData',
  },
  {
    key: 'TokenTransferInvalidAccountData',
    pattern: /Instruction: Transfer.*InvalidAccountData/,
    translationKey: 'errors.solana.tokenTransferInvalidAccountData',
  },

  // Account-related Errors
  {
    key: 'InsufficientFundsOrTokenAccountNotFound',
    pattern: /(AccountNotInitialized|AccountNotFound|InvalidAccountOwner)/,
    translationKey: 'errors.solana.insufficientFundsOrTokenAccountNotFound',
  },
  {
    key: 'InsufficientLamports',
    pattern: 'insufficient lamports',
    translationKey: 'errors.solana.insufficientLamports',
  },
  {
    key: 'InsufficientFunds',
    pattern: 'The balance is not insufficient',
    translationKey: 'errors.solana.insufficientFunds',
  },
];
export function getSolanaCustomProgramErrorMessage(hexErrorCode: string):
  | {
      key: string;
      translationKey: string;
    }
  | undefined {
  const mapping = solanaErrorMappings.find((m) => m.pattern === hexErrorCode);
  return mapping
    ? { key: mapping.key, translationKey: mapping.translationKey }
    : undefined;
}
