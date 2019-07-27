import SimpleSchema from 'simpl-schema';

import Events from 'api/events';

const OutTextSchema = new SimpleSchema({
  event: {
    type: String,
    allowedValues: () =>
      Events.find()
        .fetch()
        .map(event => event._id)
  },
  body: String,
  time: Date,
  players: {
    type: Array
  },
  'players.$': {
    type: String,
    allowedValues: () => {
      Players.find()
        .fetch()
        .map(player => player._id);
    }
  },
  source: {
    type: String,
    allowedValues: ['auto_text', 'manual']
  }
});

export default OutTextSchema;
