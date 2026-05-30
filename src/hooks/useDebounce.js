import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce updates to a fast-changing value.
 * Useful for text input searches to prevent over-triggering queries.
 */
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
