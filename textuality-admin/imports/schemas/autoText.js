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
      'WELCOME_FINALLY',
      'ALIAS_CHANGED',
      'ALIAS_MISSION_ACTIVE',
      'AVATAR_CHANGED',
      'AVATAR_NO_IMAGE',
      'AVATAR_NO_FACE',
      'AVATAR_MULTI_FACES',
      'AVATAR_MISSION_ACTIVE',
      'SIGN_OFF',
      'STATUS',
      'WELCOME_BACK',
      'INVALID_HASHTAG',
      'HASHTAG_ALREADY_FOUND',
      'INVALID_COMMAND',
      'MODERATION',

      'N_TEXTS_SENT',
      'N_COLLECTIVE_TEXTS_SENT',
      'N_ACHIEVEMENTS_UNLOCKED',
      'ALL_ACHIEVEMENTS_UNLOCKED',
      'N_PLAYERS_JOINED'
    ]
  },
  trigger_num: {
    type: SimpleSchema.Integer,
    optional: true
  }
});

export default AutoTextSchema;
