import React from 'react';
import './LedLights.css';
import { LedColor } from '/imports/ui/hooks/use-rainbow-shifting-color';

export const LedChar: React.FC<{
  char?: string;
  className?: string;
  color?: LedColor;
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
