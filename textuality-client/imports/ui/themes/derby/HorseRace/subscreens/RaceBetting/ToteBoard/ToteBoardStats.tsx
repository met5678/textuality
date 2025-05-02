import React from 'react';
import './ToteBoard.css';

import { RaceWithHelpers } from '/imports/api/themes/derby/race/races';
import { LedCharRow } from '../../../../modules/LedLights/LedCharRow';
import reactiveDate from '/imports/utils/reactive-date';
import { useTracker } from 'meteor/react-meteor-data';

export const ToteBoardStats: React.FC<{
  race: RaceWithHelpers;
}> = ({ race }) => {
  const now = useTracker(() => reactiveDate.get());

  return (
    <div className="tote-board-stats">
      <LedCharRow
        label="Betting"
        value={race.status === 'bets-open' ? 'open' : 'closed'}
        charCount={6}
      />

      <LedCharRow label="Race" value={race.number} charCount={2} />

      <LedCharRow
        label="Mins to race"
        value={Math.max(
          0,
          Math.ceil(
            (race.time_race_starts_at.getTime() - now.getTime()) / (1000 * 60),
          ),
        )}
        charCount={2}
      />

      <LedCharRow label="Furlongs" value={race.furlong_length} charCount={2} />

      <LedCharRow label="Conditions" value={race.weather} charCount={5} />
    </div>
  );
};
