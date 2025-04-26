import React from 'react';
import './ToteBoard.css';

export const ToteBoardCell: React.FC<{ char?: string }> = ({ char = '' }) => {
  return (
    <div className="tote-board-cell">
      <span>{char}</span>
    </div>
  );
};
