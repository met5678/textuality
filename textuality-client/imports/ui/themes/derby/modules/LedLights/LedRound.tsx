import React from 'react';
import './LedLights.css';

export const LedRound: React.FC<{
  blink?: boolean;
  className?: string;
  color: 'red' | 'green';
  frame?: boolean;
  icon?: React.ReactNode;
  lit?: boolean;
  size?: number;
  style?: React.CSSProperties;
}> = ({
  blink = false,
  className = '',
  color,
  frame = true,
  icon,
  lit = true,
  size = 48,
  style = {},
}) => {
  const lightSize = frame ? size - 8 : size;
  return (
    <div className={'derby-led-wrapper'}>
      {frame && (
        <div
          className={'derby-led-frame'}
          style={{ width: size, height: size }}
        />
      )}
      <div
        className={`derby-led led-round
          ${color ? `derby-led-${color}` : ''} 
          ${lit ? 'led-lit' : ''} 
          ${blink ? 'led-blink' : ''} 
          ${className}`}
        style={{ width: lightSize, height: lightSize, ...style }}
      />
    </div>
  );
};
