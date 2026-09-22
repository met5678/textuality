import React from 'react';
import './LedLights.css';
import {
  LedColor,
  useRainbowShiftingColor,
} from '/imports/ui/hooks/use-rainbow-shifting-color';

export const LedChar: React.FC<{
  char?: string;
  className?: string;
  color?: LedColor;
  off?: boolean;
  style?: React.CSSProperties;
  index?: number;
  rainbowModeActive?: boolean;
}> = ({
  char = '',
  className = '',
  color = 'yellow',
  off = false,
  style = {},
  index,
  rainbowModeActive = false,
}) => {
  const rainbowColor = useRainbowShiftingColor(rainbowModeActive, index);

  const colorToUse = rainbowModeActive ? rainbowColor : color;

  return (
    <div
      className={`derby-led led-char ${off ? 'led-off' : ''}
        ${`derby-led-${colorToUse}`} ${className}`}
      style={style}
    >
      <span>{char}</span>
    </div>
  );
};
