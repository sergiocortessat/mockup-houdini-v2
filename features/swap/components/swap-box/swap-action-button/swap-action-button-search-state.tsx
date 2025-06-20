import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';

import { TextLoop } from '@/components/ui/text-loop';
import { shuffleArray } from '@/lib/utils';

const baseTextArray = [
  'searchingBestRoute1',
  'searchingBestRoute2',
  'searchingBestRoute3',
  'searchingBestRoute4',
  'searchingBestRoute5',
  'searchingBestRoute6',
];

export function SwapActionButtonSearchState() {
  const t = useTranslations('swap.form');

  const [shuffledTextArray, setShuffledTextArray] = useState(() =>
    shuffleArray(baseTextArray)
  );

  useEffect(() => {
    setShuffledTextArray(shuffleArray(baseTextArray));
  }, []);

  return (
    <div className="flex items-center gap-2">
      <TextLoop>
        {shuffledTextArray.map((text) => (
          <span key={text} className="block text-left">
            {t(text)}
          </span>
        ))}
      </TextLoop>
    </div>
  );
}
