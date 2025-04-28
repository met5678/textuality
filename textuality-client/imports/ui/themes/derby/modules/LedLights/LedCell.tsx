import React from 'react';
import './LedLights.css';

export const LedCell: React.FC<{ char?: string; lit?: boolean }> = ({
  char = '',
  lit = true,
}) => {
  return (
    <div className={`led-cell ${lit ? 'lit' : ''}`}>
      <span>{char}</span>
    </div>
  );
};
