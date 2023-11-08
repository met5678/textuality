import SimpleSchema from 'simpl-schema';

import Events from '/imports/api/events';

const AutoTextSchema = new SimpleSchema({
  event: {
    type: String,
    allowedValues: Events.allIds,
  },
  playerText: String,
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

      'CHECKPOINT_FOUND',
      'CHECKPOINT_ALREADY_FOUND',

      'SIGN_OFF',
      'SIGN_BACK_ON',

      'INVALID_COMMAND',
      'INVALID_HASHTAG',
      'INVALID_BET',

      'SENT_VIDEO',
      'INVALID_CONTENT_TYPE',

      'MISSION_PRESTART',
      'MISSION_START_PLAYER_A',
      'MISSION_START_PLAYER_B',
      'MISSION_COMPLETE',
      'MISSION_FAIL',
      'MISSION_ALREADY_COMPLETED',

      // Start casino-specific

      'WALLET_STATUS',

      'WALLET_MORETHAN_N',
      'WALLET_LESSTHAN_N',
      'WALLET_BANKRUPT',

      'SLOT_SPIN',
      'SLOT_WIN_SMALL',
      'SLOT_WIN_MEDIUM',
      'SLOT_WIN_BIG',
      'SLOT_WIN_HACKER',
      'SLOT_LOSE',
      'SLOT_BUSY',
      'SLOT_NOT_ENOUGH_MONEY',
      // 'SLOT_QUEUE',
      'SLOT_UNAVAILABLE',

      'ROULETTE_BET',
      'ROULETTE_WIN_SMALL',
      'ROULETTE_WIN_NUMBER',
      'ROULETTE_NOT_YET_ACCEPTING',
      'ROULETTE_NO_MORE',

      'HACKER_SLOT_CLUE',
      'HACKER_ROULETTE_CLUE',

      // End casino-specific

      // Start clue-specific

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

      // End clue-specific

      // BELOW TEXTS NOT IN USE DURING CLUE

      'ALIAS_CHANGED',
      'ALIAS_MISSION_ACTIVE',

      'ACHIEVEMENT_UNLOCK',
      'ACHIEVEMENT_UNLOCK_DURING_REVEAL',
      'ALL_ACHIEVEMENTS_UNLOCKED',
    ],
  },
  triggerNum: {
    type: SimpleSchema.Integer,
    optional: true,
  },
  image_url: {
    type: String,
    optional: true,
  },
});

interface AutoText {
  _id?: string;
  event: string;
  playerText: string;
  trigger: string;
  triggerNum: number;
  image_url?: string;
}

export default AutoTextSchema;
export { AutoText, AutoTextSchema };
