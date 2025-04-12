import React, { useEffect, useRef, useState } from 'react';
import { RacePixi } from './RacePixi';
import { RaceController } from './RaceController';
import { RaceWithHelpers } from '/imports/api/themes/derby/race/races';
import useResizeObserver from 'use-resize-observer';
import { Ticker } from 'pixi.js';

const RacePixiWrapper = ({ race }: { race: RaceWithHelpers }) => {
  const tickerRef = useRef<Ticker>(new Ticker());
  const containerRef = useRef<HTMLDivElement>(null);
  const raceController = useRef<RaceController>(
    new RaceController(tickerRef.current),
  );
  const pixiApp = useRef<RacePixi>(
    new RacePixi(raceController.current, tickerRef.current),
  );

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

  useEffect(() => {
    if (tickerRef.current) {
      tickerRef.current.start();
    }
  }, [tickerRef]);

  return (
    <div
      style={{ width: '100%', height: '100%', overflow: 'hidden' }}
      ref={containerRef}
    />
  );
};

export default RacePixiWrapper;
