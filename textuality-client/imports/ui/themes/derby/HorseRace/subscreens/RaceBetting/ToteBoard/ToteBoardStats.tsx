import React from 'react';
import './ToteBoard.css';

import { RaceWithHelpers } from '/imports/api/themes/derby/race/races';
import { LedCellRowRow } from '/imports/ui/themes/derby/modules/LedLights/LedCellRow';

export const ToteBoardStats: React.FC<{
  race: RaceWithHelpers;
}> = ({ race }) => {
  return (
    <div className="tote-board-stats">
      <LedCellRowRow
        label="Betting"
        value={race.status === 'bets-open' ? 'open' : 'closed'}
        cellCount={6}
      />

      <LedCellRowRow label="Race" value={race.number} cellCount={2} />

      <LedCellRowRow
        label="Mins to race"
        value={Math.max(
          0,
          Math.floor(
            (race.time_race_starts_at.getTime() - Date.now()) / (1000 * 60),
          ),
        )}
        cellCount={2}
      />

      <LedCellRowRow
        label="Furlongs"
        value={race.furlong_length}
        cellCount={2}
      />

      <LedCellRowRow label="Conditions" value={race.weather} cellCount={5} />
    </div>
  );
};
