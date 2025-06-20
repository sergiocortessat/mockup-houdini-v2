import { MessageSquare } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { EXTERNAL_URLS } from '@/constants/urls';

interface OrderDetailFooterProps {
  onHelpClick?: () => void;
}

export function OrderDetailFooter({ onHelpClick }: OrderDetailFooterProps) {
  const t = useTranslations('orderDetails.footer');
  return (
    <div className="mt-6 flex flex-col items-center gap-4">
      <p className="text-label-sm text-muted-foreground text-center">
        {t('waitingForFunds')}
      </p>

      <Button variant="secondary" onClick={onHelpClick} size="lg" asChild>
        <Link href={EXTERNAL_URLS.TELEGRAM_SUPPORT} target="_blank">
          <MessageSquare size={24} />
          {t('needHelp')}
        </Link>
      </Button>
    </div>
  );
}
