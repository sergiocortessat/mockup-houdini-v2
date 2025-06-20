'use client';

import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import NetworkSelect from '@/features/swap/components/modal-token-select/network-select';
import { TokenCard } from '@/features/swap/components/modal-token-select/token-card';
import { TokenCardPast } from '@/features/swap/components/modal-token-select/token-card-past';
import TokenCardPopular from '@/features/swap/components/modal-token-select/token-card-popular';
import type { TokenModalState } from '@/features/swap/types';
import { AllChainKind } from '@/features/swap/types';
import { type Token } from '@/graphql/generated';
import { useGetPopularTokensQuery } from '@/graphql/generated';
import { cn } from '@/lib/utils';

interface ModalContentProps {
  state: TokenModalState;
  setState: (state: (prev: TokenModalState) => TokenModalState) => void;
  loading: boolean;
  error?: Error;
  tokens?: Token[] | null;
  handleSelect: (token: Token) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export function ModalContent({
  state,
  setState,
  loading,
  error,
  tokens,
  handleSelect,
  setIsLoading,
}: ModalContentProps) {
  const t = useTranslations('swap.modal');
  const [selectedNetwork, setSelectedNetwork] = useState<string>(
    AllChainKind.ALL
  );

  const { data: popularTokens, loading: popularTokensLoading } =
    useGetPopularTokensQuery({
      variables: {
        chain: selectedNetwork === AllChainKind.ALL ? '' : selectedNetwork,
      },
    });

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({ ...prev, searchTerm: e.target.value }));
    if (e.target.value === '') {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
  };

  const handleNetworkSelect = (value: string) => {
    setSelectedNetwork(value);
  };
  const filteredTokens = useMemo(() => {
    if (!tokens) return [];
    if (selectedNetwork === AllChainKind.ALL || !selectedNetwork) return tokens;
    const filtered = tokens.filter((token) => {
      const matches = token.chain === selectedNetwork.toLowerCase();
      return matches;
    });
    return filtered;
  }, [tokens, selectedNetwork]);

  const filteredPopularTokens = useMemo(() => {
    if (!popularTokens) return [];
    const sortedPopularTokens = [
      ...(popularTokens?.getPopularTokens ?? []),
    ].sort((a, b) => {
      // First sort by rank (highest priority)
      if (a.rank !== null && b.rank !== null) {
        const rankDiff = (a.rank ?? 0) - (b.rank ?? 0);
        if (rankDiff !== 0) return rankDiff;
      }

      // Then sort by priority
      if (a.priority !== null && b.priority !== null) {
        const priorityDiff = (a.priority ?? 0) - (b.priority ?? 0);
        if (priorityDiff !== 0) return priorityDiff;
      }

      // If any values are null, maintain original order
      return 0;
    });
    if (!sortedPopularTokens) return [];
    if (selectedNetwork === AllChainKind.ALL && !state.searchTerm)
      return sortedPopularTokens;

    return sortedPopularTokens.filter((token) => {
      const networkMatch =
        selectedNetwork === AllChainKind.ALL ||
        token.chain === selectedNetwork.toLowerCase();
      return networkMatch;
    });
  }, [selectedNetwork, state.searchTerm, popularTokens]);

  // Show popular tokens section when there's no search term and no tokens
  const shouldShowPopularTokensSection = !tokens && !state.searchTerm;

  // Show spinner when popular tokens are loading
  const shouldShowPopularTokensSpinner =
    popularTokensLoading && shouldShowPopularTokensSection;

  // Show "no popular tokens" only when loading is complete and there are no tokens
  const shouldShowNoPopularTokens =
    !popularTokensLoading &&
    shouldShowPopularTokensSection &&
    filteredPopularTokens.length === 0;

  return (
    <div
      className={cn(
        'h-full space-y-4 overflow-y-auto px-0 md:max-h-[540px] md:space-y-6'
      )}
    >
      <div className="relative flex items-center gap-2">
        <Input
          placeholder={t('searchToken')}
          value={state.searchTerm}
          type="search"
          onChange={onSearchChange}
          aria-label={t('searchToken')}
          className="w-full"
        />
        <div className="absolute top-1/2 right-3 -translate-y-1/2">
          <NetworkSelect
            onSelect={handleNetworkSelect}
            selectedValue={selectedNetwork}
          />
        </div>
      </div>

      <div className="space-y-4" role="region" aria-busy={loading}>
        {state.pastSearches.length > 0 && (
          <section
            aria-labelledby="past-searches-heading"
            className="space-y-2"
          >
            <h3
              id="past-searches-heading"
              className="text-sm font-medium text-gray-400"
            >
              {t('pastSearches')}
            </h3>
            <div
              className="flex flex-nowrap gap-2 overflow-x-auto pb-2"
              role="list"
            >
              {state.pastSearches.map((token) => (
                <TokenCardPast
                  key={token._id}
                  token={token}
                  onClick={handleSelect}
                  className="shrink-0"
                />
              ))}
            </div>
          </section>
        )}

        {/* Popular tokens */}
        {shouldShowPopularTokensSection && (
          <section
            aria-labelledby="popular-tokens-heading"
            className="space-y-2"
          >
            <h3
              id="popular-tokens-heading"
              className="text-sm font-medium text-gray-400"
            >
              {t('popularTokens')}
            </h3>
            {shouldShowPopularTokensSpinner ? (
              <div className="flex h-[80px] items-center justify-center">
                <Spinner size="lg" aria-label={t('loading')} />
              </div>
            ) : shouldShowNoPopularTokens ? (
              <div className="flex items-center justify-center">
                <span className="text-label-sm text-gray-400">
                  {t('noPopularTokens')}
                </span>
              </div>
            ) : (
              <div className="scrollbar-thin space-y-3 overflow-y-auto pb-6">
                {filteredPopularTokens.map((popularToken) => (
                  <TokenCardPopular
                    key={`popularToken-${popularToken.id ?? popularToken.symbol}-${popularToken.cexTokenId}`}
                    token={popularToken as Token}
                    onClick={handleSelect}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        <section aria-labelledby="search-results-heading" className="space-y-2">
          <h3
            id="search-results-heading"
            className="text-sm font-medium text-gray-400"
          >
            {t('tokens')}
          </h3>

          <div
            className={cn(
              'md:h-[300px]',
              state.searchTerm ? 'h-[calc(65vh-100px)]' : 'h-auto'
            )}
          >
            {loading ? (
              <div
                className="flex h-full items-center justify-center"
                aria-live="polite"
              >
                <Spinner size="lg" aria-label={t('loading')} />
              </div>
            ) : error ? (
              <div
                className="flex h-full items-center justify-center text-center text-red-400"
                role="alert"
              >
                {t('errorLoadingTokens')}
              </div>
            ) : filteredTokens?.length ? (
              <div className="h-full space-y-3 overflow-y-auto pb-6">
                {filteredTokens.map((token) => (
                  <TokenCard
                    key={token._id}
                    token={token as Token}
                    onClick={handleSelect}
                    aria-label={`Select ${token.symbol} token`}
                  />
                ))}
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center py-8 text-center">
                <p className="text-gray-400">
                  {state.searchTerm
                    ? t('noTokensFound')
                    : t('noTokensAvailable')}
                </p>
                <p className="text-sm text-gray-500">
                  {state.searchTerm
                    ? t('tryDifferentSearch')
                    : t('checkBackLater')}
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
