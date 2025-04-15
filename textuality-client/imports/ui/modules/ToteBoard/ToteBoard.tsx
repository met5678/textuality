import React from 'react';
import './ToteBoard.css';
import { RaceWithHelpers } from '/imports/api/themes/derby/race/races';
import { HorseWithHelpers } from '/imports/api/themes/derby/horse/horses';
import { ToteBoardDisplayRow } from './ToteBoardDisplayRow';

export const ToteBoard: React.FC<{
  race: RaceWithHelpers;
  horses: HorseWithHelpers[];
}> = ({ race, horses }) => {
  const leftHorses = horses.slice(0, 4);
  const rightHorses = horses.slice(4, 8);

  return (
    <div
      className="tote-board"
      style={{
        top: window.innerHeight < 580 ? '0px' : '-20px',
      }}
    >
      <div
        className="tote-board-race"
        style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
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

      <div className="tote-board-horses" style={{ maxWidth: '30%' }}>
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
                <div key={horse._id} className="tote-board-horse-odds">
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
                <div key={horse._id} className="tote-board-horse-odds">
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
            fontSize: '1.5rem',
            fontStyle: 'italic',
            marginTop: '32px',
            textAlign: 'center',
          }}
        >
          *Bigger odds means bigger payout!
        </p>
      </div>

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
