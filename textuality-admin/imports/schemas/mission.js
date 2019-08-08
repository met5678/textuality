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
  active: Boolean,
  timePreText: Date,
  timeStart: Date,
  timeEnd: Date,
  missionPreText: {
    type: String,
    max: 150
  },
  missionStartText: {
    type: String,
    max: 150
  },
  missionSuccessText: {
    type: String,
    max: 150
  },
  missionFailText: {
    type: String,
    max: 150
  }
});

export default AchievementSchema;


