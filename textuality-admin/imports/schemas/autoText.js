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
    max: 160,
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

      'SENT_VIDEO',
      'INVALID_CONTENT_TYPE',

      'CLUE_REWARD_PRE',

      'CLUE_REWARD_POST_ROOM',
      'CLUE_REWARD_POST_COMPLETE_ROOM',
      'CLUE_REWARD_POST_PERSON',
      'CLUE_REWARD_POST_COMPLETE_PERSON',
      'CLUE_REWARD_POST_WEAPON',
      'CLUE_REWARD_POST_COMPLETE_WEAPON',

      'CLUE_REWARD_NONE_LEFT_ROOM',
      'CLUE_REWARD_NONE_LEFT_PERSON',
      'CLUE_REWARD_NONE_LEFT_WEAPON',
      'CLUE_REWARD_NONE_LEFT_ANY',

      'MISSION_PRESTART',
      'MISSION_START_PLAYER_A',
      'MISSION_START_PLAYER_B',
      'MISSION_COMPLETE',
      'MISSION_FAIL',

      'GUESS_PERSON_SUCCESS',
      'GUESS_PERSON_INVALID',
      'GUESS_PERSON_EMPTY',

      'GUESS_ROOM_SUCCESS',
      'GUESS_ROOM_INVALID',
      'GUESS_ROOM_EMPTY',

      'GUESS_WEAPON_SUCCESS',
      'GUESS_WEAPON_INVALID',
      'GUESS_WEAPON_EMPTY',

      'GUESS_N_REMAINING',

      'ROUND_BEGIN',
      'ROUND_COUNTDOWN',
      'ROUND_REVEAL_START',
      'ROUND_REVEAL_RESULT_N_CLUES',
      'ROUND_END',

      // BELOW TEXTS NOT IN USE DURING CLUE

      'ALIAS_CHANGED',
      'ALIAS_MISSION_ACTIVE',

      'ALL_ACHIEVEMENTS_UNLOCKED',
    ],
  },
  triggerNum: {
    type: SimpleSchema.Integer,
    optional: true,
  },
});

export default AutoTextSchema;
