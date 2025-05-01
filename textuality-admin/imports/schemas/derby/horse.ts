import SimpleSchema from 'simpl-schema';
import Events from '/imports/api/events';
import { EventId } from '../event';

export const HORSE_EMOJI_COLOR_SQUARE = [
  '🟥',
  '🟧',
  '🟨',
  '🟩',
  '🟦',
  '🟪',
  '🟫',
  '⬛️',
  '⬜️',
  '🔴',
  '🟠',
  '🟡',
  '🟢',
  '🔵',
  '🟣',
  '🟤',
  '⚪️',
  '⚫️',
] as const;
export type HorseEmojiColorSquare = (typeof HORSE_EMOJI_COLOR_SQUARE)[number];

export const HORSE_STATS = [
  'speed',
  'endurance',
  'water_resistance',
  'wind_resistance',
  'electric_resistance',
] as const;
export type HorseStat = (typeof HORSE_STATS)[number];

export const STAT_FANCY_NAME: Record<HorseStat, string> = {
  speed: 'Spreed',
  endurance: 'Endurance',
  water_resistance: 'Amphibiousness',
  wind_resistance: 'Aerodynamics',
  electric_resistance: 'Resistance',
};

const HorseStatsSchema = new SimpleSchema({
  speed: {
    type: Number,
    defaultValue: 10,
  },
  endurance: {
    type: Number,
    defaultValue: 10,
  },
  water_resistance: {
    type: Number,
    defaultValue: 10,
  },
  wind_resistance: {
    type: Number,
    defaultValue: 10,
  },
  electric_resistance: {
    type: Number,
    defaultValue: 10,
  },
});

const HorseSchema = new SimpleSchema({
  event: {
    type: String,
    allowedValues: Events.allIds,
  },
  name: {
    type: String,
  },
  number: {
    type: SimpleSchema.Integer,
  },
  short_name: {
    type: String,
  },
  color: {
    type: String,
  },
  emojiColorSquare: {
    defaultValue: HORSE_EMOJI_COLOR_SQUARE[0],
    type: String,
    allowedValues: [...HORSE_EMOJI_COLOR_SQUARE],
  },
  base_stats: {
    type: HorseStatsSchema,
    defaultValue: HorseStatsSchema.clean({}),
  },
  powerup_stats: {
    type: HorseStatsSchema,
    defaultValue: HorseStatsSchema.clean({
      speed: 0,
      endurance: 0,
      water_resistance: 0,
      wind_resistance: 0,
      electric_resistance: 0,
    }),
  },
});

type HorseStats = Record<HorseStat, number>;

export type HorseId = string;

type Horse = {
  _id: HorseId;
  event: EventId;
  name: string;
  number: number;
  short_name: string;
  color: string;
  emojiColorSquare: HorseEmojiColorSquare;
  base_stats: HorseStats;
  powerup_stats: HorseStats;
};

export { HorseSchema, HorseStatsSchema };
export type { Horse, HorseStats };
