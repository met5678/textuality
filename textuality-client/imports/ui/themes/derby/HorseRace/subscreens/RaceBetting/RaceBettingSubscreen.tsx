import React from 'react';
import { RaceWithHelpers } from '/imports/api/themes/derby/race/races';
import { useSubscribe, useTracker } from 'meteor/react-meteor-data';
import Horses from '/imports/api/themes/derby/horses/horses';
import { ToteBoardAccents } from './ToteBoard/ToteBoardAccents';
import { ToteBoard } from './ToteBoard/ToteBoard';
import { WeatherOverlay } from '../../WeatherOverlay/WeatherOverlay';
import { WeatherBackground } from '../../WeatherBackground/WeatherBackground';

export const RaceBettingSubscreen: React.FC<{ race: RaceWithHelpers }> = ({
  race,
}) => {
  const { weather } = race;

  useSubscribe('derby.horses.all');
  const horses = useTracker(() => Horses.find({}).fetch());

  return (
    <div
      className="race-betting-subscreen"
      style={{
        position: 'relative',
        display: 'grid',
        placeItems: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      <WeatherBackground weather={weather} />
      <ToteBoardAccents
        src="/derby/images/grass.webp"
        style={{
          position: 'absolute',
          // bottom: window.innerHeight < 580 ? '-100px' : 0,
          height: 'auto',
        }}
        weather={weather}
      />
      <ToteBoard race={race} horses={horses} />
      <ToteBoardAccents
        src="/derby/images/roses.png"
        style={{
          position: 'absolute',
          filter:
            'drop-shadow(0 4px 4px rgba(0, 0, 0, 0.25)) drop-shadow(0 10px 16px rgba(0, 0, 0, 0.15))',
          width: window.innerWidth > 1280 ? '98vw' : '100vw',
          height: 'auto',
          aspectRatio: 1250 / 210,
          bottom: window.innerHeight < 580 ? '-80px' : '28px',
        }}
        weather={weather}
      />
      <WeatherOverlay weather={weather} />
    </div>
  );
};
