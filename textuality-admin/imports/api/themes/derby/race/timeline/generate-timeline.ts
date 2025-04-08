import { HorseWithHelpers } from '../../horse/horses';
import {
  Race,
  RaceTimeline,
  RaceTimelineHorseKeyframe,
  TrackCondition,
} from '/imports/schemas/derby/race';
import seedrandom from 'seedrandom';

/** How many seconds each keyframe represents */
const KEYFRAME_INTERVAL_SECONDS = 1;
const APPROXIMATE_SECONDS_PER_FURLONG = 6;

export const OVERRUN_DISTANCE = 0.5; // furlongs to run past finish line

/** Mostly to prevent infinite loops */
const MAX_FRAMES = 200;

// Track condition modifiers
const TRACK_CONDITION_MODIFIERS: Record<TrackCondition, number> = {
  dry: 1.0,
  soggy: 0.8,
  muddy: 0.6,
};

// Increased base speed to make races faster
const BASE_SPEED = 1.4;

export type HorseState = {
  horse: HorseWithHelpers;
  position: number;
  finished: boolean;
  decelerating: boolean;
  baseSpeed: number;
  endurance: number;
  currentSpeed: number;
  keyframes: RaceTimelineHorseKeyframe[];
  finishTime: number;
  lastPosition: number;
  lastFrame: number;
  deceleration_start_frame: number;
};

// Calculate a horse's base speed based on their stats, track condition, and race length
const calculateBaseSpeed = (
  horse: HorseWithHelpers,
  trackCondition: TrackCondition,
  raceLength: number,
  random: () => number,
) => {
  const conditionModifier = TRACK_CONDITION_MODIFIERS[trackCondition];
  const speedEffect = horse.stats.speed / 10;

  // Calculate race length factor (0-1)
  // 5 furlongs = 0, 12 furlongs = 1
  const raceLengthFactor = Math.max(0, (raceLength - 5) / 5);

  // Add slight speed boost for shorter races
  const raceLengthSpeedBoost = 1 + (1 - raceLengthFactor) * 0.2; // Up to 20% faster for short races

  // Target completing each furlong in APPROXIMATE_SECONDS_PER_FURLONG seconds
  // Adjust by speed stat and track condition
  return BASE_SPEED * conditionModifier * speedEffect * raceLengthSpeedBoost;
};

export const generateTimelineWithResults = (
  race: Race,
  horses: HorseWithHelpers[],
  seed?: number,
) => {
  const random = seedrandom((seed ?? Math.random()).toString());

  const timeline: RaceTimeline = {
    horses: {},
    effects: {},
    current_frame: 0,
  };

  // Initialize each horse's state
  const horseStates = horses.map((horse) => ({
    horse,
    position: 0,
    finished: false,
    decelerating: false,
    baseSpeed: calculateBaseSpeed(
      horse,
      race.track_condition,
      race.furlong_length,
      random,
    ),
    endurance: horse.stats.endurance,
    currentSpeed: 0,
    keyframes: [] as RaceTimelineHorseKeyframe[],
    finishTime: 0,
    lastPosition: 0,
    lastFrame: 0,
    deceleration_start_frame: 0,
  }));

  // Add initial keyframe at position 0 for all horses
  horseStates.forEach((state) => {
    state.keyframes.push({
      frame: 0,
      position: 0,
      horse: state.horse._id,
      status: 'still',
      jockey_status: 'still',
      interpolation: 'linear',
    });
  });

  let frame = KEYFRAME_INTERVAL_SECONDS;
  let allFinished = false;

  while (!allFinished && frame < MAX_FRAMES) {
    allFinished = true;

    horseStates.forEach((state) => {
      if (state.finished) return;

      state.lastPosition = state.position;
      state.lastFrame = frame - KEYFRAME_INTERVAL_SECONDS;

      // Calculate race progress (0 to 1)
      const raceProgress = state.position / race.furlong_length;

      // Calculate endurance effect
      // For a 5 furlong race, start ramping at 0.4 (2 furlongs)
      // For a 12 furlong race, start ramping at 0.25 (3 furlongs)
      const enduranceRampStart = 0.4 - (race.furlong_length - 5) * 0.025;

      let enduranceMultiplier = 1.0;
      if (raceProgress > enduranceRampStart) {
        // How far into the endurance phase we are (0 to 1)
        const endurancePhaseProgress =
          (raceProgress - enduranceRampStart) / (1 - enduranceRampStart);

        // Convert endurance stat to 0 to 1 range
        const enduranceEffect = state.horse.stats.endurance / 20;

        // Base fatigue makes all horses slow down as race progresses
        // At endurance 20: drops to 60% speed
        // At endurance 10: drops to 40% speed
        // At endurance 0: drops to 20% speed
        const baseFatigue = 0.8 * endurancePhaseProgress;
        const enduranceMitigation =
          0.6 * enduranceEffect * endurancePhaseProgress;

        enduranceMultiplier = 1 - baseFatigue + enduranceMitigation;
      }

      // Add random variation each frame (±10% variation)
      const speedVariation = 1 + (random() * 1 - 0.5);

      // Update horse's speed based on endurance and variation
      state.currentSpeed =
        state.baseSpeed * enduranceMultiplier * speedVariation;

      // Update position
      state.position +=
        (state.currentSpeed * KEYFRAME_INTERVAL_SECONDS) /
        APPROXIMATE_SECONDS_PER_FURLONG;

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

      if (state.position >= race.furlong_length + OVERRUN_DISTANCE) {
        state.finished = true;
        state.currentSpeed = 0;
        state.position = race.furlong_length + OVERRUN_DISTANCE;
      }

      // Only set allFinished to false if the horse hasn't finished
      if (!state.finished) {
        allFinished = false;
      }

      // Reduce endurance over time
      state.endurance = Math.max(0, state.endurance - 0.1);

      // Create keyframe
      const keyframe: RaceTimelineHorseKeyframe = {
        frame,
        position: state.position,
        horse: state.horse._id,
        status: state.endurance < 5 ? 'trotting' : 'running',
        jockey_status: state.decelerating ? 'still' : 'riding',
        interpolation: 'linear',
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
