import { useTranslations } from 'next-intl';
import { QRCodeSVG } from 'qrcode.react';

import { CopyToClipboardButton } from '@/components/ui/copy-to-clipboard-button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  link: string;
}

export function QRCodeModal({ isOpen, onClose, link }: QRCodeModalProps) {
  const t = useTranslations('paymentLinkGenerator');
  const tCommon = useTranslations('common');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="!text-display-xs text-center">
            {t('shareQrTitle')}
          </DialogTitle>
          <DialogDescription className="!text-body-xs text-center">
            {t('shareQrDescription')}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-6 py-4">
          <QRCodeSVG
            value={link}
            size={256}
            level="H"
            includeMargin
            className="rounded-lg"
          />
          <div className="flex w-full items-center space-x-2">
            <Input value={link} readOnly className="flex-1" />
            <CopyToClipboardButton
              value={link}
              tooltipText={tCommon('copied')}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
