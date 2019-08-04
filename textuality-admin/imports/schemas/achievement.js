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
  trigger: {
    type: String,
    allowedValues: ['checkpoint', 'mission', 'special']
  },
  triggerData: {
    type: Object,
    blackbox: true
  }
});

// Maybe add 'theme'

export default AchievementSchema;
