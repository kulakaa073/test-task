import { useEffect, useState } from 'react';

export const useDebounce = (value: any, timeout: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handleDebounce = setTimeout(() => setDebouncedValue(value), timeout);
    return () => {
      clearTimeout(handleDebounce);
    };
  }, [value, timeout]);
  return debouncedValue;
};
