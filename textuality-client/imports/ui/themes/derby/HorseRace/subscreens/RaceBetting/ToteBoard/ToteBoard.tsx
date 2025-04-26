import React from 'react';
import { useState, useEffect, useRef } from 'react';

import './ToteBoard.css';
import { RaceWithHelpers } from '/imports/api/themes/derby/race/races';
import { HorseWithHelpers } from '/imports/api/themes/derby/horses/horses';

import { ToteBoardOdds } from './ToteBoardOdds';
import { ToteBoardStats } from './ToteBoardStats';
import { ToteBoardActivity } from './ToteBoardActivity';

export const ToteBoard: React.FC<{
  race: RaceWithHelpers;
  horses: HorseWithHelpers[];
}> = ({ race, horses }) => {
  const [scale, setScale] = useState(1);
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (boardRef.current) {
      const { width } = boardRef.current.getBoundingClientRect();
      const baseWidth = 1100; // aspect ratio 1100/440
      setScale(width / baseWidth);
    }
  }, []);

  return (
    <div className="tote-board" ref={boardRef}>
      <div
        className="tote-board-container"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: '1100px',
          height: '440px',
        }}
      >
        <ToteBoardStats race={race} />
        <ToteBoardOdds race={race} horses={horses} />
        <ToteBoardActivity />
      </div>
    </div>
  );
};
