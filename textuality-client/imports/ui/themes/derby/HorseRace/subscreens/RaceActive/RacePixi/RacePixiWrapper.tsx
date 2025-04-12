import React, { useEffect, useRef, useState } from 'react';
import { RacePixi } from './RacePixi';
import { RaceController } from './RaceController';
import { RaceWithHelpers } from '/imports/api/themes/derby/race/races';
import useResizeObserver from 'use-resize-observer';

const RacePixiWrapper = ({ race }: { race: RaceWithHelpers }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const raceController = useRef<RaceController>(new RaceController());
  const pixiApp = useRef<RacePixi>(new RacePixi(raceController.current));

  const { width = 1, height = 1 } = useResizeObserver<HTMLDivElement>({
    ref: containerRef,
  });

  console.log('RacePixiWrapper', { race });

  useEffect(() => {
    if (containerRef.current) {
      pixiApp.current.init(containerRef.current);
    }
  }, [containerRef]);

  useEffect(() => {
    if (raceController.current) {
      raceController.current.initRace(race);
    }
  }, [raceController, race]);

  useEffect(() => {
    if (raceController.current) {
      raceController.current.setSize(width, height);
    }
  }, [raceController, width, height]);

  return (
    <div
      style={{ width: '100%', height: '100%', overflow: 'hidden' }}
      ref={containerRef}
    />
  );
};

export default RacePixiWrapper;
