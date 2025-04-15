import React from 'react';
import './ToteBoard.css';

export const ToteBoardCell: React.FC<{ char?: string; dimmed?: boolean }> = ({
  char = '',
}) => {
  return (
    <div
      className="tote-board-cell"
      style={{
        fontFamily: 'digital-7, monospace',
        width: '2rem',
        height: '2.5rem',
        backgroundColor: '#000',
        color: '#FFD166',
        fontWeight: 'bold',
        fontSize: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '0.25rem',
        textTransform: 'uppercase',
      }}
    >
      {char}
    </div>
  );
};
