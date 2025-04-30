import React from 'react';
import { LedChar } from './LedChar';

export const LedCharRow: React.FC<{
  label?: React.ReactNode;
  value: number | string;
  charCount: number;
  dimmed?: boolean;
}> = ({ label, value, charCount, dimmed = false }) => {
  const isNumber = typeof value === 'number';
  const stringValue = isNumber
    ? String(Math.min(99, value))
    : String(value || '');

  const chars = stringValue.split('');
  const emptyCount = Math.max(0, charCount - chars.length);

  const cells = isNumber
    ? [...Array(emptyCount).fill(''), ...chars] // pad left
    : [...chars, ...Array(emptyCount).fill('')]; // pad right

  return (
    <div
      className="led-char-row"
      style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
    >
      {label && <span>{label}</span>}
      <div style={{ display: 'flex' }}>
        {cells.map((char, i) => (
          <LedChar key={i} char={char} dimmed={dimmed} />
        ))}
      </div>
    </div>
  );
};
