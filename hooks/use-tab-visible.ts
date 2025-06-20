import { useEffect, useState } from 'react';

/**
 * Returns true if the current browser tab is visible (active), false otherwise.
 */
export function useTabVisible(): boolean {
  const [isTabVisible, setIsTabVisible] = useState(
    typeof document !== 'undefined'
      ? document.visibilityState === 'visible'
      : true
  );

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabVisible(document.visibilityState === 'visible');
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return isTabVisible;
}
