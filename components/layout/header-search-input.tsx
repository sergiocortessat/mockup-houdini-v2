'use client';

import { MotionConfig, motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';

import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/search-input';
import { getOrderDetailsUrl } from '@/constants/urls';
import { useMediaQuery } from '@/hooks/use-media-query';

const DEBOUNCE_TIME = 500;

const transition = {
  type: 'spring',
  bounce: 0.1,
  duration: 0.2,
};

export function HeaderSearchInput() {
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearchValue] = useDebounce(searchValue, DEBOUNCE_TIME);
  const router = useRouter();
  const t = useTranslations('common');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1240px)');

  useEffect(() => {
    setIsOpen(isDesktop);
  }, [isDesktop]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        if (!isDesktop) {
          setIsOpen(false);
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDesktop]);

  useEffect(() => {
    if (!debouncedSearchValue) return;
    if (debouncedSearchValue.length === 22) {
      router.push(getOrderDetailsUrl(debouncedSearchValue));
      setSearchValue('');
    } else if (debouncedSearchValue.length > 0) {
      toast.error(t('invalidIdContactSupport'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchValue]);

  const handleClear = () => {
    setSearchValue('');
  };

  return (
    <MotionConfig transition={transition}>
      <div ref={containerRef} className="relative">
        {isDesktop ? (
          <motion.div
            animate={{
              width: isOpen ? '246px' : 'auto',
            }}
            initial={false}
          >
            <div className="overflow-hidden">
              {isOpen ? (
                <div className="relative w-full">
                  <SearchInput
                    value={searchValue}
                    onChange={setSearchValue}
                    inputClassName="h-10"
                    onClear={handleClear}
                    placeholder={t('searchByHoudiniId')}
                  />
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => setIsOpen(true)}
                >
                  <Search className="h-5 w-5" />
                </Button>
              )}
            </div>
          </motion.div>
        ) : (
          <div className="relative">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-label={t('searchByHoudiniId')}
            >
              <Search className="h-5 w-5" />
            </Button>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={transition}
                className="bg-background absolute top-full left-1/2 z-50 mt-4 w-[246px] -translate-x-1/2 rounded-md border p-2 shadow-lg"
              >
                <SearchInput
                  value={searchValue}
                  onChange={setSearchValue}
                  inputClassName="h-10"
                  onClear={handleClear}
                  placeholder={t('searchByHoudiniId')}
                  autoFocus
                />
              </motion.div>
            )}
          </div>
        )}
      </div>
    </MotionConfig>
  );
}
