// Use this to scale a wrapper component based on the width of a ref
// Helps with having control over styling while still being responsive
// Recommed adding offsets to the children to account for scaling

import { useEffect, useState, RefObject } from 'react';

/* JTG - nice to have - DIFFERENT WIDTHS ARE CREATING DIFFERENT HEIGHT VIDEOS, MATCH HEIGHTS CHECK NOT WORKING  */
export function useScaleByBaseWidth(
  ref: RefObject<HTMLElement>,
  baseWidth: number,
  onResize?: (height: number) => void,
  matchHeights: boolean = false,
) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (ref.current) {
      const { width } = ref.current.getBoundingClientRect();
      let newScale = width / baseWidth;

      // If we want to *match* heights across screens, don't scale *up*
      if (matchHeights) {
        newScale = Math.min(newScale, 1);
      }

      setScale(newScale);
      onResize?.(newScale * ref.current.offsetHeight);
    }
  }, [ref, baseWidth, onResize, matchHeights]);

  return scale;
}
