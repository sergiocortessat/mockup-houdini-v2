import { BiSupport } from 'react-icons/bi';
import { BsMedium } from 'react-icons/bs';
import { FaTelegramPlane } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

import { ROUTES } from '@/constants/urls';
import { NavigationItem } from '@/types';

export const SUPPORTED_LOCALES = ['en'] as const;
export const DEFAULT_LOCALE = 'en';

export const menuItems = {
  about: [
    {
      nameKey: 'sections.about.documentation',
      href: ROUTES.HOW_IT_WORKS,
      target: '_blank',
    },
    {
      nameKey: 'sections.about.blog',
      href: ROUTES.BLOG,
      target: '_blank',
    },
    {
      nameKey: 'sections.about.faqs',
      href: ROUTES.FAQS,
      target: '_blank',
    },
    {
      nameKey: 'sections.about.apiDocs',
      href: ROUTES.API_DOCS,
      target: '_blank',
    },
    /*   {
      nameKey: 'sections.about.upcomingListings',
      href: ROUTES.UPCOMING_LISTINGS,
      target: '_blank',
    }, */
    {
      nameKey: 'sections.about.listingApplication',
      href: ROUTES.LISTING_APPLICATION,
      target: '_blank',
    },
    /*    {
        nameKey: 'sections.about.tokenPair',
        href: ROUTES.TOKEN_PAIR,
        icon: ListChecks,
      }, */
  ] as NavigationItem[],
  social: [
    {
      nameKey: 'sections.social.telegram',
      href: ROUTES.TELEGRAM,
      icon: FaTelegramPlane,
      target: '_blank',
    },
    {
      nameKey: 'sections.social.x',
      href: ROUTES.X,
      icon: FaXTwitter,
      target: '_blank',
    },
    {
      nameKey: 'sections.social.medium',
      href: ROUTES.MEDIUM,
      icon: BsMedium,
      target: '_blank',
    },
    {
      nameKey: 'sections.social.support',
      href: ROUTES.SUPPORT,
      icon: BiSupport,
      target: '_blank',
    },
  ] as NavigationItem[],

  footer: [
    {
      nameKey: 'sections.footer.home',
      href: ROUTES.HOME_FOOTER,
    },
    {
      nameKey: 'sections.footer.terms',
      href: ROUTES.TERMS,
      target: '_blank',
    },
    {
      nameKey: 'sections.footer.privacy',
      href: ROUTES.PRIVACY,
      target: '_blank',
    },
  ] as NavigationItem[],
};

export const navigationItems: NavigationItem[] = [
  {
    nameKey: 'navigation.swap',
    href: ROUTES.SWAP,
  },
  {
    nameKey: 'navigation.staking',
    href: ROUTES.STAKING,
    target: '_blank',
  },
  /*  {
    nameKey: 'navigation.analytics',
    href: ROUTES.ANALYTICS,
  }, */

  {
    nameKey: 'navigation.lock.title',
    href: '#',
    isDropdown: true,
    dropdownItems: [
      {
        title: 'navigation.lock.getLockSolana',
        items: [
          {
            name: 'HoudiniSwap',
            href: ROUTES.LOCK.SOLANA.houdiniSwap,
          },
          {
            name: 'Raydium',
            href: ROUTES.LOCK.SOLANA.raydium,
            target: '_blank',
          },
        ],
      },
      {
        title: 'navigation.lock.getLockEvm',
        items: [
          {
            name: 'HoudiniSwap',
            href: ROUTES.LOCK.EVM.houdiniSwap,
          },
          {
            name: 'Uniswap',
            href: ROUTES.LOCK.EVM.uniswap,
            target: '_blank',
          },
          {
            name: 'MEXC',
            href: ROUTES.LOCK.EVM.mexc,
            target: '_blank',
          },
        ],
      },
      {
        title: 'navigation.lock.bridge',
        items: [
          {
            name: 'HoudiniSwap',
            href: ROUTES.LOCK.BRIDGE.houdiniSwap,
          },
          {
            name: 'PortalBridge (Wormhole)',
            href: ROUTES.LOCK.BRIDGE.portalBridge,
            target: '_blank',
          },
        ],
      },
    ],
  },
];
