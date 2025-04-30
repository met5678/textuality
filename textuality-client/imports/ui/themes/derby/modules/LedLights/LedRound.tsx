import React from 'react';
import './LedLights.css';

export const LedRound: React.FC<{
  blink?: boolean;
  className?: string;
  color: 'red' | 'green';
  lit?: boolean;
  style?: React.CSSProperties;
}> = ({ className = '', color, lit = true, style = {}, blink = false }) => {
  return (
    <div
      className={`derby-led derby-led-${color} led-round ${
        lit ? 'led-lit' : ''
      } ${blink ? 'led-blink' : ''} ${className}`}
      style={style}
    />
  );
};
