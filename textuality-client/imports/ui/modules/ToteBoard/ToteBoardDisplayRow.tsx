import React from 'react';
import { ToteBoardCell } from './ToteBoardCell';

export const ToteBoardDisplayRow: React.FC<{
  label: string;
  value: number | string;
  cellCount: number;
}> = ({ label, value, cellCount }) => {
  const chars = String(value).split('');
  const emptyCount = cellCount - chars.length;
  const cells =
    typeof value === 'number'
      ? [...Array(emptyCount).fill(''), ...chars]
      : [...Array(cellCount)].map((_, i) => chars[i] || '');

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
