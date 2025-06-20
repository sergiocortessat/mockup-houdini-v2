import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';

interface BreadCrumbProps {
  from: string;
  to: string;
  className?: string;
}

const BreadCrumb = ({ from, to, className }: BreadCrumbProps) => {
  const t = useTranslations('exchange');
  return (
    <div
      className={cn(
        'text-label-sm mb-4 flex items-center gap-x-2 text-neutral-500',
        className
      )}
    >
      <span>{t('home')}</span>
      <span>/</span>
      <span>{t('cryptoToCrypto')}</span>
      <span>/</span>
      <span>{t('exchangeFromTo', { from, to })}</span>
    </div>
  );
};

export default BreadCrumb;
