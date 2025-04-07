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

export const DECELERATION_DISTANCE = 0.1; // furlongs to decelerate over
const DECELERATION_FRAMES = 10; // number of frames to spread deceleration over

/** Mostly to prevent infinite loops */
const MAX_FRAMES = 200;

// Track condition modifiers
const TRACK_CONDITION_MODIFIERS: Record<TrackCondition, number> = {
  dry: 1.0,
  soggy: 0.8,
  muddy: 0.6,
  icy: 0.4,
};

// Increased base speed to make races faster
const BASE_SPEED = 1.4;

// Calculate a horse's base speed based on their stats, track condition, and race length
const calculateBaseSpeed = (
  horse: HorseWithHelpers,
  trackCondition: TrackCondition,
  raceLength: number,
  random: () => number,
) => {
  const conditionModifier = TRACK_CONDITION_MODIFIERS[trackCondition];
  const speedEffect = horse.stats.speed / 10;
  const enduranceEffect = horse.stats.endurance / 10;
  const luckEffect = (horse.stats.luck / 10) * (random() * 0.2 - 0.1); // ±10% variation based on luck

  // Calculate race length factor (0-1)
  // 5 furlongs = 0, 12 furlongs = 1
  const raceLengthFactor = Math.max(0, (raceLength - 5) / 5);

  // Add slight speed boost for shorter races
  const raceLengthSpeedBoost = 1 + (1 - raceLengthFactor) * 0.2; // Up to 20% faster for short races

  // Blend speed and endurance based on race length
  // Shorter races favor speed, longer races favor endurance
  // Reduced from 0.7 to 0.3 to make the tradeoff less pronounced
  const speedEnduranceBlend =
    speedEffect * (1 - raceLengthFactor * 0.3) +
    enduranceEffect * (raceLengthFactor * 0.3);

  return (
    BASE_SPEED *
    conditionModifier *
    speedEnduranceBlend *
    raceLengthSpeedBoost *
    (1 + luckEffect)
  );
};

export const generateTimelineWithResults = (
  race: Race,
  horses: HorseWithHelpers[],
  seed?: number,
) => {
  const random = seedrandom((seed ?? Math.random()).toString());

  const timeline: RaceTimeline = {
    horses: {},
    events: {},
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

      // Update horse's speed based on endurance
      const MAX_ENDURANCE = 10;
      const enduranceEffect = state.endurance / MAX_ENDURANCE;
      // Increased speed variation from ±5% to ±15%
      const speedVariation = random() * 0.3 - 0.15;

      // Adjust speed based on endurance and race progress
      const raceProgress = state.position / race.furlong_length;
      // Reduced endurance impact from 0.5 to 0.3
      const enduranceImpact = enduranceEffect * (1 - raceProgress * 0.3);

      state.currentSpeed =
        state.baseSpeed * (enduranceImpact * 0.7 + 0.3) * (1 + speedVariation);

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

      if (state.position >= race.furlong_length) {
        if (!state.decelerating) {
          state.decelerating = true;
          state.position = race.furlong_length;
        } else {
          // During deceleration, gradually reduce speed
          const decelerationProgress = Math.min(
            1,
            (state.position - race.furlong_length) / DECELERATION_DISTANCE,
          );
          state.currentSpeed *= 1 - decelerationProgress;
          state.position =
            race.furlong_length + decelerationProgress * DECELERATION_DISTANCE;

          if (decelerationProgress >= 1) {
            state.finished = true;
            state.currentSpeed = 0;
          }
        }
      } else {
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

  console.log({ results });

  return {
    timeline,
    results,
  };
};
