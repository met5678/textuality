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
  hashtag: String,
  location: String,

  playerText: {
    type: String,
    optional: true
  },
  screenText: {
    type: String,
    optional: true
  },
  type: {
    type: String,
    allowedValues: ['Checkpoint', 'Mission', 'Special']
  }
});

// Maybe add 'theme'

export default CheckpointSchema;
