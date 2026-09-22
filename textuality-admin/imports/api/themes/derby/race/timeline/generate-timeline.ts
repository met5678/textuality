import { HorseWithHelpers } from '../../horses/horses';
import { BaseEffect } from './effects/base-effect';
import { LightningEffect } from './effects/lightning';
import { RaceTimeline, Weather } from '/imports/schemas/derby/race';
import seedrandom from 'seedrandom';
import {
  HorseEffect,
  RaceTimelineHorseKeyframe,
} from '/imports/schemas/derby/race-timeline/types';
import { RaceWithHelpers } from '../races';
import { FatigueEffect } from './effects/fatigue';
import { WindEffect } from './effects/wind';
import { CatchupEffect } from './effects/catchup';

/** How many seconds each keyframe represents */
export const KEYFRAME_INTERVAL_SECONDS = 1;
const APPROXIMATE_SECONDS_PER_FURLONG = 8;

export const OVERRUN_DISTANCE_FURLONGS = 0.5; // furlongs to run past finish line

/** Mostly to prevent infinite loops */
export const MAX_TIMELINE_SECONDS = 200;

export type HorseState = {
  horse: HorseWithHelpers;
  position: number;
  baseSpeed: number;
  currentSpeed: number;
  keyframes: RaceTimelineHorseKeyframe[];
  effects: HorseEffect[];

  /** How tired the horse is. 0 is not tired at all. 10 is exhausted. */
  fatigue: number;

  /** Multiplier to apply to the horse's speed. Meant to be
   * used by effects to modify the horse's speed.
   */
  speedMultiplier: number;

  finished: boolean;
  finishTime: number;
  lastPosition: number;
  lastFrame: number;
};

const WEATHER_MODIFIERS: Record<Weather, number> = {
  clear: 1.0,
  windy: 1.0,
  rain: 0.85,
  storm: 0.85,
};

// Calculate a horse's base speed based on their stats, track condition, and race length
const calculateBaseSpeed = (
  horse: HorseWithHelpers,
  weather: Weather,
  raceLength: number,
) => {
  const conditionModifier = WEATHER_MODIFIERS[weather];
  const speedEffect = 1 + (horse.stats().speed - 10) / 20;

  // Use the horse's water_resistance stat to modify the horse's speed
  // in rain and storm conditions. Water resistance, like the other stats,
  // has a base value of 10 (can go lower).
  let waterResistanceModifier = 1;

  if (weather === 'rain' || weather === 'storm') {
    // For rain/storm, water resistance acts as a speed modifier
    // Base water resistance (10) = no effect
    // Lower water resistance = slower speed
    // Higher water resistance = faster speed
    const waterResistance = horse.stats().water_resistance;
    waterResistanceModifier = waterResistance / 10;
  }

  let windResistanceModifier = 1;

  if (weather === 'windy' || weather === 'storm') {
    // For windy/storm, wind resistance acts as a speed modifier
    // Base wind resistance (10) = no effect
    // Lower wind resistance = slower speed
    // Higher wind resistance = faster speed
    const windResistance = horse.stats().wind_resistance;
    windResistanceModifier = 1 + (windResistance - 10) / 60;
  }

  // Target completing each furlong in APPROXIMATE_SECONDS_PER_FURLONG seconds
  // Adjust by speed stat and track condition
  return (
    conditionModifier *
    speedEffect *
    waterResistanceModifier *
    windResistanceModifier
  );
};

const EFFECTS: BaseEffect<any>[] = [
  WindEffect,
  LightningEffect,
  FatigueEffect,
  CatchupEffect,
];

const initializeHorseStates = (
  race: RaceWithHelpers,
  horses: HorseWithHelpers[],
) => {
  // Initialize each horse's state
  return horses.map((horse) => ({
    horse,
    position: 0,
    baseSpeed: calculateBaseSpeed(horse, race.weather, race.furlong_length),
    fatigue: 0,
    currentSpeed: 0,
    keyframes: [] as RaceTimelineHorseKeyframe[],
    effects: [] as HorseEffect[],
    speedMultiplier: 1,

    finished: false,
    finishTime: 0,
    lastPosition: 0,
    lastFrame: 0,
  }));
};

export const generateTimelineWithResults = (
  race: RaceWithHelpers,
  horses: HorseWithHelpers[],
  seed?: number,
) => {
  const random = seedrandom((seed ?? Math.random()).toString());

  const timeline: RaceTimeline = {
    horses: {},
    effects: {},
    current_frame: 0,
    is_playing: false,
  };

  const horseStates = initializeHorseStates(race, horses);

  const effectStates: Map<BaseEffect<any>, any> = new Map();

  EFFECTS.forEach((effect) => {
    effectStates.set(effect, effect.init(race));
    if (effect.effectType) {
      timeline.effects[effect.effectType] = [];
    }
  });

  let frame = 0;
  let allFinished = false;

  while (!allFinished && frame < MAX_TIMELINE_SECONDS) {
    allFinished = true;

    horseStates.forEach((state) => {
      if (state.finished) return;

      state.lastPosition = state.position;
      state.lastFrame = frame - KEYFRAME_INTERVAL_SECONDS;
      state.position +=
        (state.currentSpeed * KEYFRAME_INTERVAL_SECONDS) /
        APPROXIMATE_SECONDS_PER_FURLONG;

      state.speedMultiplier = 1;
    });

    // Run through effects
    EFFECTS.forEach((effect) => {
      if (effect.effectType) {
        const effectKeyframe = effect.generateEffectKeyframe(
          frame,
          race,
          horseStates,
          effectStates.get(effect),
          random,
        );
        if (effectKeyframe) {
          timeline.effects[effect.effectType].push(effectKeyframe);
        }
      }

      effect.updateHorseStates(
        frame,
        race,
        horseStates,
        effectStates.get(effect),
        random,
      );
    });

    horseStates.forEach((state) => {
      // Update horse's speed based on endurance and variation.
      // Add a bit of randomness to the speed to make it more interesting.
      state.currentSpeed =
        state.baseSpeed * state.speedMultiplier * (0.8 + random() * 0.4);

      // Check if horse finished
      if (state.position >= race.furlong_length && !state.finishTime) {
        // Calculate interpolated finish time
        const positionDelta = state.position - state.lastPosition;
        const frameDelta = frame - state.lastFrame;
        const distanceToFinish = race.furlong_length - state.lastPosition;
        const interpolatedTime =
          state.lastFrame + (distanceToFinish / positionDelta) * frameDelta;
        state.finishTime = interpolatedTime;
      }

      if (state.position >= race.furlong_length + OVERRUN_DISTANCE_FURLONGS) {
        state.finished = true;
        state.currentSpeed = 0;
        state.position = race.furlong_length + OVERRUN_DISTANCE_FURLONGS;
      }

      // Only set allFinished to false if the horse hasn't finished
      if (!state.finished) {
        allFinished = false;
      }

      // Create keyframe
      const keyframe: RaceTimelineHorseKeyframe = {
        frame,
        position: state.position,
        horse: state.horse._id,
        status: state.currentSpeed < 5 ? 'trotting' : 'running',
        effects: state.effects,
      };

      state.keyframes.push(keyframe);
    });

    frame += KEYFRAME_INTERVAL_SECONDS;
  }

  // Add all keyframes to the timeline
  horseStates.forEach((state) => {
    timeline.horses[state.horse._id] = state.keyframes;
  });

  // Calculate race results
  const sortedHorses = [...horseStates].sort(
    (a, b) => a.finishTime - b.finishTime,
  );
  const results = sortedHorses.map((state, index) => ({
    horse: state.horse._id,
    time: Number(state.finishTime.toFixed(3)), // Round to 3 decimal places
    placement: index + 1,
  }));

  return {
    timeline,
    results,
  };
};
