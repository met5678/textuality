import React from 'react';
import './LedLights.css';

export const LedCell: React.FC<{ char?: string }> = ({ char = '' }) => {
  return (
    <div className="led-cell">
      <span>{char}</span>
    </div>
  );
};
