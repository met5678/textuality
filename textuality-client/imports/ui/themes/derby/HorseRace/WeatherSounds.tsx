import { useEffect, useRef } from 'react';
import { Weather } from '/imports/schemas/derby/race';
import { RaceController } from './subscreens/RaceActive/RacePixi/RaceController';
import { EffectType } from '/imports/schemas/derby/race-timeline/types';
const SOUND_PATH = '/derby/sounds';

const WEATHER_TO_SOUND: Record<Weather, string> = {
  rain: `${SOUND_PATH}/weather-rain.mp3`,
  storm: `${SOUND_PATH}/weather-storm.mp3`,
  windy: `${SOUND_PATH}/weather-wind.mp3`,
  clear: '',
};

const WEATHER_EVENT_SOUNDS: Partial<Record<EffectType, string>> = {
  lightning: `${SOUND_PATH}/lightning-strike.mp3`,
  headwind: `${SOUND_PATH}/weather-wind-gust.mp3`,
};

export const WeatherSounds = ({
  weather,
  raceController,
  volume = 1,
}: {
  weather: Weather;
  raceController?: RaceController;
  volume?: number;
}) => {
  const soundRef = useRef<Howl>();

  useEffect(() => {
    const sound = WEATHER_TO_SOUND[weather];
    if (sound) {
      soundRef.current = new Howl({ src: [sound], loop: true });
      soundRef.current.play();
      soundRef.current.volume(volume);
    }

    return () => {
      if (soundRef.current) {
        soundRef.current.stop();
        soundRef.current.unload();
      }
    };
  }, [weather]);

  const preloadedEventSounds = useRef<Partial<Record<EffectType, Howl>>>();
  useEffect(() => {
    const onFrame = (frame: number) => {
      if (raceController) {
        Object.keys(WEATHER_EVENT_SOUNDS).forEach((key) => {
          const effect = raceController.getEffectAtCurrentFrame(
            key as EffectType,
          );
          if (!effect) {
            return;
          }
          const sound = preloadedEventSounds.current?.[key as EffectType];
          if (sound && effect) {
            sound.play();
            sound.volume(volume);
          }
        });
      }
    };

    if (raceController) {
      preloadedEventSounds.current = Object.fromEntries(
        Object.entries(WEATHER_EVENT_SOUNDS).map(([key, value]) => [
          key,
          new Howl({ src: [value] }),
        ]),
      );
      raceController.registerOnFrameCallback(onFrame);
    }

    return () => {
      if (raceController) {
        raceController.unregisterOnFrameCallback(onFrame);
      }
    };
  }, [raceController]);

  return null;
};
