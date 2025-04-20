import React, { useEffect, useRef } from 'react';
import { WeatherOverlayPixi } from './WeatherOverlayPixi';
import { RaceWithHelpers } from '/imports/api/themes/derby/race/races';

export const WeatherOverlay = ({ race }: { race: RaceWithHelpers }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pixiRef = useRef<WeatherOverlayPixi>();

  useEffect(() => {
    if (!pixiRef.current) {
      pixiRef.current = new WeatherOverlayPixi();
    }
    if (containerRef.current) {
      pixiRef.current.init(containerRef.current);
    }

    return () => {
      pixiRef.current?.destroy();
      pixiRef.current = undefined;
    };
  }, [pixiRef, containerRef]);

  useEffect(() => {
    if (pixiRef.current && race?.weather) {
      pixiRef.current.setWeather(race.weather);
    }
  }, [race?.weather]);

  return (
    <div
      className="weather-overlay"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
      ref={containerRef}
    />
  );
};
