import React from 'react';
import './LedLights.css';

export const LedCell: React.FC<{
  char?: string;
  className?: string;
  lit?: boolean;
  style?: React.CSSProperties;
}> = ({ char = '', className = '', lit = true, style = {} }) => {
  return (
    <div
      className={`led-cell ${lit ? 'led-lit' : ''} ${className}`}
      style={style}
    >
      <span>{char}</span>
    </div>
  );
};
