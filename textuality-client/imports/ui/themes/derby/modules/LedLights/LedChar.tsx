import React from 'react';
import './LedLights.css';

export const LedChar: React.FC<{
  char?: string;
  className?: string;
  color?: 'yellow' | 'pink';
  off?: boolean;
  style?: React.CSSProperties;
}> = ({
  char = '',
  className = '',
  color = 'yellow',
  off = false,
  style = {},
}) => {
  return (
    <div
      className={`derby-led led-char ${off ? 'led-off' : ''}
        ${`derby-led-${color}`} ${className}`}
      style={style}
    >
      <span>{char}</span>
    </div>
  );
};
