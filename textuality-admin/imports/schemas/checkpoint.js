import SimpleSchema from 'simpl-schema';

import Events from 'api/events';

const CheckpointSchema = new SimpleSchema({
  event: {
    type: String,
    allowedValues: () =>
      Events.find()
        .fetch()
        .map((event) => event._id),
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

export default CheckpointSchema;
