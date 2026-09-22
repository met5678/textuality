import SimpleSchema from 'simpl-schema';

import Events from '/imports/api/events';
import { EventId } from './event';
const CheckpointSchema = new SimpleSchema({
  event: {
    type: String,
    allowedValues: Events.allIds,
  },
  hashtag: String,
  groups: {
    type: Array,
    defaultValue: [],
  },
  'groups.$': String,
  location: String,
  money_award: {
    type: SimpleSchema.Integer,
    defaultValue: 0,
    optional: true,
  },
  player_text: {
    type: String,
    optional: true,
  },
  suppress_autotext: {
    type: Boolean,
    defaultValue: false,
  },
  num_checkins: {
    type: SimpleSchema.Integer,
    defaultValue: 0,
  },
});

export type CheckpointId = string;

interface Checkpoint {
  _id: CheckpointId;
  event: EventId;
  hashtag: string;
  groups: string[];
  location: string;
  money_award?: number;
  player_text?: string;
  suppress_autotext?: boolean;
  num_checkins: 0;
}

export default CheckpointSchema;
export { Checkpoint, CheckpointSchema };
