import React, { useEffect, useState, useMemo } from 'react';

/**
 * A hook that will return a group of items at a time and keep them for a given timeout,
 * before returning the next group of items. It will loop around when it reaches the end.
 *
 * @param items - The items to be shown in groups
 * @param timeout - The timeout in milliseconds between groups
 * @param numToShow - The number of items to show at a time
 * @returns The current group of items to show
 */
const useTimedQueueMulti = <T>(
  items: T[],
  timeout: number,
  numToShow: number,
) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Calculate current items based on the index
  const currentItems = useMemo(() => {
    if (items.length === 0) return [];
    return items.slice(currentIndex, currentIndex + numToShow);
  }, [items, currentIndex, numToShow]);

  useEffect(() => {
    if (items.length === 0) return;

    const timer = setTimeout(() => {
      // Calculate the next starting index, wrapping around if needed
      const nextIndex = (currentIndex + numToShow) % items.length;
      setCurrentIndex(nextIndex);
    }, timeout);

    return () => clearTimeout(timer);
  }, [items, currentIndex, numToShow, timeout]);

  return currentItems;
};

export default useTimedQueueMulti;
