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
  playerText: {
    type: String,
    max: 150,
    optional: true
  },
  screenText: {
    type: String,
    optional: true
  },
  trigger: {
    type: String,
    allowedValues: [
      'WELCOME',
      'WELCOME_NO_IMAGE',
      'WELCOME_NO_FACE',
      'WELCOME_MULTI_FACES',

      'TENTATIVE_NO_IMAGE',
      'TENTATIVE_NO_FACE',
      'TENTATIVE_MULTI_FACES',
      'TENTATIVE_WELCOME',

      'ALIAS_CHANGED',
      'ALIAS_MISSION_ACTIVE',

      'ACHIEVEMENT_UNLOCK',

      'CHECKPOINT_FOUND',
      'CHECKPOINT_ALREADY_FOUND',

      'SIGN_OFF',
      'SIGN_BACK_ON',

      'STATUS_GENERATING',
      'STATUS',

      'INVALID_COMMAND',

      'INVALID_HASHTAG',

      'SENT_VIDEO',
      'INVALID_CONTENT_TYPE',

      'N_TEXTS_SENT',
      'N_COLLECTIVE_TEXTS_SENT',
      'N_ACHIEVEMENTS_UNLOCKED',
      'ALL_ACHIEVEMENTS_UNLOCKED',
      'N_PLAYERS_JOINED'
    ]
  },
  triggerNum: {
    type: SimpleSchema.Integer,
    optional: true
  }
});

export default AutoTextSchema;
