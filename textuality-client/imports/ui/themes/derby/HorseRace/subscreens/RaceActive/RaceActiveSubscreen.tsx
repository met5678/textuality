import React from 'react';
import RacePixiWrapper from './RacePixi/RacePixiWrapper';
import { RaceWithHelpers } from '/imports/api/themes/derby/race/races';
import { JockeyCams, JOCKEYCAM_AREA_HEIGHT } from './JockeyCams/JockeyCams';

export const RaceActiveSubsceen: React.FC<{ race: RaceWithHelpers }> = ({
  race,
}) => {
  return (
    <div
      id="horse-race-active"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          flex: 1,
          minHeight: 0,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <RacePixiWrapper race={race} />
      </div>
      <JockeyCams race={race} />
    </div>
  );
};
