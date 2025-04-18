import React from 'react';
import './ToteBoard.css';
import { RaceWithHelpers } from '/imports/api/themes/derby/race/races';
import { HorseWithHelpers } from '/imports/api/themes/derby/horses/horses';

import { ToteBoardOdds } from './ToteBoardOdds';
import { ToteBoardStats } from './ToteBoardStats';

export const ToteBoard: React.FC<{
  race: RaceWithHelpers;
  horses: HorseWithHelpers[];
}> = ({ race, horses }) => {
  return (
    <div className="tote-board">
      <ToteBoardStats race={race} />
      <ToteBoardOdds race={race} horses={horses} />
      <div className="tote-board-activity" style={{ flex: 1 }}>
        <div
          className="placholder"
          style={{
            width: '100%',
            height: '95%',
            backgroundColor: '#181818',
            borderRadius: '2px',
          }}
        />
      </div>
    </div>
  );
};
