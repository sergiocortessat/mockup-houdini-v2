/**
 * Application URLs configuration
 * Centralized management of all internal and external URLs
 */

// Base URLs
export const BASE_URLS = {
  SITE: 'https://houdiniswap.com',
  APP: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  GQL_HTTP:
    process.env.NEXT_PUBLIC_GQL_HTTP_URL || 'http://localhost:3000/graphql',
  GQL_WS: process.env.NEXT_PUBLIC_GQL_WS_URL || 'ws://localhost:3000/graphql',
  GQL_INTERNAL_API:
    process.env.NEXT_PUBLIC_GQL_INTERNAL_API_URL ||
    'http://localhost:3000/api/graphql',
} as const;

// Internal Routes
export const ROUTES = {
  // Navigation
  HOME: '/',
  SWAP: '/',
  STAKING: 'https://houdiniswap.com/staking-dashboard',
  ANALYTICS: '/analytics',
  ORDER_DETAILS: '/order-details',
  LOCK: {
    SOLANA: {
      houdiniSwap: '/?tokenIn=SOL&amount=1&tokenOut=LOCKSOL2',
      raydium:
        'https://raydium.io/swap/?inputMint=sol&outputMint=App2Sp9pgmQG7yD6uVaygULxALf4TpfALgnhHEkJimih',
    },
    EVM: {
      houdiniSwap: '/?tokenIn=ETH&amount=1&tokenOut=LOCKETH2',
      uniswap:
        'https://app.uniswap.org/swap?inputCurrency=ETH&outputCurrency=0x922D8563631B03C2c4cf817f4d18f6883AbA0109',
      mexc: 'https://www.mexc.com/exchange/LOCK_USDT?_from=search',
    },
    BRIDGE: {
      houdiniSwap: '/?tokenIn=LOCK&tokenOut=LOCKSOL2',
      portalBridge: 'https://portalbridge.com',
    },
  },
  // About Section
  HOW_IT_WORKS: 'https://docs.houdiniswap.com/houdini-swap',
  BLOG: 'https://blog.houdiniswap.com',
  FAQS: 'https://docs.houdiniswap.com/houdini-swap/faqs',
  API_DOCS: 'https://docs.houdiniswap.com/houdini-swap/api-documentation',
  UPCOMING_LISTINGS: 'https://houdiniswap.com/upcoming-listings',
  LISTING_APPLICATION: '/get-api-access',
  TOKEN_PAIR: '/token-pair',
  LOCK_TOKEN: '/lock-token',

  // Social Links
  TELEGRAM: 'https://t.me/houdiniswap',
  X: 'https://x.com/houdiniswap',
  MEDIUM: 'https://houdiniswap.medium.com',
  SUPPORT: 'https://t.me/HoudiniSwapSupport_bot',

  // Footer
  HOME_FOOTER: '/',
  TERMS: 'https://docs.houdiniswap.com/houdini-swap/notices/terms-of-service',
  PRIVACY: 'https://docs.houdiniswap.com/houdini-swap/policies/privacy-policy',
  FEEDBACK: 'https://wkf.ms/43PlBCt',
} as const;

export const HOUDINI_PRIVATE_PARTNER_LOGO_URL =
  '/assets/houdini-private-partner-logo.png';

// External URLs
export const EXTERNAL_URLS = {
  DISCORD: 'https://discord.gg/yourserver',
  TWITTER: 'https://twitter.com/yourhandle',
  DOCS: 'https://docs.houdiniswap.com',
  TELEGRAM_SUPPORT: 'https://t.me/HoudiniSwapSupport_bot',
  DOCS_STANDARD_SWAP:
    'https://docs.houdiniswap.com/houdini-swap/get-started/manual-send',
  DOCS_PRIVATE_SWAP:
    'https://docs.houdiniswap.com/houdini-swap/get-started/private-mode',
  DOCS_MONERO:
    'https://docs.houdiniswap.com/houdini-swap/get-started/use-monero',
} as const;

// Helper function to construct full URLs
export const getFullUrl = (path: string): string => {
  return `${BASE_URLS.APP}${path}`;
};

export const getOrderDetailsUrl = (houdiniId?: string, isMulti?: boolean) => {
  if (!houdiniId) return ROUTES.ORDER_DETAILS;
  if (isMulti) return `${ROUTES.ORDER_DETAILS}?multiId=${houdiniId}`;
  return `${ROUTES.ORDER_DETAILS}?houdiniId=${houdiniId}`;
};
