'use client';

import { useEffect } from 'react';

export function BodyClassController({ className }: { className: string }) {
  useEffect(() => {
    document.body.classList.add(className);
    return () => {
      document.body.classList.remove(className);
    };
  }, [className]);
  return null;
}
