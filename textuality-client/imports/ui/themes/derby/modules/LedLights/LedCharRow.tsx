import React from 'react';
import { LedChar } from './LedChar';
import {
  useRainbowShiftingColor,
  LedColor,
} from '/imports/ui/hooks/use-rainbow-shifting-color';

export const LedCharRow: React.FC<{
  label?: React.ReactNode;
  value: number | string;
  charCount: number;
  color?: 'yellow' | 'pink';
  off?: boolean;
  rainbowModeActive?: boolean;
}> = ({
  label,
  value,
  charCount,
  color = 'yellow',
  off = false,
  rainbowModeActive = false,
}) => {
  const isNumber = typeof value === 'number';
  const stringValue = isNumber
    ? String(Math.min(99, value))
    : String(value || '');

  const chars = stringValue.split('');
  const emptyCount = Math.max(0, charCount - chars.length);

  const cells = isNumber
    ? [...Array(emptyCount).fill(''), ...chars] // pad left
    : [...chars, ...Array(emptyCount).fill('')]; // pad right

  const rainbowColors = cells.map((_, i) =>
    useRainbowShiftingColor(rainbowModeActive, i, 150),
  );

  return (
    <div
      className="led-char-row"
      style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}
    >
      {label && <span>{label}</span>}
      <div style={{ display: 'flex' }}>
        {cells.map((char, i) => (
          <LedChar
            key={i}
            char={char}
            off={off}
            color={rainbowModeActive ? rainbowColors[i] : color}
          />
        ))}
      </div>
    </div>
  );
};
