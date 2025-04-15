import React from 'react';
import { RaceWithHelpers } from '/imports/api/themes/derby/race/races';

export const RaceBetWinnersSubscreen = ({
  race,
}: {
  race: RaceWithHelpers;
}) => {
  return (
    <div className="race-bet-winners-screen">
      <h1>Bet Winners</h1>
    </div>
  );
};
