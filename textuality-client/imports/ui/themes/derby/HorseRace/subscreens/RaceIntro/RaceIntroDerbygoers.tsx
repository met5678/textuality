import React, { useEffect, useRef } from 'react';
import { RaceWithHelpers } from '/imports/api/themes/derby/race/races';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const EUROSTILE_FONT_FAMILY = 'eurostile, sans-serif';
const COLORS = {
  DERBY_BURGUNDY: '#681E22',
  DERBY_BEIGE: '#C4B090',
  DERBY_BLACK: '#16171B',
  DERBY_OFF_WHITE: '#FEFAE7',
  DERBY_ORANGE: '#945226',
};

const DERBYGOER_PATH_TEMPLATE =
  '/derby/videos/group/group-pose-#-landscape.mp4';

export const RaceIntroDerbygoers = ({
  race,
  active,
}: {
  race: RaceWithHelpers;
  active: boolean;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (active && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    } else if (videoRef.current) {
      videoRef.current.pause();
    }
  }, [active]);

  useGSAP(() => {
    // Animation setup will be handled by parent component
  });

  return (
    <div
      style={{
        position: 'absolute',
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <video
        ref={videoRef}
        src={DERBYGOER_PATH_TEMPLATE.replace(
          '#',
          Math.max(race.number, 1).toString(),
        )}
        muted
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  );
};
