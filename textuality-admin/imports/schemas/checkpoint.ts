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
  playerText: {
    type: String,
    optional: true,
  },
});

interface Checkpoint {
  _id?: string;
  event: string;
  hashtag: string;
  groups: string[];
  location?: string;
  money_award?: number;
  playerText?: string;
}

export default CheckpointSchema;
export { Checkpoint, CheckpointSchema };
