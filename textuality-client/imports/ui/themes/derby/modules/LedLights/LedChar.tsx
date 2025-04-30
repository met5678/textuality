import React from 'react';
import './LedLights.css';

export const LedChar: React.FC<{
  char?: string;
  className?: string;
  dimmed?: boolean;
  style?: React.CSSProperties;
}> = ({ char = '', className = '', dimmed = false, style = {} }) => {
  return (
    <div
      className={`derby-led led-char ${
        dimmed ? 'led-dimmed' : ''
      } ${className}`}
      style={style}
    >
      <span>{char}</span>
    </div>
  );
};
