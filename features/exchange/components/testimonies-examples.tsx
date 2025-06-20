import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

import {
  ArbitrumArbLogoSvg,
  AvalancheAvaxLogoSvg,
  OptimismEthereumOpLogoSvg,
  PolkadotNewDotLogoSvg,
  ThorchainRuneLogoSvg,
  ToncoinTonLogoSvg,
} from '@/components/Svg';
import renderMessageWithLinks from '@/features/exchange/utils/render-message-with-links';
import { cn } from '@/lib/utils';

type TestimoniesProps = { className?: string };

export default function Testimonies({ className }: TestimoniesProps) {
  const t = useTranslations('exchange');

  const testimonies = [
    {
      message: t('laasBusinessTestimonySliceMessage_1'),
      icon: (
        <Image src={ArbitrumArbLogoSvg} alt="Arbitrum" width={48} height={48} />
      ),
      name: 'Arbitrum',
      channel: 'arbitrum',
      website: 'https://arbitrum.io',
    },
    {
      message: t('laasBusinessTestimonySliceMessage_2'),
      icon: (
        <Image
          src={AvalancheAvaxLogoSvg}
          alt="Avalanche"
          width={48}
          height={48}
        />
      ),
      name: 'Avalanche',
      channel: 'avax',
      website: 'https://www.avax.network',
    },
    {
      message: t('laasBusinessTestimonySliceMessage_3'),
      icon: <Image src={ToncoinTonLogoSvg} alt="Ton" width={48} height={48} />,
      name: 'Ton',
      channel: 'ton_blockchain',
      website: 'https://ton.tg',
    },
    {
      message: t('laasBusinessTestimonySliceMessage_4'),
      icon: (
        <Image
          src={OptimismEthereumOpLogoSvg}
          alt="Optimism"
          width={48}
          height={48}
        />
      ),
      name: 'Optimism',
      channel: 'optimism',
      website: 'https://www.optimism.io',
    },
    {
      message: t('laasBusinessTestimonySliceMessage_5'),
      icon: (
        <Image
          src={PolkadotNewDotLogoSvg}
          alt="Polkadot"
          width={48}
          height={48}
        />
      ),
      name: 'Polkadot',
      channel: 'polkadot',
      website: 'https://polkadot.network',
    },
    {
      message: t('laasBusinessTestimonySliceMessage_6'),
      icon: (
        <Image
          src={ThorchainRuneLogoSvg}
          alt="Thorchain"
          width={48}
          height={48}
        />
      ),
      name: 'THORChain',
      channel: 'thorchain',
      website: 'https://thorchain.org',
    },
  ].map(({ message, ...item }) => {
    // Replace newlines with spaces
    message = message.replaceAll('\n', ' ');
    return { ...item, message };
  });

  return (
    <div className={cn('mt-16', className)}>
      <h2 className="text-display-xxs md:text-display-xs text-center tracking-tight md:text-left">
        {t('testimonialsTitle')}
      </h2>
      <div className="relative left-1/2 -ml-[50vw] w-screen md:left-0 md:ml-0 md:w-full">
        <div className="flex gap-4 overflow-x-auto px-4 py-10 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
          {testimonies.map(
            ({ message, icon, name, channel, website }, _key) => (
              <div
                key={_key}
                className="mb-6 flex w-[90%] flex-none flex-col gap-6 rounded-[24px] border border-[#1C1E22] p-6 text-left md:mb-0 md:w-full"
              >
                <div className="flex h-12 items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1C1E22]">
                    {icon}
                  </div>
                  <div className="flex min-w-0 flex-col justify-center">
                    <Link
                      target="_blank"
                      href={website}
                      className="truncate font-medium text-white hover:text-gray-300"
                    >
                      {name}
                    </Link>
                    <Link
                      target="_blank"
                      href={`https://x.com/${channel}`}
                      className="truncate text-sm text-gray-500 hover:text-gray-400"
                    >{`@${channel}`}</Link>
                  </div>
                </div>
                <p className="text-label-sm md:text-label-md text-gray-300 [&_a]:text-blue-400 [&_a]:underline [&_a:hover]:no-underline">
                  {renderMessageWithLinks(message)}
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
