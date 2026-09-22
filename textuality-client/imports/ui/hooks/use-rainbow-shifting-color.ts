import { useEffect, useState } from 'react';

export type LedColor = 'red' | 'yellow' | 'green' | 'blue' | 'pink';

const rainbowColors: LedColor[] = ['red', 'yellow', 'green', 'blue', 'pink'];

export function useRainbowShiftingColor(
  enabled: boolean,
  index = 0,
  speedMs = 200,
) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      setOffset((prev) => (prev + 1) % rainbowColors.length);
    }, speedMs);

    return () => clearInterval(interval);
  }, [enabled, speedMs]);

  return rainbowColors[(index + offset) % rainbowColors.length];
}
