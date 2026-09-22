import React, { useCallback, useEffect } from 'react';
import { useRef, useState } from 'react';

const MAX_OLD_QUEUE_SIZE = 10;

/**
 * A hook that will return a single item at a time and keep it for a given timeout,
 * before returning the next item in the queue. It will do this until the queue is empty.
 *
 * Useful for showing a time-separated list of achievements, for example.
 *
 * @param items - The items to be shown in in sequence.
 * @param timeout - The timeout in milliseconds.
 * @param idProp - The property of the item that is used to identify it. Defaults to '_id'.
 * @returns The item from the queue.
 */
const useTimedQueue = <T>(
  items: T[],
  timeout: number,
  idProp: keyof T = '_id' as keyof T,
) => {
  const [item, setItem] = useState<T | null>(null);

  const itemQueue = useRef<T[]>([]);
  const oldQueue = useRef<T[]>([]);

  const changeTimeout = useCallback(() => {
    const newItem = itemQueue.current.shift();

    if (newItem) {
      oldQueue.current.unshift(newItem);
      while (oldQueue.current.length > MAX_OLD_QUEUE_SIZE)
        oldQueue.current.pop();

      setItem(newItem);
      setTimeout(changeTimeout, timeout);
    } else {
      setItem(null);
    }
  }, [timeout]);

  useEffect(() => {
    for (let i = 0; i < items.length; i++) {
      const newItem = items[i];

      // If the item is already in the queue, skip it
      if (
        itemQueue.current.some((u) => u[idProp] === newItem[idProp]) ||
        oldQueue.current.some((u) => u[idProp] === newItem[idProp])
      ) {
        continue;
      }

      itemQueue.current.push(newItem);
    }

    if (!item) {
      changeTimeout();
    }
  }, [items]);

  return item;
};

export default useTimedQueue;
