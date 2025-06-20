import { Info } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const BreakdownItem = ({
  title,
  value,
  color,
  hasTooltip,
  tooltipText,
}: {
  title: string;
  value: string;
  color: string;
  hasTooltip?: boolean;
  tooltipText?: string;
}) => {
  const t = useTranslations('analytics');

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex flex-col items-start">
        <div className="text-heading-sub text-neutral-500 uppercase">
          {t(title)}
        </div>
        <div className="flex items-center">
          <div
            className="mr-2 h-6 w-0.5 rounded-full"
            style={{ backgroundColor: color }}
          />
          <div className="text-heading-lg" style={{ color: color }}>
            {value}
          </div>
        </div>
      </div>
      {hasTooltip ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="ml-2 text-neutral-500 hover:text-neutral-300"
              >
                <Info size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t(tooltipText || '')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : null}
    </div>
  );
};

export default BreakdownItem;
