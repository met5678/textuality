import { HorseId } from '../horse';

export const HORSE_STATUS = ['still', 'running', 'trotting'] as const;
export type HorseStatus = (typeof HORSE_STATUS)[number];

export const HORSE_EFFECTS = [
  'electrocuted',
  'electricboost',
  'blownback',
  'luckyboost',
  'chasing',
] as const;
export type HorseEffect = (typeof HORSE_EFFECTS)[number];

export type RaceTimelineHorseKeyframe = {
  frame: number;
  position: number;
  horse: HorseId;
  status: HorseStatus;
  effects: HorseEffect[];
};

export const EFFECT_TYPES = ['lightning', 'headwind', 'tailwind'] as const;
export type EffectType = (typeof EFFECT_TYPES)[number];

export type RaceTimelineEffectKeyframe = {
  frame: number;
  effect: EffectType;
  intensity: number;
};

export type RaceTimeline = {
  horses: Record<string, RaceTimelineHorseKeyframe[]>;
  effects: Record<string, RaceTimelineEffectKeyframe[]>;
  current_frame: number;
  is_playing: boolean;
};
