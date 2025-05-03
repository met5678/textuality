import { RaceWithHelpers } from '../../races';
import { HorseState } from '../generate-timeline';
import { BaseEffect } from './base-effect';
import { HorseId } from '/imports/schemas/derby/horse';
import { RaceTimelineEffectKeyframe } from '/imports/schemas/derby/race-timeline/types';

const WIND_GUST_MIN_INTERVAL = 10;
const WIND_GUST_MAX_INTERVAL = 20;
const WIND_GUST_MIN_DURATION = 2;
const WIND_GUST_MAX_DURATION = 4;
const WIND_GUST_MIN_STRENGTH = 1;
const WIND_GUST_MAX_STRENGTH = 5;
const WIND_GUST_CHANCE = 1 / (WIND_GUST_MAX_INTERVAL - WIND_GUST_MIN_INTERVAL);

type WindEffectState = {
  lastGustFrame: number;
  lastGustIntensity: number;
  lastGustDuration: number;
  horses: Record<
    HorseId,
    {
      isBlownBack: boolean;
      blowbackStrength: number;
      blowbackTime: number;
    }
  >;
};

export const WindEffect: BaseEffect<WindEffectState> = {
  effectType: 'headwind',

  init: (race: RaceWithHelpers) => {
    return {
      lastGustFrame: 0,
      lastGustIntensity: 0,
      lastGustDuration: 0,
      horses: race.horses.reduce(
        (acc, horse) => {
          acc[horse] = {
            isBlownBack: false,
            blowbackStrength: 0,
            blowbackTime: 0,
          };
          return acc;
        },
        {} as WindEffectState['horses'],
      ),
    };
  },

  generateEffectKeyframe: (
    frame: number,
    race: RaceWithHelpers,
    horseStates: HorseState[],
    effectState: WindEffectState,
    random: () => number,
  ): RaceTimelineEffectKeyframe | null => {
    if (!['storm', 'windy'].includes(race.weather)) return null;

    const lastGustEndFrame =
      effectState.lastGustFrame + effectState.lastGustDuration;

    // If the gust is still active, return the current gust
    if (frame < lastGustEndFrame) {
      return {
        frame,
        effect: 'headwind',
        intensity: effectState.lastGustIntensity,
      };
    }

    // Check if enough time has passed since last strike
    if (frame - lastGustEndFrame < WIND_GUST_MIN_INTERVAL) return null;

    let shouldGust = false;

    if (frame - lastGustEndFrame > WIND_GUST_MAX_INTERVAL) shouldGust = true;
    else if (random() < WIND_GUST_CHANCE) shouldGust = true;

    if (!shouldGust) return null;

    // Record the gust
    effectState.lastGustFrame = frame;
    effectState.lastGustIntensity =
      WIND_GUST_MIN_STRENGTH +
      (WIND_GUST_MAX_STRENGTH - WIND_GUST_MIN_STRENGTH) * random();
    effectState.lastGustDuration =
      WIND_GUST_MIN_DURATION +
      (WIND_GUST_MAX_DURATION - WIND_GUST_MIN_DURATION) * random();

    // Return the visual event
    return {
      frame,
      effect: 'headwind',
      intensity: effectState.lastGustIntensity,
    };
  },

  updateHorseStates: (
    frame: number,
    race: RaceWithHelpers,
    horseStates: HorseState[],
    effectState: WindEffectState,
    random: () => number,
  ): void => {
    if (!['storm', 'windy'].includes(race.weather)) return;

    const lastGustEndFrame =
      effectState.lastGustFrame + effectState.lastGustDuration;
    const isGustActive =
      frame < lastGustEndFrame && frame >= effectState.lastGustFrame;

    // If a gust just started, mark all horses as affected
    if (frame === effectState.lastGustFrame) {
      horseStates.forEach((horseState) => {
        const windResistance = horseState.horse.stats().wind_resistance;
        const windResistanceMod = windResistance / 10;

        effectState.horses[horseState.horse._id] = {
          isBlownBack: true,
          blowbackStrength: effectState.lastGustIntensity / windResistanceMod,
          blowbackTime: effectState.lastGustDuration,
        };
      });
    }

    // Apply or remove effects based on gust state
    horseStates.forEach((horseState) => {
      const horseEffectState = effectState.horses[horseState.horse._id];

      if (isGustActive && horseEffectState.isBlownBack) {
        // Apply wind effects during active gust
        if (!horseState.effects.includes('blownback')) {
          horseState.effects.push('blownback');
        }
        // Stronger wind means more slowdown. Can be as strong
        // as 2x slowdown (aka normal speed backwards) at max strength
        const windSlowdown =
          (horseEffectState.blowbackStrength / WIND_GUST_MAX_STRENGTH) * 2;

        horseState.speedMultiplier -= windSlowdown;
      } else {
        // Remove effects when gust is over
        horseState.effects = horseState.effects.filter(
          (effect) => effect !== 'blownback',
        );
        horseEffectState.isBlownBack = false;
      }
    });
  },
};
