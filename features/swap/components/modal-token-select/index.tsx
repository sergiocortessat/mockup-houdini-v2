'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ModalContent } from '@/features/swap/components/modal-token-select/modal-content';
import { TOKEN_SEARCH_DEBOUNCE_MS } from '@/features/swap/constants';
import type { TokenModalProps, TokenModalState } from '@/features/swap/types';
import { Token, useGetTokenBySearchTermQuery } from '@/graphql/generated';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';

export function ModalTokenSelect({
  open,
  onOpenChange,
  onSelect,
  isPrivate,
}: TokenModalProps) {
  const t = useTranslations('swap.modal');
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState<TokenModalState>({
    searchTerm: '',
    pastSearches: [],
  });

  useEffect(() => {
    try {
      const savedSearches = JSON.parse(
        localStorage.getItem('pastSearches') || '[]'
      ) satisfies Token[];
      setState((prev) => ({ ...prev, pastSearches: savedSearches }));
    } catch (error) {
      console.error('Failed to load search history:', error);
    }
  }, []);

  const handleSelect = (token: Token) => {
    try {
      const updatedSearches = [
        token,
        ...state.pastSearches.filter((t) => t._id !== token._id),
      ].slice(0, 3);

      localStorage.setItem('pastSearches', JSON.stringify(updatedSearches));
      setState((prev) => ({ ...prev, pastSearches: updatedSearches }));
      onSelect(token);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save search history:', error);
    }
  };

  const [debouncedSearch] = useDebounce(
    state.searchTerm,
    TOKEN_SEARCH_DEBOUNCE_MS
  );
  const { data, loading, error } = useGetTokenBySearchTermQuery({
    variables: { search: debouncedSearch, hasCex: isPrivate ? true : null },
    skip: !debouncedSearch,
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (loading) {
      setIsLoading(true);
      return;
    }
    setIsLoading(false);
  }, [loading]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          'w-full max-w-[400px] gap-1 transition-all duration-300 md:p-6 lg:max-w-[580px]',
          isDesktop
            ? 'top-[15vh] h-auto translate-y-0'
            : 'h-[calc(100vh-100px)] gap-3 rounded-xl px-3 py-3'
        )}
        aria-describedby={t('selectToken')}
      >
        <DialogHeader>
          <DialogTitle>{t('selectToken')}</DialogTitle>
        </DialogHeader>
        <ModalContent
          state={state}
          setState={setState}
          loading={isLoading}
          error={error}
          tokens={data?.tokenSearch as Token[]}
          handleSelect={handleSelect}
          setIsLoading={setIsLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
