import SimpleSchema from 'simpl-schema';

import Events from 'api/events';

const AchievementUnlockSchema = new SimpleSchema({
  event: {
    type: String,
    allowedValues: () =>
      Events.find()
        .fetch()
        .map(event => event._id)
  },
  achievement: String,
  name: String,
  time: Date,
  player: String,
  alias: String,
  avatar: String,
  numAchievements: SimpleSchema.Integer
});

export default AchievementUnlockSchema;
