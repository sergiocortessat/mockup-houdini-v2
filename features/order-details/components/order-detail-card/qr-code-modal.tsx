'use client';

import { useTranslations } from 'next-intl';
import { QRCodeSVG } from 'qrcode.react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: string;
}

const QRCodeModal = ({ isOpen, onClose, address }: QRCodeModalProps) => {
  const t = useTranslations('orderDetails.qrCodeModal');

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center gap-6 py-4">
          <div className="overflow-hidden rounded-xl bg-white p-4">
            <QRCodeSVG value={address} size={200} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeModal;
