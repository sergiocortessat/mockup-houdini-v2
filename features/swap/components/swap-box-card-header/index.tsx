import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';

function SwapBoxCardHeader({
  title,
  children,
  className,
}: {
  title: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const t = useTranslations('swap');
  return (
    <>
      <div
        className={cn(
          'flex items-center justify-between gap-2 pb-2 pl-3',
          className
        )}
      >
        <h2 className="text-label-lg">{t(title)}</h2>

        {children && children}
      </div>
    </>
  );
}

export { SwapBoxCardHeader };
