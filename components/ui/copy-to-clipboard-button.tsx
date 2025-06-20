'use client';

import { Copy } from 'lucide-react';
import { useTranslations } from 'next-intl';
import * as React from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface CopyToClipboardButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  showText?: boolean;
  tooltipText?: string;
  onCopied?: (value: string) => void;
  variant?: 'default' | 'secondary' | 'ghost';
}

export function CopyToClipboardButton({
  value,
  showText = true,
  tooltipText,
  onCopied,
  children,
  className,
  variant,
  ...props
}: CopyToClipboardButtonProps) {
  const t = useTranslations('common');

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(value);
    toast.success(t('copied', { value }));
    onCopied?.(value);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant || 'ghost'}
            size="xs"
            className={cn('gap-1.5', className)}
            onClick={handleCopy}
            {...props}
          >
            {showText && children}
            <Copy className="text-muted-foreground h-3 w-3" />
            <span className="sr-only">{t('copyValue')}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText || t('copy')}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
