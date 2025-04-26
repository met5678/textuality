import React from 'react';
import { ToteBoardCell } from './ToteBoardCell';

export const ToteBoardDisplayRow: React.FC<{
  label: React.ReactNode;
  value: number | string;
  cellCount: number;
}> = ({ label, value, cellCount }) => {
  const numValueClamped = Math.min(99, Number(value));
  const chars =
    typeof value === 'number' ? String(numValueClamped).split('') : value;
  const emptyCount = Math.max(0, cellCount - chars.length);
  const cells = [...Array(emptyCount).fill(''), ...chars];

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
