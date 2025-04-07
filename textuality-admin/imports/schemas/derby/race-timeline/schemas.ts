import SimpleSchema from 'simpl-schema';
import {
  EVENT_TYPES,
  HORSE_STATUS,
  JOCKEY_STATUS,
  KEYFRAME_INTERPOLATION_VALUES,
} from './types';

export const RaceTimelineHorseKeyframeSchema = new SimpleSchema({
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

export const RaceTimelineEventKeyframeSchema = new SimpleSchema({
  frame: {
    type: Number,
  },
  event: {
    type: String,
    allowedValues: [...EVENT_TYPES],
  },
  intensity: {
    type: SimpleSchema.Integer,
    min: 1,
    max: 5,
  },
  interpolation: {
    type: String,
    allowedValues: [...KEYFRAME_INTERPOLATION_VALUES],
  },
});

export const RaceTimelineSchema = new SimpleSchema({
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
