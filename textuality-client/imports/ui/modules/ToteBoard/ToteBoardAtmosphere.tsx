import React from 'react';
import { Weather } from '/imports/schemas/derby/race';

const WEATHER_OVERLAY: Record<Weather, string> = {
  clear: 'rgba(0, 0, 0, 0.1)', // was kinda bright, so I toned it down
  rain: 'rgba(0, 0, 0, 0.3)',
  storm: 'rgba(0, 0, 0, 0.4)',
  windy: 'rgba(0, 0, 0, 0.2)',
};

export const ToteBoardAtmosphere: React.FC<{
  src: string;
  style?: React.CSSProperties;
  className?: string;
  weather: Weather;
}> = ({ src, style = {}, className = '', weather }) => {
  const overlay = WEATHER_OVERLAY[weather];
  const showOverlay = overlay !== '';

  return (
    <div
      className={`image-overlay-wrapper ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        isolation: 'isolate',
        ...style,
      }}
    >
      <img
        src={src}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          position: 'relative',
          zIndex: 1,
        }}
      />

      {showOverlay && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: overlay,
            maskImage: `url(${src})`,
            WebkitMaskImage: `url(${src})`,
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskSize: '100% 100%',
            WebkitMaskSize: '100% 100%',
            maskPosition: 'center',
            WebkitMaskPosition: 'center',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />
      )}
    </div>
  );
};
