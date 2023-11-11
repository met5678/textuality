import React, { useCallback, useEffect } from 'react';
import { useRef, useState } from 'react';

const useTimedQueue = <T>(items: T[], timeout: number) => {
  const [item, setItem] = useState<T | null>(null);

  const itemQueue = useRef([]);
  const oldQueue = useRef([]);

  const changeTimeout = useCallback(() => {
    if (itemQueue.current.length) {
      const newItem = itemQueue.current.shift();

      oldQueue.current.unshift(newItem);
      while (oldQueue.current.length > 6) oldQueue.current.pop();

      setItem(newItem);
      setTimeout(changeTimeout, timeout);
    } else {
      setItem(null);
    }
  }, []);

  useEffect(() => {
    for (let i = 0; i < items.length; i++) {
      const newItem = items[i];

      // If the item is already in the queue, skip it
      if (
        itemQueue.current.some((u) => u._id === newItem._id) ||
        oldQueue.current.some((u) => u._id === newItem._id)
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
