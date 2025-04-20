import React from 'react';
import './ToteBoard.css';

import { getContrastColor } from '/imports/utils/get-contrast-color';
import { RaceWithHelpers } from '/imports/api/themes/derby/race/races';
import { HorseWithHelpers } from '/imports/api/themes/derby/horses/horses';
import { ToteBoardDisplayRow } from './ToteBoardDisplayRow';

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
        gap: '16px',
      }}
    >
      {horses.map((horse) => {
        return (
          <div
            key={horse._id}
            className="tote-board-horse-odds"
            style={{ display: 'flex', gap: '4px', alignItems: 'flex-end' }}
          >
            <ToteBoardDisplayRow
              label={
                <div
                  style={{
                    backgroundColor: horsesByNumber[horse.number].color,
                    width: '50px',
                    height: '40px',
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingLeft: '3px',
                    textShadow: '0px 1px 1px rgba(0, 0, 0, 0.25)',
                  }}
                >
                  <span
                    style={{
                      color: getContrastColor(
                        horsesByNumber[horse.number].color,
                      ),
                    }}
                  >
                    {horse.number.toString()}
                  </span>
                </div>
              }
              value={horseOdds[horse._id] ?? '--'}
              cellCount={2}
            />
            {/* <p
              className="tote-board-note"
              style={{
                marginLeft: '2px',
                fontSize: '1.4rem',
                fontFamily: 'gin',
                fontStyle: 'normal',
                lineHeight: '1.2',
              }}
            >
              :1
            </p> */}
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
    <div className="tote-board-odds" style={{ maxWidth: '35%' }}>
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
      <p className="tote-board-note" style={{ marginTop: '24px' }}>
        Bigger odds = bigger payout! (Odds shown as "X to 1")
      </p>
    </div>
  );
};
