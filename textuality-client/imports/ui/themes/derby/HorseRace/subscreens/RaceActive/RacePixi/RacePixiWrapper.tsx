import React, { useEffect, useRef, useState } from 'react';
import { RacePixi } from './RacePixi';
import { RaceController } from './RaceController';
import { Race } from '/imports/schemas/derby/race';
import { RaceWithHelpers } from '/imports/api/themes/derby/race/races';

const RacePixiWrapper = ({ race }: { race: RaceWithHelpers }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const raceController = useRef<RaceController>(new RaceController(race));
  const pixiApp = useRef<RacePixi>(new RacePixi(race));

  useEffect(() => {
    if (containerRef.current) {
      pixiApp.current.init(containerRef.current);
    }
  }, [containerRef]);

  return (
    <div
      style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}
      ref={containerRef}
    />
  );
};

export default RacePixiWrapper;
