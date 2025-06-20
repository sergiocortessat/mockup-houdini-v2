import { MoveRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

import { GraphSvg } from '@/components/Svg';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type Token = {
  icon: string;
  symbol: string;
  name: string;
  cexTokenId?: string;
};

type ExchangeBlockProps = {
  from: Token;
  to: Token;
  href?: string;
};

export default function ExchangeBlock({ from, to, href }: ExchangeBlockProps) {
  const t = useTranslations('exchange');
  const content = (
    <Card className="flex flex-col p-6">
      {/* Tokens Section */}
      <div className="mb-4 flex flex-col">
        {/* Overlapping Icons */}
        <div className="relative mb-2 h-12">
          <div className="absolute left-0 z-10">
            {from.icon && (
              <Image src={from.icon} alt={from.symbol} width={40} height={40} />
            )}
          </div>
          <div className="absolute left-6">
            {to.icon && (
              <Image src={to.icon} alt={to.symbol} width={40} height={40} />
            )}
          </div>
        </div>

        {/* Symbols */}
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center gap-1">
            <span className="text-heading-sm md:text-heading-md">
              {from.symbol}
            </span>
            <span className="text-label-xs md:text-label-sm text-gray-400">
              {from.name}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <MoveRight className="-mt-1 h-3 w-3" />
            <MoveRight className="-mt-1 h-3 w-3 rotate-180" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-heading-sm md:text-heading-md">
              {to.symbol}
            </span>
            <span className="text-label-xs md:text-label-sm text-gray-400">
              {to.name}
            </span>
          </div>
        </div>
      </div>

      <div className="border-t" />

      {/* Graph Placeholder */}
      <div className="mb-4 flex h-[120px] w-full items-center justify-center rounded-lg">
        <div className="flex h-full w-full items-center justify-center">
          <Image
            src={GraphSvg}
            alt="Graph"
            className="h-full w-full object-contain opacity-50"
          />
        </div>
      </div>

      {/* Swap Button */}
      {href ? (
        <Button asChild variant="secondary" className="w-full">
          <Link href={href}>{t('swap')}</Link>
        </Button>
      ) : (
        <Button variant="secondary" className="w-full">
          {t('swap')}
        </Button>
      )}
    </Card>
  );

  return content;
}
