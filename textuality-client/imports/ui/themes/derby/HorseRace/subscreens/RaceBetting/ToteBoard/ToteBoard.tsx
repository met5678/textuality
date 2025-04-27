import React from 'react';
import { useState, useEffect, useRef } from 'react';

import './ToteBoard.css';
import { RaceWithHelpers } from '/imports/api/themes/derby/race/races';
import { HorseWithHelpers } from '/imports/api/themes/derby/horses/horses';

import { ToteBoardOdds } from './ToteBoardOdds';
import { ToteBoardStats } from './ToteBoardStats';
import { ToteBoardActivity } from './ToteBoardActivity';
import { ToteBoardAccents } from './ToteBoardAccents';
import { Weather } from '/imports/schemas/derby/race';

export const ToteBoard: React.FC<{
  race: RaceWithHelpers;
  horses: HorseWithHelpers[];
  weather: Weather;
}> = ({ race, horses, weather }) => {
  const [scale, setScale] = useState(1);
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (boardRef.current) {
      const { width } = boardRef.current.getBoundingClientRect();
      const baseWidth = 1200; // aspect ratio 1100/440
      setScale(width / baseWidth);
    }
  }, []);

  return (
    <div className="tote-board-wrapper">
      <div className="tote-board" ref={boardRef}>
        <div
          className="tote-board-container"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            width: '1200px',
            height: '440px',
            boxSizing: 'border-box',
          }}
        >
          <div className="tote-board-top-frame" />
          <div className="tote-board-body">
            <ToteBoardStats race={race} />
            <ToteBoardOdds race={race} horses={horses} />
            <ToteBoardActivity />
          </div>
        </div>
      </div>
      <div
        className="tote-board-roses-wrapper"
        style={{
          height: window.innerHeight > 900 ? '270px' : '180px',
          transform:
            window.innerHeight > 900 ? 'translateY(65%)' : 'translateY(50%)',
        }}
      >
        {/* <div className="tote-board-roses-container"> */}
        <div className="tote-board-roses">
          <ToteBoardAccents src="/derby/images/roses.webp" weather={weather} />
        </div>
        <div className="tote-board-roses">
          <ToteBoardAccents src="/derby/images/roses.webp" weather={weather} />
        </div>
        <div className="tote-board-roses">
          <ToteBoardAccents src="/derby/images/roses.webp" weather={weather} />
        </div>
      </div>
    </div>
  );
};
