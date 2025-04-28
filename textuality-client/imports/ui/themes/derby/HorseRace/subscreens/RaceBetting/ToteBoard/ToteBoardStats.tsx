import React from 'react';
import './ToteBoard.css';

import { RaceWithHelpers } from '/imports/api/themes/derby/race/races';
import { LedCellRow } from '/imports/ui/themes/derby/modules/LedLights/LedCellRow';

export const ToteBoardStats: React.FC<{
  race: RaceWithHelpers;
}> = ({ race }) => {
  return (
    <div className="tote-board-stats">
      <LedCellRow
        label="Betting"
        value={race.status === 'bets-open' ? 'open' : 'closed'}
        cellCount={6}
      />

      <LedCellRow label="Race" value={race.number} cellCount={2} />

      <LedCellRow
        label="Mins to race"
        value={Math.max(
          0,
          Math.floor(
            (race.time_race_starts_at.getTime() - Date.now()) / (1000 * 60),
          ),
        )}
        cellCount={2}
      />

      <LedCellRow label="Furlongs" value={race.furlong_length} cellCount={2} />

      <LedCellRow label="Conditions" value={race.weather} cellCount={5} />
    </div>
  );
};
