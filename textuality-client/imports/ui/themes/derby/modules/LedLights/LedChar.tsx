import React from 'react';
import './LedLights.css';

export const LedChar: React.FC<{
  char?: string;
  className?: string;
  off?: boolean;
  style?: React.CSSProperties;
}> = ({ char = '', className = '', off = false, style = {} }) => {
  return (
    <div
      className={`derby-led led-char ${off ? 'led-off' : ''} ${className}`}
      style={style}
    >
      <span>{char}</span>
    </div>
  );
};
