import { RaceWithHelpers } from '../../races';
import { BaseEffect } from './base-effect';
import { HorseId } from '/imports/schemas/derby/horse';

type FatigueEffectState = {
  horses: Record<
    HorseId,
    {
      fatigue: number;
    }
  >;
};

const MIN_FATIGUE_FOR_SPEED_REDUCTION = 0.2;

export const FatigueEffect: BaseEffect<FatigueEffectState> = {
  effectType: null,
  init: (race: RaceWithHelpers) => {
    return {
      horses: race.horses.reduce(
        (acc, horse) => {
          acc[horse] = {
            fatigue: -MIN_FATIGUE_FOR_SPEED_REDUCTION,
          };
          return acc;
        },
        {} as FatigueEffectState['horses'],
      ),
    };
  },

  generateEffectKeyframe: (...args) => null,

  updateHorseStates: (frame, race, horseStates, effectState, random) => {
    horseStates.forEach((horseState) => {
      const horseEffectState = effectState.horses[horseState.horse._id];
      const endurance = horseState.horse.stats.endurance / 20;

      // The most slowed down the horse can be by fatigue
      const minSpeedMultiplier = 0.3 + 0.5 * endurance;

      horseEffectState.fatigue += 0.03 * (1 - endurance);

      if (horseEffectState.fatigue > 0) {
        horseState.speedMultiplier *= Math.max(
          1 - horseEffectState.fatigue,
          minSpeedMultiplier,
        );
      }
    });
  },
};
