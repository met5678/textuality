import SimpleSchema from 'simpl-schema';
import Events from '/imports/api/events';
import { EventId } from '../event';

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
  stats: {
    type: HorseStatsSchema,
    defaultValue: HorseStatsSchema.clean({}),
  },
});

type HorseStats = {
  speed: number;
  endurance: number;
  water_resistance: number;
  wind_resistance: number;
  electric_resistance: number;
};

export type HorseId = string;

type Horse = {
  _id: HorseId;
  event: EventId;
  name: string;
  number: number;
  short_name: string;
  color: string;
  stats: HorseStats;
};

export { HorseSchema, HorseStatsSchema };
export type { Horse, HorseStats };
