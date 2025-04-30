// Use this to scale a wrapper component based on the width of a ref
// Helps with having control over styling while still being responsive
// Recommed adding offsets to the children to account for scaling

import { useEffect, useState, RefObject } from 'react';

export function useScaleByBaseWidth(
  ref: RefObject<HTMLElement>,
  baseWidth: number,
) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (ref.current) {
      const { width } = ref.current.getBoundingClientRect();
      setScale(width / baseWidth);
    }
  }, [ref, baseWidth]);

  return scale;
}
