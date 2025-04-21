import React from 'react';
import { RaceWithHelpers } from '/imports/api/themes/derby/race/races';
import { useSubscribe, useTracker } from 'meteor/react-meteor-data';
import Horses from '/imports/api/themes/derby/horses/horses';
import { ToteBoardAccents } from '../../../../../modules/ToteBoard/ToteBoardAccents';
import { ToteBoard } from '/imports/ui/modules/ToteBoard/ToteBoard';
import { Weather } from '/imports/schemas/derby/race';
import { WeatherOverlay } from '../../WeatherOverlay/WeatherOverlay';

const WEATHER_BGS: Record<Weather, string> = {
  clear: 'url(/derby/images/clear.webp)',
  rain: 'url(/derby/images/rain.webp)',
  storm: 'url(/derby/images/storm.webp)',
  windy: 'url(/derby/images/windy.webp)',
};

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
        backgroundImage: WEATHER_BGS[weather],
        backgroundSize: 'cover',
        // backgroundPosition: 'center -200px',
        width: '100%',
        height: '100%',
      }}
    >
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
          bottom: window.innerHeight < 580 ? '-108px' : '16px',
          filter:
            'drop-shadow(0 4px 4px rgba(0, 0, 0, 0.25)) drop-shadow(0 10px 16px rgba(0, 0, 0, 0.15))',
          width: 'auto',
          height: '210px',
        }}
        weather={weather}
      />
      <WeatherOverlay weather={weather} />
    </div>
  );
};
