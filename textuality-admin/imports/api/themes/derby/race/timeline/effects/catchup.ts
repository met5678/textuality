import { RaceWithHelpers } from '../../races';
import { BaseEffect } from './base-effect';
import { HorseId } from '/imports/schemas/derby/horse';

type CatchupEffectState = {
  horses: Record<
    HorseId,
    {
      // No persistent state needed for catchup
    }
  >;
};

// Maximum speed boost a horse can get from catchup (as a multiplier)
const MAX_CATCHUP_BOOST = 2;
// Distance in furlongs where catchup effect starts to kick in
const CATCHUP_START_DISTANCE = 0;
// Distance in furlongs where catchup effect reaches maximum
const MAX_CATCHUP_DISTANCE = 1.0;

export const CatchupEffect: BaseEffect<CatchupEffectState> = {
  effectType: null,
  init: (race: RaceWithHelpers) => {
    return {
      horses: race.horses.reduce(
        (acc, horse) => {
          acc[horse] = {};
          return acc;
        },
        {} as CatchupEffectState['horses'],
      ),
    };
  },

  generateEffectKeyframe: (...args) => null,

  updateHorseStates: (frame, race, horseStates, effectState, random) => {
    // Find the leading horse's position
    const leadingPosition = Math.max(
      ...horseStates.map((state) => state.position),
    );

    horseStates.forEach((horseState) => {
      const distanceFromLeader = leadingPosition - horseState.position;

      // Only apply catchup if the horse is behind by at least CATCHUP_START_DISTANCE
      if (distanceFromLeader > CATCHUP_START_DISTANCE) {
        // Calculate catchup boost based on distance from leader
        const catchupRatio = Math.min(
          (distanceFromLeader - CATCHUP_START_DISTANCE) /
            (MAX_CATCHUP_DISTANCE - CATCHUP_START_DISTANCE),
          1.0,
        );

        // Apply boost to speed multiplier
        const catchupBoost = 1.0 + (MAX_CATCHUP_BOOST - 1.0) * catchupRatio;
        horseState.speedMultiplier *= catchupBoost;
      }
    });
  },
};
