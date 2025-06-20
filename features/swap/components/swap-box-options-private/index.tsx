'use client';

import { ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { EXTERNAL_URLS } from '@/constants/urls';
import { useSwapUrlParams } from '@/features/swap/hooks/use-swap-url-params';

export function SwapBoxOptionsXMR({}: {}) {
  const t = useTranslations('swap.options');
  // get from url
  const { useXmr, setSwapParams } = useSwapUrlParams();

  const handleXmrToggle = (checked: boolean) => {
    setSwapParams({
      useXmr: checked,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between space-x-2">
        <Label htmlFor="use-monero" className="flex flex-col space-y-1">
          <span>{t('useMonero')}</span>
        </Label>
        <Switch
          id="use-xmr"
          checked={useXmr}
          onCheckedChange={handleXmrToggle}
          className="data-[state=unchecked]:bg-secondary"
        />
      </div>
      <span className="text-muted-foreground text-sm font-normal">
        {t('useMoneroDescription')}
      </span>
      <Button
        variant="link"
        size="sm"
        className="text-muted-foreground h-auto p-0 text-xs"
        asChild
      >
        <Link href={EXTERNAL_URLS.DOCS_MONERO} target="_blank">
          {t('learnMore')}
          <ExternalLink />
        </Link>
      </Button>
    </div>
  );
}
