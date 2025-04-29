import React from 'react';
import { LedCell } from './LedCell';

export const LedCellRow: React.FC<{
  label?: React.ReactNode;
  value: number | string;
  cellCount: number;
  lit?: boolean;
}> = ({ label, value, cellCount, lit }) => {
  const isNumber = typeof value === 'number';
  const stringValue = isNumber
    ? String(Math.min(99, value))
    : String(value || '');

  const chars = stringValue.split('');
  const emptyCount = Math.max(0, cellCount - chars.length);

  const cells = isNumber
    ? [...Array(emptyCount).fill(''), ...chars] // pad left
    : [...chars, ...Array(emptyCount).fill('')]; // pad right

  return (
    <div
      className="led-cell-row"
      style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
    >
      {label && <span>{label}</span>}
      <div style={{ display: 'flex' }}>
        {cells.map((char, i) => (
          <LedCell key={i} char={char} lit={lit} />
        ))}
      </div>
    </div>
  );
};
