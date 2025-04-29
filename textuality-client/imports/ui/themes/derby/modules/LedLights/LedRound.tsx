import React from 'react';
import './LedLights.css';

export const LedRound: React.FC<{
  className?: string;
  color: 'red' | 'green';
  lit?: boolean;
  style?: React.CSSProperties;
}> = ({ className = '', color, lit = true, style = {} }) => {
  return (
    <div
      className={`derby-led derby-led-${color} led-round ${
        lit ? 'led-lit' : ''
      } ${className}`}
      style={style}
    />
  );
};
