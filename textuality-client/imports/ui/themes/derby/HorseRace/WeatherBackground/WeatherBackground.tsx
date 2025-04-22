import React from 'react';
import { Weather } from '/imports/schemas/derby/race';

const WEATHER_VIDEOS: Record<Weather, string | undefined> = {
  clear: undefined,
  rain: undefined,
  windy: undefined,
  storm: '/derby/videos/weather/storm-1.mp4',
};

export const WeatherBackground = ({ weather }: { weather: Weather }) => {
  return (
    <div
      className="weather-background"
      style={{
        position: 'absolute',
        height: '100%',
        width: '100%',
        backgroundImage: `url(/derby/images/weather/${weather}.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {WEATHER_VIDEOS[weather] && (
        <video
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
          }}
          autoPlay
          muted
          loop
          className="weather-video"
        >
          <source src={WEATHER_VIDEOS[weather]} type="video/mp4" />
        </video>
      )}
    </div>
  );
};
