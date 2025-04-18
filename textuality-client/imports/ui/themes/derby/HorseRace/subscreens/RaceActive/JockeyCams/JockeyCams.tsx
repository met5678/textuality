import React from 'react';
import { RaceWithHelpers } from '/imports/api/themes/derby/race/races';

export const JOCKEYCAM_AREA_HEIGHT = 200;
export const JOCKEYCAM_AREA_WIDTH = (JOCKEYCAM_AREA_HEIGHT * 16) / 9;

const JockeyCam = () => {
  return (
    <div
      id="horse-race-jockey-camera"
      style={{
        backgroundColor: 'var(--derby-orange)',
      }}
    >
      <video
        style={{
          width: JOCKEYCAM_AREA_WIDTH,
          height: JOCKEYCAM_AREA_HEIGHT,
        }}
        src=""
      />
    </div>
  );
};

export const JockeyCams = ({ race }: { race: RaceWithHelpers }) => {
  return (
    <div
      id="horse-race-jockey-cameras"
      style={{
        width: '100%',
        height: JOCKEYCAM_AREA_HEIGHT,
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'stretch',
        backgroundColor: 'var(--derby-burgundy)',
      }}
    >
      <JockeyCam />
      <JockeyCam />
      <JockeyCam />
    </div>
  );
};
