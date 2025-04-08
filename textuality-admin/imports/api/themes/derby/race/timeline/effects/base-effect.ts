import { RaceWithHelpers } from '../../races';
import { HorseState } from '../generate-timeline';
import { RaceTimelineEventKeyframe } from '/imports/schemas/derby/race';
import { EffectType } from '/imports/schemas/derby/race-timeline/types';

export interface BaseEffect<T> {
  effectType: EffectType;
  init: (race: RaceWithHelpers) => T;
  update: (
    race: RaceWithHelpers,
    horseStates: HorseState[],
    effectState: T,
    addEffectKeyframe: (effectKeyframe: RaceTimelineEventKeyframe) => void,
  ) => void;
}
