import React from 'react';
import './ToteBoard.css';

import { RaceWithHelpers } from '/imports/api/themes/derby/race/races';
import { HorseWithHelpers } from '/imports/api/themes/derby/horse/horses';
import { ToteBoardDisplayRow } from './ToteBoardDisplayRow';

export const ToteBoardOdds: React.FC<{
  race: RaceWithHelpers;
  horses: HorseWithHelpers[];
}> = ({ race, horses }) => {
  console.log('horsesinrace', race.horses);
  console.log('horses', horses);

  const horseByNumber = horses.reduce(
    (acc, horse) => {
      acc[horse.number] = horse;
      return acc;
    },
    {} as Record<number, HorseWithHelpers>,
  );

  // JTG - need to sort horses by number
  const leftHorses = horses.slice(0, 4);
  const rightHorses = horses.slice(4, 8);

  return (
    <div className="tote-board-dds" style={{ maxWidth: '30%' }}>
      <span
        style={{
          width: '100%',
          textAlign: 'center',
          marginBottom: '16px',
          display: 'block',
        }}
      >
        Odds
      </span>
      <div
        className="tote-board-horses-grid"
        style={{ display: 'flex', justifyContent: 'space-between' }}
      >
        <div className="tote-board-horses-column">
          {leftHorses.map((horse) => {
            return (
              <div
                key={horse._id}
                className="tote-board-horse-odds"
                style={{ color: horseByNumber[horse.number].color }}
              >
                <ToteBoardDisplayRow
                  label={horse.number.toString()}
                  value={1}
                  cellCount={2}
                />
              </div>
            );
          })}
        </div>
        <div className="tote-board-horses-column">
          {rightHorses.map((horse) => {
            return (
              <div
                key={horse._id}
                className="tote-board-horse-odds"
                style={{ color: horseByNumber[horse.number].color }}
              >
                <ToteBoardDisplayRow
                  label={horse.number.toString()}
                  value={1}
                  cellCount={2}
                />
              </div>
            );
          })}
        </div>
      </div>
      <p
        style={{
          fontSize: '1.3rem',
          fontStyle: 'italic',
          marginTop: '24px',
          textAlign: 'center',
        }}
      >
        *Bigger odds means bigger payout!
      </p>
    </div>
  );
};
