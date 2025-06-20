import { useTranslations } from 'next-intl';
import { QRCodeSVG } from 'qrcode.react';

import { Button } from '@/components/ui/button';
import { CopyToClipboardButton } from '@/components/ui/copy-to-clipboard-button';
import { Input } from '@/components/ui/input';

interface ConnectedWalletViewProps {
  address: string;
  onDisconnect?: () => void;
  showDisconnectButton?: boolean;
}

export const ConnectedWalletView = ({
  address,
  onDisconnect,
  showDisconnectButton = true,
}: ConnectedWalletViewProps) => {
  const t = useTranslations('wallet');

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="relative">
        <QRCodeSVG
          value={address}
          size={200}
          className="bg-background border-border rounded-xl border p-4"
          bgColor="transparent"
          fgColor="currentColor"
        />
      </div>
      <div className="flex w-full items-center gap-2">
        <Input
          value={address}
          readOnly
          className="bg-background border-border font-mono text-sm"
        />
        <CopyToClipboardButton
          value={address}
          className="bg-background hover:bg-accent shrink-0"
        />
      </div>
      {showDisconnectButton && onDisconnect && (
        <Button
          variant="destructive"
          onClick={onDisconnect}
          className="bg-destructive text-destructive-foreground hover:bg-destructive/90 w-full"
        >
          {t('disconnectWallet')}
        </Button>
      )}
    </div>
  );
};
