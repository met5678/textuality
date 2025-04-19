import React, { useEffect, useRef, useState } from 'react';
import { RacePixi } from './RacePixi';
import { RaceController } from './RaceController';
import useResizeObserver from 'use-resize-observer';
import { Ticker } from 'pixi.js';

const RacePixiWrapper = ({
  raceController,
  ticker,
}: {
  raceController: RaceController;
  ticker: Ticker;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pixiApp = useRef<RacePixi>();

  const { width = 1, height = 1 } = useResizeObserver<HTMLDivElement>({
    ref: containerRef,
  });

  useEffect(() => {
    raceController.setSize(width, height);
  }, [raceController, width, height]);

  useEffect(() => {
    if (!pixiApp.current) {
      pixiApp.current = new RacePixi(raceController, ticker);
    }
    if (containerRef.current) {
      pixiApp.current.init(containerRef.current);
    }
    return () => {
      pixiApp.current?.destroy();
      pixiApp.current = undefined;
    };
  }, [pixiApp, containerRef, raceController, ticker]);

  return (
    <div
      style={{ width: '100%', height: '100%', overflow: 'hidden' }}
      ref={containerRef}
    />
  );
};

export default RacePixiWrapper;
