import { useEffect, useRef } from 'react';
import { Weather } from '/imports/schemas/derby/race';
const SOUND_PATH = '/derby/sounds';

const WEATHER_TO_SOUND: Record<Weather, string> = {
  rain: `${SOUND_PATH}/weather-rain.mp3`,
  storm: `${SOUND_PATH}/weather-storm.mp3`,
  windy: `${SOUND_PATH}/weather-wind.mp3`,
  clear: '',
};

export const WeatherSounds = ({ weather }: { weather: Weather }) => {
  const soundRef = useRef<Howl>();
  useEffect(() => {
    const sound = WEATHER_TO_SOUND[weather];
    if (sound) {
      soundRef.current = new Howl({ src: [sound], loop: true });
      soundRef.current.play();
    }

    return () => {
      if (soundRef.current) {
        soundRef.current.stop();
        soundRef.current.unload();
      }
    };
  }, [weather]);

  return null;
};
