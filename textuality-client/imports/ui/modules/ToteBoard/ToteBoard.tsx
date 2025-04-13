import React from 'react';
import { RaceWithHelpers } from '/imports/api/themes/derby/race/races';
import { HorseWithHelpers } from '/imports/api/themes/derby/horse/horses';

export const ToteBoard: React.FC<{
  race: RaceWithHelpers;
  horses: HorseWithHelpers[];
}> = ({ race, horses }) => {
  return (
    <div
      className="tote-board"
      style={{
        backgroundColor: '#2E2E2E',
        borderRadius: '6px',
        boxShadow: '0 30px 50px rgba(0, 0, 0, 0.4)',
        position: 'relative',
        zIndex: '10',
        width: '100%',
        maxWidth: '980px',
        height: '440px',
        top: window.innerHeight < 580 ? '0px' : '-20px',
        padding: '24px',
      }}
    >
      {horses.map((horse) => {
        return (
          <div key={horse._id}>
            <div>{horse.name}</div>
          </div>
        );
      })}
    </div>
  );
};
