import { RaceWithHelpers } from '../../races';
import { HorseState } from '../generate-timeline';
import { BaseEffect } from './base-effect';
import { HorseId } from '/imports/schemas/derby/horse';
import { Race, RaceTimelineEventKeyframe } from '/imports/schemas/derby/race';

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

  update: (
    race: RaceWithHelpers,
    horseStates: HorseState[],
    effectState: LightningEffectState,
  ): RaceTimelineEventKeyframe | null => {
    return null;
  },
};
