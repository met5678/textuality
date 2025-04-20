import { EventId } from '../event';
import { HorseId } from './horse';
import Events from '/imports/api/events';
import SimpleSchema from 'simpl-schema';
import { MissionId } from '../mission';
import { RaceTimeline } from './race-timeline/types';
import { RaceTimelineSchema } from './race-timeline/schemas';

const WEATHER_VALUES = ['clear', 'rain', 'windy', 'storm'] as const;
type Weather = (typeof WEATHER_VALUES)[number];

const RACE_STATUS_VALUES = [
  'future',
  'bets-open',
  'intro',
  'active',
  'results',
  'bet-winners',
  'inactive',
] as const;
type RaceStatus = (typeof RACE_STATUS_VALUES)[number];

type RaceHorseResult = {
  horse: HorseId;
  time: number;
  placement: number;
};

type RaceHorseOdds = {
  horse: HorseId;
  odds: number;
};

type RaceId = string;

type Race = {
  _id: RaceId;
  event: EventId;
  number: number;
  name?: string;
  horses: HorseId[];
  scheduled: boolean;
  time_bets_start_at: Date;
  time_race_starts_at: Date;
  status: RaceStatus;
  timeline: RaceTimeline;
  furlong_length: number;
  weather: Weather;
  linked_mission?: MissionId;
  results: RaceHorseResult[];
  odds: RaceHorseOdds[];
};

const RaceHorseResultSchema = new SimpleSchema({
  horse: {
    type: String,
  },
  time: {
    type: Number,
  },
  placement: {
    type: SimpleSchema.Integer,
  },
});

const RaceHorseOddsSchema = new SimpleSchema({
  horse: {
    type: String,
  },
  odds: {
    type: SimpleSchema.Integer,
    min: 1,
  },
});

const RaceSchema = new SimpleSchema({
  event: {
    type: String,
    allowedValues: Events.allIds,
  },
  number: {
    type: SimpleSchema.Integer,
    min: 0,
  },
  name: {
    type: String,
    optional: true,
  },
  horses: {
    type: Array,
    defaultValue: [],
  },
  'horses.$': {
    type: String,
  },
  scheduled: {
    type: Boolean,
    defaultValue: false,
  },
  time_bets_start_at: {
    type: Date,
    optional: true,
  },
  time_race_starts_at: {
    type: Date,
    optional: true,
  },
  status: {
    type: String,
    allowedValues: [...RACE_STATUS_VALUES],
    defaultValue: 'inactive',
  },
  timeline: {
    type: RaceTimelineSchema,
    defaultValue: {},
  },
  weather: {
    type: String,
    allowedValues: [...WEATHER_VALUES],
    defaultValue: 'clear',
  },
  furlong_length: {
    type: SimpleSchema.Integer,
    defaultValue: 8,
    min: 5,
    max: 12,
  },
  odds: {
    type: Array,
    defaultValue: [],
  },
  'odds.$': {
    type: RaceHorseOddsSchema,
  },
  results: {
    type: Array,
    defaultValue: [],
  },
  'results.$': {
    type: RaceHorseResultSchema,
  },
  linked_mission: {
    type: String,
    optional: true,
    // allowedValues: Missions.allIds
  },
});

export default RaceSchema;
export { RaceSchema, RACE_STATUS_VALUES, WEATHER_VALUES };
export type {
  Race,
  RaceId,
  RaceStatus,
  RaceTimeline,
  RaceHorseResult,
  RaceHorseOdds,
  Weather,
};
