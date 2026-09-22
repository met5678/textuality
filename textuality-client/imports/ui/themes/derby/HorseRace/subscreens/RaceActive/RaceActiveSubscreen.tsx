import React, { useEffect, useRef } from 'react';
import RacePixiWrapper from './RacePixi/RacePixiWrapper';
import { RaceWithHelpers } from '/imports/api/themes/derby/race/races';
import { JockeyCams, JOCKEYCAM_AREA_HEIGHT } from './JockeyCams/JockeyCams';
import { Ticker } from 'pixi.js';
import { RaceController } from './RacePixi/RaceController';
import { WeatherOverlay } from '../../WeatherOverlay/WeatherOverlay';
import { WeatherSounds } from '../../WeatherSounds';
import { RaceSounds } from './RaceSounds';

export const RaceActiveSubsceen: React.FC<{ race: RaceWithHelpers }> = ({
  race,
}) => {
  const tickerRef = useRef<Ticker>();
  const raceControllerRef = useRef<RaceController>();

  if (!tickerRef.current) {
    tickerRef.current = new Ticker();
  }
  if (!raceControllerRef.current) {
    raceControllerRef.current = new RaceController(tickerRef.current);
  }

  useEffect(() => {
    if (!tickerRef.current) {
      tickerRef.current = new Ticker();
    }
    if (!raceControllerRef.current) {
      raceControllerRef.current = new RaceController(tickerRef.current);
    }
    tickerRef.current.start();
    return () => {
      if (raceControllerRef.current) {
        raceControllerRef.current.destroy();
        raceControllerRef.current = undefined;
      }
      if (tickerRef.current) {
        tickerRef.current.stop();
      }
    };
  }, [tickerRef, raceControllerRef]);

  useEffect(() => {
    if (raceControllerRef.current) {
      raceControllerRef.current.initRace(race);
    }
  }, [raceControllerRef, race._id]);

  if (!tickerRef.current || !raceControllerRef.current) {
    return null;
  }

  return (
    <div
      id="horse-race-active"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          flex: 1,
          minHeight: 0,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <RacePixiWrapper
          ticker={tickerRef.current}
          raceController={raceControllerRef.current}
        />
        <WeatherOverlay
          weather={race.weather}
          raceController={raceControllerRef.current}
        />
        <WeatherSounds
          weather={race.weather}
          raceController={raceControllerRef.current}
        />
      </div>
      <JockeyCams race={race} />
      <RaceSounds race={race} raceController={raceControllerRef.current} />
    </div>
  );
};
