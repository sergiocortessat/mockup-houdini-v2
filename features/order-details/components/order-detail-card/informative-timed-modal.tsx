import { Info } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { DialogTitle } from '@/components/ui/dialog';
import { DialogHeader } from '@/components/ui/dialog';
import { Dialog } from '@/components/ui/dialog';
import { DialogContent } from '@/components/ui/dialog';

interface InformativeTimedModalProps {
  timeout?: number;
  onConfirm?: () => void;
  title?: string;
  description?: string | React.ReactNode;
  showModal?: boolean;
}

export const InformativeTimedModal = ({
  timeout = 10000,
  onConfirm,
  title,
  description,
  showModal = true,
}: InformativeTimedModalProps) => {
  const t = useTranslations('orderDetails');
  const [showTagReminder, setShowTagReminder] = useState(false);
  const [tagReminderConfirmed, setTagReminderConfirmed] = useState(false);
  const tagReminderTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!showModal) return;
    if (!tagReminderConfirmed && showModal) {
      tagReminderTimerRef.current = setTimeout(() => {
        setShowTagReminder(true);
      }, timeout);
    }
    return () => {
      if (tagReminderTimerRef.current)
        clearTimeout(tagReminderTimerRef.current);
    };
  }, [tagReminderConfirmed, timeout, showModal]);

  const handleTagReminderClose = () => {
    setShowTagReminder(false);
    if (tagReminderTimerRef.current) clearTimeout(tagReminderTimerRef.current);
    tagReminderTimerRef.current = setTimeout(() => {
      setShowTagReminder(true);
    }, timeout);
  };

  const handleTagReminderConfirm = () => {
    setTagReminderConfirmed(true);
    setShowTagReminder(false);
    if (onConfirm) onConfirm();
  };

  if (!showTagReminder || tagReminderConfirmed || !showModal) return null;

  return (
    <Dialog
      open={showTagReminder}
      onOpenChange={(open) => !open && handleTagReminderClose()}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="text-alert-warning h-10 w-10" />
            <div className="text-display-xxs">{title}</div>
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center gap-6 py-4">
          <div className="text-label-md">{description}</div>
          <Button onClick={handleTagReminderConfirm}>{t('confirm')}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InformativeTimedModal;
