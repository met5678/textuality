import React from 'react';
import './ToteBoard.css';

import { RaceWithHelpers } from '/imports/api/themes/derby/race/races';
import { ToteBoardDisplayRow } from './ToteBoardDisplayRow';

export const ToteBoardStats: React.FC<{
  race: RaceWithHelpers;
}> = ({ race }) => {
  return (
    <div
      className="tote-board-stats"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        marginTop: '16px',
      }}
    >
      <ToteBoardDisplayRow
        label="Betting"
        value={race.status === 'bets-open' ? 'open' : 'closed'}
        cellCount={6}
      />

      <ToteBoardDisplayRow label="Race" value={race.number} cellCount={2} />

      <ToteBoardDisplayRow
        label="Mins to race"
        value={Math.max(
          0,
          Math.floor(
            (race.time_race_starts_at.getTime() - Date.now()) / (1000 * 60),
          ),
        )}
        cellCount={2}
      />

      <ToteBoardDisplayRow
        label="Furlongs"
        value={race.furlong_length}
        cellCount={2}
      />

      <ToteBoardDisplayRow
        label="Conditions"
        value={race.weather}
        cellCount={5}
      />
    </div>
  );
};
