import SimpleSchema from 'simpl-schema';

import Events from '/imports/api/events';

const CheckpointSchema = new SimpleSchema({
  event: {
    type: String,
    allowedValues: Events.allIds,
  },
  hashtag: String,
  groups: [String],
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
  num_checkins: {
    type: SimpleSchema.Integer,
    defaultValue: 0,
  },
});

interface Checkpoint {
  _id?: string;
  event: string;
  hashtag: string;
  groups: string[];
  location: string;
  money_award?: number;
  player_text?: string;
  num_checkins: 0;
}

export default CheckpointSchema;
export { Checkpoint, CheckpointSchema };
