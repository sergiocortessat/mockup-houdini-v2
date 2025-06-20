'use client';

import { Cross2Icon, ExternalLinkIcon } from '@radix-ui/react-icons';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useGetConfigQuery } from '@/graphql/generated';
import { triggerAddressableEvent } from '@/utils/addressable-event';

// BANNER_KEY must match the key configured in admin dashboard.
// Used for both API queries and local storage persistence.
const BANNER_KEY = 'v4_banner';
const BANNER_LOCAL_STORAGE_KEY = 'banner_seen_v4';

interface BannerContent {
  title: string;
  description?: string;
  link?: string;
  icon?: string;
  start?: string;
  end?: string;
  linkText?: string;
}

const ANIMATION_DURATION = 0.3;
const ANIMATION_EASE = 'easeOut';

const Banner = () => {
  const t = useTranslations('banner');
  const [isClosed, setIsClosed] = useState(true);
  const { data, loading } = useGetConfigQuery({
    variables: {
      key: BANNER_KEY,
    },
    skip: !BANNER_KEY,
  });

  const handleClose = useCallback(() => {
    localStorage.setItem(
      BANNER_LOCAL_STORAGE_KEY,
      data?.config?.modified ?? ''
    );
    setIsClosed(true);
  }, [data?.config?.modified]);

  useEffect(() => {
    const storedValue = localStorage.getItem(BANNER_LOCAL_STORAGE_KEY);
    setIsClosed(storedValue === data?.config?.modified);
  }, [data?.config?.modified]);

  let bannerContent;
  try {
    bannerContent = data?.config?.value
      ? (JSON.parse(data.config.value) as BannerContent)
      : null;
  } catch (e) {
    console.error('Failed to parse banner content:', e);
    return null;
  }

  if (!bannerContent || loading) {
    return null;
  }

  const { title, description, link, icon, start, end, linkText } =
    bannerContent;

  const currentDate = new Date();
  const startDate = start ? new Date(start) : null;
  const endDate = end ? new Date(end) : null;
  if (
    (startDate && currentDate < startDate) ||
    (endDate && endDate < currentDate) ||
    isClosed
  ) {
    return null;
  }

  return (
    <AnimatePresence>
      {!isClosed && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: ANIMATION_DURATION, ease: ANIMATION_EASE }}
          aria-live="polite"
          className="w-full"
        >
          <Card className="mx-auto p-5 lg:!max-w-[900px]">
            <div className="flex items-start justify-between gap-4 sm:gap-0">
              <div className="flex w-full flex-col items-start gap-4 sm:w-auto sm:flex-row sm:items-center">
                {icon && (
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl sm:h-24 sm:w-24">
                    <Image
                      src={icon}
                      alt={title || ''}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 640px) 64px, 96px"
                    />
                  </div>
                )}
                <div className="flex w-full flex-col gap-2 sm:w-auto">
                  <div className="text-heading-md">{title}</div>
                  <div className="text-label-sm text-muted-foreground">
                    {description}
                  </div>
                  <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
                    {link && (
                      <Button variant="secondary" asChild>
                        <Link
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() =>
                            triggerAddressableEvent(
                              'v4_user_pressed_banner_link'
                            )
                          }
                        >
                          {linkText || t('readMore')}
                          <ExternalLinkIcon className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <Button
                variant="secondary"
                size="icon"
                className="shrink-0"
                onClick={() => {
                  handleClose();
                  triggerAddressableEvent('v4_user_closed_banner');
                }}
                aria-label={t('close')}
              >
                <Cross2Icon className="h-5 w-5" />
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Banner;
