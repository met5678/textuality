import SimpleSchema from 'simpl-schema';

import Events from 'api/events';

const AchievementSchema = new SimpleSchema({
  event: {
    type: String,
    allowedValues: () =>
      Events.find()
        .fetch()
        .map((event) => event._id),
  },
  name: String,
  number: SimpleSchema.Integer,
  active: {
    type: Boolean,
    defaultValue: false,
  },
  minutes: {
    type: SimpleSchema.Integer,
    defaultValue: 10,
  },
  timePreText: {
    type: Date,
    optional: true,
  },
  timeStart: {
    type: Date,
    optional: true,
  },
  timeEnd: {
    type: Date,
    optional: true,
  },
  missionPreText: {
    type: String,
    max: 150,
    optional: true,
  },
  missionSuccessText: {
    type: String,
    max: 150,
    optional: true,
  },
  missionFailText: {
    type: String,
    max: 150,
    optional: true,
  },
});

export default AchievementSchema;
