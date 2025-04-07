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
const APPROXIMATE_SECONDS_PER_FURLONG = 40;

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

// Calculate a horse's base speed based on their stats and track condition
const calculateBaseSpeed = (
  horse: HorseWithHelpers,
  trackCondition: TrackCondition,
  random: () => number,
) => {
  const conditionModifier = TRACK_CONDITION_MODIFIERS[trackCondition];
  const tractionEffect = horse.stats.traction / 10; // Normalize to 0-1
  const speedEffect = horse.stats.speed / 10;
  const luckEffect = (horse.stats.luck / 10) * (random() * 0.2 - 0.1); // ±10% variation based on luck

  return (
    conditionModifier *
    (tractionEffect * 0.4 + speedEffect * 0.6) *
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
    baseSpeed: calculateBaseSpeed(horse, race.track_condition, random),
    endurance: horse.stats.endurance,
    currentSpeed: 0,
    keyframes: [] as RaceTimelineHorseKeyframe[],
    finishTime: 0,
    lastPosition: 0, // Track previous position for interpolation
    lastFrame: 0, // Track previous frame for interpolation
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

      // Store last position and frame for interpolation
      state.lastPosition = state.position;
      state.lastFrame = frame - KEYFRAME_INTERVAL_SECONDS;

      // Update horse's speed based on endurance
      // Maximum endurance value a horse can have, used to normalize endurance to a 0-1 scale
      const MAX_ENDURANCE = 10;
      const enduranceEffect = state.endurance / MAX_ENDURANCE;
      const speedVariation = random() * 3 - 0.05; // ±5% random variation
      state.currentSpeed =
        state.baseSpeed * (enduranceEffect * 0.7 + 0.3) * (1 + speedVariation);

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
