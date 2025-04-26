import React from 'react';
import { ToteBoardCell } from './ToteBoardCell';

export const ToteBoardDisplayRow: React.FC<{
  label: React.ReactNode;
  value: number | string;
  cellCount: number;
}> = ({ label, value, cellCount }) => {
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
      className="tote-board-display-row"
      style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
    >
      <span>{label}</span>
      <div style={{ display: 'flex' }}>
        {cells.map((char, i) => (
          <ToteBoardCell key={i} char={char} />
        ))}
      </div>
    </div>
  );
};
