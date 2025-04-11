import { RaceWithHelpers } from '../../races';
import { HorseState } from '../generate-timeline';
import {
  EffectType,
  RaceTimelineEffectKeyframe,
} from '/imports/schemas/derby/race-timeline/types';

export interface BaseEffect<T> {
  effectType: EffectType | null;
  init: (race: RaceWithHelpers) => T;
  generateEffectKeyframe: (
    frame: number,
    race: RaceWithHelpers,
    horseStates: HorseState[],
    effectState: T,
    random: () => number,
  ) => RaceTimelineEffectKeyframe | null;

  updateHorseStates: (
    frame: number,
    race: RaceWithHelpers,
    horseStates: HorseState[],
    effectState: T,
    random: () => number,
  ) => void;
}
