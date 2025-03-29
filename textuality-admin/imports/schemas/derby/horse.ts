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
  luck: {
    type: Number,
    defaultValue: 10,
  },
  traction: {
    type: Number,
    defaultValue: 10,
  },
  distractibility: {
    type: Number,
    defaultValue: 10,
  },
  boots: {
    type: Number,
    defaultValue: 1,
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
  short_name: {
    type: String,
  },
  color: {
    type: String,
  },
  stats: {
    type: HorseStatsSchema,
  },
});

type HorseStats = {
  speed: number;
  traction: number;
  endurance: number;
  luck: number;
  distractibility: number;
  boots: number;
};

export type HorseId = string;

type Horse = {
  _id: HorseId;
  event: EventId;
  name: string;
  short_name: string;
  color: string;
  stats: HorseStats;
};

export { HorseSchema, HorseStatsSchema };
export type { Horse, HorseStats };
