import React from 'react';
import './LedLights.css';

export const LedRound: React.FC<{
  blink?: boolean;
  className?: string;
  color?: 'red' | 'green';
  off?: boolean;
  frame?: boolean;
  icon?: React.ReactNode;
  size?: number;
  style?: React.CSSProperties;
}> = ({
  blink = false,
  className = '',
  color,
  frame = true,
  icon,
  off = false,
  size = 48,
  style = {},
}) => {
  const lightSize = frame ? size - 8 : size;
  return (
    <div className={'derby-led-wrapper'}>
      {frame && (
        <div
          className={'derby-led-frame'}
          style={{ width: `${size}px`, height: `${size}px` }}
        />
      )}
      <div
        className={`derby-led led-round
          ${color ? `derby-led-${color}` : ''} 
          ${!icon ? 'led-fill' : ''}
          ${off ? 'led-off' : ''} 
          ${blink ? 'led-blink' : ''} 
          ${className}`}
        style={{ width: `${lightSize}px`, height: `${lightSize}px`, ...style }}
      >
        {icon && <div className="led-icon">{icon}</div>}
      </div>
    </div>
  );
};
