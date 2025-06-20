import { InfoIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface PartnerFilterItemProps {
  id: string;
  partner: string;
  count?: number;
  checked: boolean;
  onCheckedChange: (checked: boolean, partner: string) => void;
  tooltipTitle?: string;
  partnerImage?: string;
  isDisabled?: boolean;
}

export function PartnerFilterItem({
  id,
  partner,
  count,
  checked,
  onCheckedChange,
  tooltipTitle,
  partnerImage,
  isDisabled,
}: PartnerFilterItemProps) {
  const t = useTranslations('swap.options');

  return (
    <Label htmlFor={id} className="flex items-center gap-2">
      {tooltipTitle && (
        <Tooltip>
          <TooltipTrigger asChild>
            <InfoIcon className="text-muted-foreground hover:text-foreground h-3 w-3" />
          </TooltipTrigger>
          <TooltipContent>
            <p>{t(tooltipTitle)}</p>
          </TooltipContent>
        </Tooltip>
      )}
      <Checkbox
        id={id}
        checked={isDisabled ? false : checked}
        className="data-[state=unchecked]:bg-secondary data-[state=unchecked]:border-border !border-neutral-500"
        onCheckedChange={(checked) =>
          onCheckedChange(checked === true, partner)
        }
        disabled={isDisabled}
      />
      <div className="flex w-4/5 items-center justify-start gap-3">
        {partnerImage && (
          <Image src={partnerImage} alt={partner} width={20} height={20} />
        )}
        {isDisabled ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-muted-foreground/50 flex items-center gap-1">
                {partner}
                {count && (
                  <span className="text-muted-foreground text-xs">
                    ({count})
                  </span>
                )}
              </span>
            </TooltipTrigger>
            <TooltipContent className="text-label-lg max-w-[200px]">
              <p>{t('disabledTooltip', { partner })}</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <span
            className={cn(
              'flex items-center gap-1',
              !checked ? 'text-neutral-600' : 'text-white'
            )}
          >
            {partner}
            {count && (
              <span className="text-muted-foreground text-xs">({count})</span>
            )}
          </span>
        )}
      </div>
    </Label>
  );
}
