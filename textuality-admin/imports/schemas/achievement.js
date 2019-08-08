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
  number: SimpleSchema.Integer,
  hint: String,
  trigger: {
    type: String,
    allowedValues: [
      'CHECKPOINT',
      'CHECKPOINT_GROUP',
      'EMOJIS_IN_TEXT',
      'JOINED',
      'MISSION',
      'N_PICTURES_SENT',
      'N_TEXTS_SENT',
      'PICTURE_MULTI_FACES'
    ]
  },
  triggerDetail: {
    type: SimpleSchema.oneOf(String, SimpleSchema.Integer),
    optional: true
  },
  playerText: {
    type: String,
    max: 60
  },
  hideFromScreen: {
    type: Boolean,
    defaultValue: true
  }
});

export default AchievementSchema;
