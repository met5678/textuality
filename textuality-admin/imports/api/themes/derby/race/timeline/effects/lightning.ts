import { RaceWithHelpers } from '../../races';
import { HorseState } from '../generate-timeline';
import { BaseEffect } from './base-effect';
import { HorseId } from '/imports/schemas/derby/horse';
import { RaceTimelineEffectKeyframe } from '/imports/schemas/derby/race-timeline/types';

const LIGHTNING_STRIKE_MIN_INTERVAL = 10;
const LIGHTNING_STRIKE_MAX_INTERVAL = 30;
const LIGHTNING_STRIKE_CHANCE =
  1 / (LIGHTNING_STRIKE_MAX_INTERVAL - LIGHTNING_STRIKE_MIN_INTERVAL);

type LightningEffectState = {
  lastLightningStrike: number;
  lastLightningIntensity: number;

  horses: Record<
    HorseId,
    {
      isStruck: boolean;
      struckStart: number;
      struckTime: number;
    }
  >;
};

export const LightningEffect: BaseEffect<LightningEffectState> = {
  effectType: 'lightning',

  init: (race: RaceWithHelpers) => {
    return {
      lastLightningStrike: 0,
      lastLightningIntensity: 0,
      horses: race.horses.reduce(
        (acc, horse) => {
          acc[horse] = {
            isStruck: false,
            struckStart: 0,
            struckTime: 0,
          };
          return acc;
        },
        {} as LightningEffectState['horses'],
      ),
    };
  },

  generateEffectKeyframe: (
    frame: number,
    race: RaceWithHelpers,
    horseStates: HorseState[],
    effectState: LightningEffectState,
    random: () => number,
  ): RaceTimelineEffectKeyframe | null => {
    if (race.weather !== 'storm') return null;

    // Check if enough time has passed since last strike
    if (frame - effectState.lastLightningStrike < LIGHTNING_STRIKE_MIN_INTERVAL)
      return null;

    let shouldStrike = false;

    if (frame - effectState.lastLightningStrike > LIGHTNING_STRIKE_MAX_INTERVAL)
      shouldStrike = true;
    else if (random() < LIGHTNING_STRIKE_CHANCE) shouldStrike = true;

    if (!shouldStrike) return null;

    // Record the strike
    effectState.lastLightningStrike = frame;
    effectState.lastLightningIntensity = 5;

    // Return the visual event
    return {
      frame,
      effect: 'lightning',
      intensity: 5,
    };
  },

  updateHorseStates: (
    frame: number,
    race: RaceWithHelpers,
    horseStates: HorseState[],
    effectState: LightningEffectState,
    random: () => number,
  ): void => {
    if (race.weather !== 'storm') return;

    if (effectState.lastLightningStrike === frame) {
      horseStates.forEach((horseState) => {
        effectState.horses[horseState.horse._id] = {
          isStruck: true,
          struckStart: frame,
          struckTime: effectState.lastLightningIntensity,
        };
      });
    }

    horseStates.forEach((horseState) => {
      const horseEffectState = effectState.horses[horseState.horse._id];

      if (!horseEffectState.isStruck) return;

      if (frame - horseEffectState.struckStart >= horseEffectState.struckTime) {
        // Remove electrocuted effect when time is up
        horseState.effects = horseState.effects.filter(
          (effect) => effect !== 'electrocuted',
        );
        horseEffectState.isStruck = false;
      } else {
        // Apply lightning effects
        if (!horseState.effects.includes('electrocuted')) {
          horseState.effects.push('electrocuted');
        }
        horseState.speedMultiplier *= 0;
      }
    });
  },
};
