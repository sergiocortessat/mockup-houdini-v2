'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BuyTokenGraph from '@/features/analytics/components/token-graph';
import BuyTokenPoolData from '@/features/analytics/components/token-pool-data';
import { TOKEN, TOKEN_IDS } from '@/features/analytics/constants';

export default function BuyToken() {
  const t = useTranslations('analytics');
  const [activeToken, setActiveToken] = useState<TOKEN>(TOKEN.SOL);

  const getBuyUrl = (token: TOKEN) => {
    return `/?tokenIn=${token}&amount=1&tokenOut=${TOKEN_IDS[token]}`;
  };

  return (
    <div className="space-y-4">
      <Card className="h-full max-w-full justify-between border p-6">
        <div className="flex">
          <Tabs
            defaultValue={TOKEN.SOL}
            className="flex w-full"
            onValueChange={(value) => setActiveToken(value as TOKEN)}
          >
            <div className="flex w-full flex-col space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-heading-sm">{t('buyToken')}</h3>
                <TabsList className="grid w-[160px] grid-cols-2 rounded-full border border-neutral-800 bg-transparent p-0 px-0.5">
                  <TabsTrigger
                    value={TOKEN.SOL}
                    className="data-[state=active]:rounded-full data-[state=active]:bg-neutral-800"
                  >
                    <span className="text-label-xs md:text-label-sm">
                      {TOKEN.SOL}
                    </span>
                  </TabsTrigger>
                  <TabsTrigger
                    value={TOKEN.ETH}
                    className="data-[state=active]:rounded-full data-[state=active]:bg-neutral-800"
                  >
                    <span className="text-label-xs md:text-label-sm">
                      {TOKEN.ETH}
                    </span>
                  </TabsTrigger>
                </TabsList>
              </div>
              <BuyTokenPoolData activeToken={activeToken} />
              <BuyTokenGraph />
              <TabsContent value={activeToken} className="relative z-50">
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    href="https://houdiniswap.com/staking-dashboard"
                    target="_blank"
                  >
                    <Button
                      variant="outline"
                      className="!text-label-sm w-full bg-neutral-800 py-7 text-white hover:bg-neutral-700"
                    >
                      {t('stake')}
                    </Button>
                  </Link>
                  <Link href={getBuyUrl(activeToken)} target="_blank">
                    <Button className="!text-label-sm w-full !cursor-pointer bg-white py-7 text-black hover:bg-neutral-200">
                      {t('buyNow')}
                    </Button>
                  </Link>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </Card>
    </div>
  );
}
