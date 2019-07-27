import SimpleSchema from 'simpl-schema';

import Events from 'api/events';

const AutoTextSchema = new SimpleSchema({
  event: {
    type: String,
    allowedValues: () =>
      Events.find()
        .fetch()
        .map(event => event._id)
  },
  body: String,
  target: {
    type: String,
    allowedValues: ['player', 'screen']
  },
  trigger: {
    type: String,
    allowedValues: [
      'N_TEXTS_SENT',
      'N_TOTAL_TEXTS_SENT',
      'N_ACHIEVEMENTS_UNLOCKED',
      'N_TOTAL_ACHIEVEMENTS_UNLOCKED',
      'ALL_ACHIEVEMENTS_UNLOCKED',
      'ALIAS_CHANGED',
      'WELCOME_WITH_AVATAR',
      'WELCOME_NO_AVATAR',
      'AVATAR_CHANGED'
    ]
  },
  trigger_num: {
    type: SimpleSchema.Integer,
    optional: true
  }
});

export default AutoTextSchema;
