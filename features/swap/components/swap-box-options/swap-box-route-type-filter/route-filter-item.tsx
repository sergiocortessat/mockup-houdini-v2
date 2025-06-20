import { ExternalLinkIcon, InfoIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { RouteFiltersType } from '@/features/swap/components/swap-box-options/types';

interface RouteFilterItemProps {
  id: string;
  label: string;
  count: number;
  checked: boolean;
  onCheckedChange: (
    checked: boolean,
    filter: RouteFiltersType | string
  ) => void;
  filterType: RouteFiltersType | string;
  tooltipTitle?: string;
  tooltipDescription?: string;
  docsUrl?: string;
  tooltipLearnMore?: string;
}

export function RouteFilterItem({
  id,
  label,
  count,
  checked,
  onCheckedChange,
  filterType,
  tooltipTitle,
  tooltipDescription,
  docsUrl,
  tooltipLearnMore,
}: RouteFilterItemProps) {
  const t = useTranslations('swap.options');
  return (
    <Label htmlFor={id} className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <InfoIcon className="text-muted-foreground hover:text-foreground h-3 w-3" />
        </TooltipTrigger>
        <TooltipContent className={tooltipDescription ? 'w-80 p-3' : undefined}>
          {tooltipDescription ? (
            <div className="space-y-2">
              <h3 className="leading-none font-medium">{tooltipTitle}</h3>
              <p className="text-muted-foreground text-sm">
                {tooltipDescription}{' '}
                {docsUrl && tooltipLearnMore && (
                  <Button
                    variant="link"
                    size="sm"
                    className="text-muted-foreground h-auto p-0"
                    asChild
                  >
                    <Link href={docsUrl} target="_blank">
                      {tooltipLearnMore}
                      <ExternalLinkIcon className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </p>
            </div>
          ) : (
            <p>{tooltipTitle}</p>
          )}
        </TooltipContent>
      </Tooltip>
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(checked) =>
          onCheckedChange(checked === true, filterType)
        }
      />
      <span className="flex items-center gap-1">
        {t(label)}
        <span className="text-muted-foreground text-xs">({count})</span>
      </span>
    </Label>
  );
}
