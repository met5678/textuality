import { HorseId } from '../horse';

export const KEYFRAME_INTERPOLATION_VALUES = ['linear', 'step'] as const;
export type KeyframeInterpolationType =
  (typeof KEYFRAME_INTERPOLATION_VALUES)[number];

export const HORSE_STATUS = ['still', 'running', 'trotting'] as const;
export type HorseStatus = (typeof HORSE_STATUS)[number];

export const JOCKEY_STATUS = ['still', 'riding', 'surfing', 'dancing'] as const;
export type JockeyStatus = (typeof JOCKEY_STATUS)[number];

export type RaceTimelineHorseKeyframe = {
  frame: number;
  position: number;
  horse: HorseId;
  status: HorseStatus;
  jockey_status: JockeyStatus;
  interpolation: KeyframeInterpolationType;
};

export const EFFECT_TYPES = ['lightning', 'headwind', 'tailwind'] as const;
export type EffectType = (typeof EFFECT_TYPES)[number];

export type RaceTimelineEffectKeyframe = {
  frame: number;
  effect: EffectType;
  intensity: number;
  interpolation: KeyframeInterpolationType;
};

export type RaceTimeline = {
  horses: Record<string, RaceTimelineHorseKeyframe[]>;
  effects: Record<string, RaceTimelineEffectKeyframe[]>;
  current_frame: number;
};
