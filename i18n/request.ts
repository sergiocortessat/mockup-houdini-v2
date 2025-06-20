import { getRequestConfig } from 'next-intl/server';

import { DEFAULT_LOCALE } from '@/constants';

export default getRequestConfig(async () => {
  const locale = DEFAULT_LOCALE;

  return {
    locale,
    messages: (await import(`../locales/${locale}.json`)).default,
  };
});
