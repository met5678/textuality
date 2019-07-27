import SimpleSchema from 'simpl-schema';

import Events from 'api/events';

const AchievementSchema = new SimpleSchema({
  event: {
    type: String,
    allowedValues: () =>
      Events.find()
        .fetch()
        .map(event => event._id)
  },
  name: String,
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

export default AchievementSchema;
