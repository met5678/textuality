import SimpleSchema from 'simpl-schema';

import Events from 'api/events';

const AutoTextSchema = new SimpleSchema({
  event: {
    type: String,
    allowedValues: () =>
      Events.find()
        .fetch()
        .map((event) => event._id),
  },
  playerText: {
    type: String,
    max: 150,
    optional: true,
  },
  screenText: {
    type: String,
    optional: true,
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
      'ACHIEVEMENT_UNLOCK_DURING_REVEAL',

      'CHECKPOINT_FOUND',
      'CHECKPOINT_ALREADY_FOUND',

      'SIGN_OFF',
      'SIGN_BACK_ON',

      'STATUS_GENERATING',
      'STATUS',

      'INVALID_COMMAND',

      'INVALID_HASHTAG',

      'MISSION_ALREADY_COMPLETED',
      'MISSION_COMPLETED_AGAIN',

      'SENT_VIDEO',
      'INVALID_CONTENT_TYPE',

      'ALL_ACHIEVEMENTS_UNLOCKED',

      'ROUND_BEGIN',
      'ROUND_10_MINS_REMAIN',
      'ROUND_REVEAL_START',
      'ROUND_REVEAL_RESULT_N_CLUES',
      'ROUND_END',
    ],
  },
  triggerNum: {
    type: SimpleSchema.Integer,
    optional: true,
  },
});

export default AutoTextSchema;
