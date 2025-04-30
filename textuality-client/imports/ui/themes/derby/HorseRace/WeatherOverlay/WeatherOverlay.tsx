import React, { useEffect, useRef } from 'react';
import { WeatherOverlayPixi } from './WeatherOverlayPixi';
import { Weather } from '/imports/schemas/derby/race';
import { RaceController } from '../subscreens/RaceActive/RacePixi/RaceController';

export const WeatherOverlay = ({
  weather,
  raceController,
}: {
  weather: Weather;
  raceController?: RaceController;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pixiRef = useRef<WeatherOverlayPixi>();

  useEffect(() => {
    if (!pixiRef.current) {
      pixiRef.current = new WeatherOverlayPixi(raceController);
      if (containerRef.current) {
        pixiRef.current.init(containerRef.current);
      }
    }

    return () => {
      console.log('destroying pixi');
      // pixiRef.current?.destroy();
      // pixiRef.current = undefined;
    };
  }, []);

  useEffect(() => {
    if (pixiRef.current && weather) {
      pixiRef.current.setWeather(weather);
    }
  }, [pixiRef, weather]);

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
