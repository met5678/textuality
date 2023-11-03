import SimpleSchema from 'simpl-schema';

import Events from '/imports/api/events';

const CheckpointSchema = new SimpleSchema({
  event: {
    type: String,
    allowedValues: Events.allIds,
  },
  hashtag: String,
  group: String,
  location: {
    type: String,
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
  group: string;
  location?: string;
  playerText?: string;
}

export default CheckpointSchema;
export { Checkpoint, CheckpointSchema };
