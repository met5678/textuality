import React, { useRef } from 'react';
import { useScaleByBaseWidth } from '/imports/ui/hooks/use-scale-by-base-width';

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
  const boardRef = useRef<HTMLDivElement>(null);
  const scale = useScaleByBaseWidth(boardRef, 1700); //aspect ratio 1700/640

  const windowHeight = window.innerHeight;
  const marginOffset = windowHeight < 700 ? 100 : 200;

  return (
    <div className="tote-board-wrapper">
      <div className="tote-board" ref={boardRef}>
        <div
          className="tote-board-scaler"
          style={{
            transform: `scale(${scale})`,
            marginTop: `${(1 - scale) * marginOffset}px`,
            transformOrigin: 'top left',
            position: 'relative',
          }}
        >
          <div
            className="tote-board-container"
            style={{
              width: '1700px',
              height: '640px',
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

          <div
            className="tote-board-roses-container"
            style={{
              height: '300px',
              width: '2200px',
              bottom: '-200px',
              // Needed to use some weird numbers to make it look good on the projections - diff then screen, idk why
              marginLeft: windowHeight < 750 ? '-225px' : '-30px',
            }}
          >
            <div className="tote-board-roses">
              <ToteBoardAccents
                src="/derby/images/roses.webp"
                weather={weather}
              />
            </div>
            <div className="tote-board-roses">
              <ToteBoardAccents
                src="/derby/images/roses.webp"
                weather={weather}
              />
            </div>
            <div className="tote-board-roses">
              <ToteBoardAccents
                src="/derby/images/roses.webp"
                weather={weather}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
