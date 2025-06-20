import { useTranslations } from 'next-intl';

const PoweredByHoudiniBadge = () => {
  const t = useTranslations('swap.form');
  return (
    <div className="text-label-xs flex w-full justify-end px-2 py-4 text-neutral-500">
      {t('poweredBy')}{' '}
      <span className="ml-1 font-bold text-white">{t('houdiniSwap')}</span>
    </div>
  );
};

export default PoweredByHoudiniBadge;
