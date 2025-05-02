import React from 'react';
import './LedLights.css';

export const LedRound: React.FC<{
  animationDelay?: number;
  blink?: boolean;
  className?: string;
  color?: 'red' | 'green' | 'yellow' | 'blue' | 'pink';
  off?: boolean;
  frame?: boolean;
  icon?: string;
  pulse?: boolean;
  size?: number;
  style?: React.CSSProperties;
}> = ({
  animationDelay,
  blink = false,
  className = '',
  color,
  frame = true,
  icon,
  off = false,
  pulse = false,
  size = 48,
  style = {},
}) => {
  const lightSize = frame ? size - 8 : size;

  const ledLight = (
    <div
      className={`derby-led led-round
          ${color ? `derby-led-${color}` : ''} 
          ${!icon ? 'led-fill' : ''}
          ${off ? 'led-off' : ''} 
          ${blink ? 'led-blink' : ''} 
          ${pulse ? 'led-pulse' : ''}
          ${className}`}
      style={{
        width: `${lightSize}px`,
        height: `${lightSize}px`,
        animationDelay: animationDelay ? `${animationDelay}s` : '0s',
        ...style,
      }}
    >
      {icon && (
        <div
          className="led-icon"
          style={{
            maskImage: icon,
            WebkitMaskImage: icon,
            animationDelay: animationDelay ? `${animationDelay}s` : '0s',
          }}
        />
      )}
    </div>
  );
  return (
    <div className={'derby-led-wrapper'}>
      {frame ? (
        <div
          className={'derby-led-frame'}
          style={{ width: `${size}px`, height: `${size}px` }}
        >
          {ledLight}
        </div>
      ) : (
        ledLight
      )}
    </div>
  );
};
