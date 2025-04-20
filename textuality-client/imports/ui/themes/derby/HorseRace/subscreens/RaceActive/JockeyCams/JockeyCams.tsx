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
        borderLeft: '3px solid #222',
        borderRight: '3px solid #222',
      }}
    >
      <video
        style={{
          width: JOCKEYCAM_AREA_WIDTH,
          height: JOCKEYCAM_AREA_HEIGHT,
          objectFit: 'cover',
          filter: 'sepia(0.5)',
        }}
        src="/derby/videos/gray-derby-jockey-jockey1-horseside-goofy-tea.mp4"
        autoPlay
        muted
        loop
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
        backgroundImage: 'url(/derby/textures/wood.png)',
        backgroundRepeat: 'repeat',
        borderTop: '3px solid #222',
      }}
    >
      <JockeyCam />
      <JockeyCam />
      <JockeyCam />
    </div>
  );
};
