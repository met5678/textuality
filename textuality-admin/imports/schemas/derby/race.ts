import Events from '/imports/api/events';
import SimpleSchema from 'simpl-schema';

const KEYFRAME_INTERPOLATION_VALUES = ['linear', 'step'] as const;
type KeyframeInterpolationType = (typeof KEYFRAME_INTERPOLATION_VALUES)[number];

const TRACK_CONDITION_VALUES = ['dry', 'soggy', 'muddy', 'icy'] as const;
type TrackCondition = (typeof TRACK_CONDITION_VALUES)[number];

const RACE_STATUS_VALUES = [
  'future',
  'bets-open',
  'race-intro',
  'race-in-progress',
  'race-photo-finish',
  'race-results',
  'race-bet-winners',
] as const;
type RaceStatus = (typeof RACE_STATUS_VALUES)[number];

const HORSE_STATUS = ['running', 'trotting'] as const;
type HorseStatus = (typeof HORSE_STATUS)[number];

const JOCKEY_STATUS = ['riding', 'surfing', 'dancing'] as const;
type JockeyStatus = (typeof JOCKEY_STATUS)[number];

type RaceTimelineHorseKeyframe = {
  frame: number;
  position: number;
  horse: string;
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

type Race = {
  _id: string;
  event: string;
  horses: string[];
  scheduled: boolean;
  time_bets_start_at: Date;
  time_race_intro_starts_at: Date;
  time_race_starts_at: Date;
  status: RaceStatus;
  timeline: RaceTimeline;
  track_condition: TrackCondition;
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
});

const RaceTimelineSchema = new SimpleSchema({
  horses: {
    type: Array,
    defaultValue: [],
  },
  'horses.$': {
    type: RaceTimelineHorseKeyframeSchema,
  },
  events: {
    type: Array,
    defaultValue: [],
  },
  'events.$': {
    type: RaceTimelineEventKeyframeSchema,
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
  },
  timeline: {
    type: RaceTimelineSchema,
    optional: true,
  },
  track_condition: {
    type: String,
    allowedValues: [...TRACK_CONDITION_VALUES],
  },
  linked_mission: {
    type: String,
    optional: true,
    // allowedValues: Missions.allIds
  },
});

export default RaceSchema;
export type { Race, RaceTimeline, RaceSchema, RaceTimelineSchema };
