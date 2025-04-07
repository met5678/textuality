import { EventId } from '../event';
import { HorseId } from './horse';
import Events from '/imports/api/events';
import SimpleSchema from 'simpl-schema';
import { MissionId } from '../mission';

const KEYFRAME_INTERPOLATION_VALUES = ['linear', 'step'] as const;
type KeyframeInterpolationType = (typeof KEYFRAME_INTERPOLATION_VALUES)[number];

const TRACK_CONDITION_VALUES = ['dry', 'soggy', 'muddy', 'icy'] as const;
type TrackCondition = (typeof TRACK_CONDITION_VALUES)[number];

const RACE_STATUS_VALUES = [
  'future',
  'bets-open',
  'intro',
  'active',
  'results',
  'bet-winners',
] as const;
type RaceStatus = (typeof RACE_STATUS_VALUES)[number];

const HORSE_STATUS = ['still', 'running', 'trotting'] as const;
type HorseStatus = (typeof HORSE_STATUS)[number];

const JOCKEY_STATUS = ['still', 'riding', 'surfing', 'dancing'] as const;
type JockeyStatus = (typeof JOCKEY_STATUS)[number];

type RaceTimelineHorseKeyframe = {
  frame: number;
  position: number;
  horse: HorseId;
  status: HorseStatus;
  jockey_status: JockeyStatus;
  interpolation: KeyframeInterpolationType;
};

type RaceTimelineEventKeyframe = {
  frame: number;
  event: string;
  intensity: number;
  interpolation: KeyframeInterpolationType;
};

type RaceTimeline = {
  horses: Record<string, RaceTimelineHorseKeyframe[]>;
  events: Record<string, RaceTimelineEventKeyframe[]>;
  current_frame: number;
};

type RaceHorseResult = {
  horse: HorseId;
  time: number;
  placement: number;
};

type RaceId = string;

type Race = {
  _id: RaceId;
  event: EventId;
  horses: HorseId[];
  scheduled: boolean;
  time_bets_start_at: Date;
  time_race_intro_starts_at: Date;
  time_race_starts_at: Date;
  status: RaceStatus;
  timeline: RaceTimeline;
  furlong_length: number;
  track_condition: TrackCondition;
  linked_mission?: MissionId;
  results: RaceHorseResult[];
};

const RaceTimelineHorseKeyframeSchema = new SimpleSchema({
  frame: {
    type: Number,
  },
  position: {
    type: Number,
  },
  horse: {
    type: String,
  },
  status: {
    type: String,
    allowedValues: [...HORSE_STATUS],
  },
  jockey_status: {
    type: String,
    allowedValues: [...JOCKEY_STATUS],
  },
  interpolation: {
    type: String,
    allowedValues: [...KEYFRAME_INTERPOLATION_VALUES],
  },
});

const RaceTimelineEventKeyframeSchema = new SimpleSchema({
  frame: {
    type: Number,
  },
  event: {
    type: String,
  },
  intensity: {
    type: Number,
  },
  interpolation: {
    type: String,
    allowedValues: [...KEYFRAME_INTERPOLATION_VALUES],
  },
});

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

const RaceTimelineSchema = new SimpleSchema({
  horses: {
    type: Object,
    defaultValue: {},
    blackbox: true,
  },
  events: {
    type: Object,
    defaultValue: {},
    blackbox: true,
  },
  current_frame: {
    type: Number,
    defaultValue: 0,
  },
});

const RaceSchema = new SimpleSchema({
  event: {
    type: String,
    allowedValues: Events.allIds,
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
  time_race_intro_starts_at: {
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
    defaultValue: 'future',
  },
  timeline: {
    type: RaceTimelineSchema,
    defaultValue: {},
  },
  track_condition: {
    type: String,
    allowedValues: [...TRACK_CONDITION_VALUES],
    defaultValue: 'dry',
  },
  furlong_length: {
    type: Number,
    defaultValue: 1,
    min: 0.1,
    max: 2,
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
export {
  RaceSchema,
  RaceTimelineSchema,
  RaceTimelineHorseKeyframeSchema,
  RaceTimelineEventKeyframeSchema,
  RACE_STATUS_VALUES,
  TRACK_CONDITION_VALUES,
  HORSE_STATUS,
  JOCKEY_STATUS,
  KEYFRAME_INTERPOLATION_VALUES,
};
export type {
  Race,
  RaceId,
  RaceStatus,
  RaceTimeline,
  RaceTimelineHorseKeyframe,
  RaceTimelineEventKeyframe,
  TrackCondition,
  HorseStatus,
  JockeyStatus,
  RaceHorseResult,
};
