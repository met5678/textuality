import React from 'react';
import './ToteBoard.css';
import fontColorContrast from 'font-color-contrast';

import { RaceWithHelpers } from '/imports/api/themes/derby/race/races';
import { HorseWithHelpers } from '/imports/api/themes/derby/horses/horses';
import { LedCharRow } from '../../../../modules/LedLights/LedCharRow';

const HorseColumn: React.FC<{
  horses: HorseWithHelpers[];
  race: RaceWithHelpers;
}> = ({ horses, race }) => {
  // JTG - Should I use useMemo here & odds below?
  const horsesByNumber = horses.reduce(
    (acc, horse) => {
      acc[horse.number] = horse;
      return acc;
    },
    {} as Record<number, HorseWithHelpers>,
  );

  const horseOdds = race.odds.reduce(
    (acc, odds) => {
      acc[odds.horse] = odds.odds;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div
      className="tote-board-horses-column"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}
    >
      {horses.map((horse) => {
        return (
          <div key={horse._id} className="tote-board-horse-odds">
            <LedCharRow
              label={
                <div
                  style={{
                    backgroundColor: horsesByNumber[horse.number].color,
                    width: '84px',
                    height: '60px',
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    textShadow: '0px 2px 2px rgba(0, 0, 0, 0.25)',
                    filter: 'drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.5))',
                    marginRight: '.2rem',
                  }}
                >
                  <span
                    style={{
                      fontSize: '30px',
                      paddingTop: '10px',
                      paddingLeft: '2px',
                      color: fontColorContrast(
                        horsesByNumber[horse.number].color,
                        0.6,
                      ),
                    }}
                  >
                    {horse.short_name}
                  </span>
                </div>
              }
              value={horseOdds[horse._id] ?? '--'}
              charCount={2}
            />
          </div>
        );
      })}
    </div>
  );
};

export const ToteBoardOdds: React.FC<{
  race: RaceWithHelpers;
  horses: HorseWithHelpers[];
}> = ({ race, horses }) => {
  const orderedHorses = [...horses].sort((a, b) => a.number - b.number);

  return (
    <div className="tote-board-odds">
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
        <HorseColumn horses={orderedHorses.slice(0, 4)} race={race} />
        <HorseColumn horses={orderedHorses.slice(4, 8)} race={race} />
      </div>
      <p className="tote-board-note" style={{ marginTop: '16px' }}>
        Bigger odds = bigger payout! (Odds shown as "X to 1")
      </p>
    </div>
  );
};
