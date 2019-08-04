import SimpleSchema from 'simpl-schema';

import Events from 'api/events';

const CheckpointSchema = new SimpleSchema({
  event: {
    type: String,
    allowedValues: () =>
      Events.find()
        .fetch()
        .map(event => event._id)
  },
  number: SimpleSchema.Integer,
  hashtag: String,
  location: String,
  hint: String,
  playerText: {
    type: String,
    optional: true
  },
  screenText: {
    type: String,
    optional: true
  }
});

// Maybe add 'theme'

export default CheckpointSchema;
