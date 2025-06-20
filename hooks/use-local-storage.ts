import { useCallback, useEffect, useState } from 'react';

function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      setStoredValue((prev) => {
        const valueToStore = value instanceof Function ? value(prev) : value;
        if (typeof window !== 'undefined') {
          try {
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
          } catch {}
        }
        return valueToStore;
      });
    },
    [key]
  );

  useEffect(() => {
    setStoredValue(() => {
      if (typeof window === 'undefined') return initialValue;
      try {
        const item = window.localStorage.getItem(key);
        return item ? (JSON.parse(item) as T) : initialValue;
      } catch {
        return initialValue;
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return [storedValue, setValue] as const;
}

export default useLocalStorage;
