import React, { useEffect } from 'react';
import { RaceWithHelpers } from '/imports/api/themes/derby/race/races';
import { useSubscribe, useTracker } from 'meteor/react-meteor-data';
import Horses from '/imports/api/themes/derby/horses/horses';
import { ToteBoardAccents } from './ToteBoard/ToteBoardAccents';
import { ToteBoard } from './ToteBoard/ToteBoard';
import { WeatherOverlay } from '../../WeatherOverlay/WeatherOverlay';
import { WeatherBackground } from '../../WeatherBackground/WeatherBackground';
import { WeatherSounds } from '../../WeatherSounds';

const OPENING_CHIME_SOUND = '/derby/sounds/opening-chime.mp3';

export const RaceBettingSubscreen: React.FC<{ race: RaceWithHelpers }> = ({
  race,
}) => {
  const { weather } = race;

  useSubscribe('derby.horses.all');
  const horses = useTracker(() => Horses.find({}).fetch());

  useEffect(() => {
    let sound: Howl | undefined;
    if (race.status === 'bets-open') {
      sound = new Howl({
        src: [OPENING_CHIME_SOUND],
      });
      sound.play();
    }

    return () => {
      if (sound) {
        sound.stop();
        sound.unload();
      }
    };
  }, [race.status]);

  return (
    <div
      className="race-betting-subscreen"
      style={{
        position: 'relative',
        display: 'grid',
        placeItems: 'center',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <WeatherBackground weather={weather} />
      <ToteBoardAccents
        src="/derby/images/grass.webp"
        style={{
          position: 'absolute',
          bottom: 0,
          height: 'auto',
        }}
        weather={weather}
      />
      <ToteBoard race={race} horses={horses} weather={weather} />
      <WeatherOverlay weather={weather} />
      <WeatherSounds weather={weather} volume={0.25} />
    </div>
  );
};
