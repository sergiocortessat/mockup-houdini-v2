'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';
import { NumericFormat } from 'react-number-format';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ModalTokenSelect } from '@/features/swap/components/modal-token-select';
import { Token } from '@/graphql/generated';
import { cn } from '@/lib/utils';

interface TokenAmountInputProps {
  label: string;
  value: string;
  onAmountChange: (value: string) => void;
  onTokenChange: (token: string) => void;
  token?: Token;
  isTokenLoading?: boolean;
  className?: string;
}

export function TokenAmountInput({
  label,
  value,
  onAmountChange,
  onTokenChange,
  token,
  isTokenLoading,
  className,
}: TokenAmountInputProps) {
  const t = useTranslations('paymentLinkGenerator');
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);

  const handleTokenSelect = (selectedToken: Token) => {
    setIsTokenModalOpen(false);
    if (selectedToken.cexTokenId) {
      onTokenChange(selectedToken.cexTokenId);
    }
  };

  const renderTokenSelectButton = () => {
    if (isTokenLoading) {
      return (
        <Button variant="secondary" className="h-11 px-2 lg:h-16" disabled>
          <Skeleton className="h-9 w-9 shrink-0 rounded-full lg:h-12 lg:w-12" />
          <Skeleton className="h-4 w-4" />
          <ChevronDown className="h-4 w-4 text-neutral-500" />
        </Button>
      );
    }

    return (
      <Button
        variant="ghost"
        onClick={() => setIsTokenModalOpen(true)}
        className="h-11 border px-0 md:px-4 lg:h-16"
        disabled={isTokenLoading}
      >
        {token ? (
          <>
            <Image
              src={token.icon || ''}
              alt={token.symbol}
              width={48}
              height={48}
              className="h-9 w-9 shrink-0 lg:h-12 lg:w-12"
            />
            <motion.span
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.2 }}
              className="text-label-md"
              key={token.cexTokenId}
            >
              {token.symbol}
            </motion.span>
          </>
        ) : (
          <span className="text-body-md">{t('selectToken')}</span>
        )}
        <ChevronDown className="h-4 w-4" />
      </Button>
    );
  };

  return (
    <div className={cn('rounded-xl border p-4', className)}>
      <label className="text-label-md mb-3 block">{label}</label>

      <div className="mt-1 grid grid-cols-[auto_1fr] items-center gap-3">
        {renderTokenSelectButton()}

        <div className="flex flex-col">
          <NumericFormat
            value={value}
            onValueChange={(values) => onAmountChange(values.value)}
            className="text-display-xxs w-full border-none bg-transparent text-right outline-none"
            placeholder="0.00"
            thousandSeparator=","
            decimalSeparator="."
            allowNegative={false}
          />
          {token?.price && (
            <span className="text-label-sm text-right text-neutral-500">
              ${(Number(value) * (token.price || 0)).toFixed(2)}
            </span>
          )}
        </div>
      </div>

      {isTokenModalOpen && (
        <ModalTokenSelect
          open={isTokenModalOpen}
          onOpenChange={setIsTokenModalOpen}
          onSelect={handleTokenSelect}
        />
      )}
    </div>
  );
}
