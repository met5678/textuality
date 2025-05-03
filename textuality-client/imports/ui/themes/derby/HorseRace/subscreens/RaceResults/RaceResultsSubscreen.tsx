import React from 'react';
import { RaceWithHelpers } from '/imports/api/themes/derby/race/races';
import RaceResultsWinners from './RaceResultsWinners';
import {
  COLOR_DERBY_BLACK,
  COLOR_DERBY_BURGUNDY,
} from '../../../DerbyStyleVars';

export const RaceResultsSubscreen = ({ race }: { race: RaceWithHelpers }) => {
  return (
    <div
      className="race-results-screen"
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        backgroundColor: COLOR_DERBY_BLACK,
      }}
    >
      <RaceResultsWinners raceId={race._id} />
      <audio
        id="race-results-audio"
        src="/derby/sounds/results-fanfare.mp3"
        autoPlay
      />
    </div>
  );
};
