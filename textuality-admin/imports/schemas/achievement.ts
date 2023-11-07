import SimpleSchema from 'simpl-schema';

import Events from '/imports/api/events';

const AchievementSchema = new SimpleSchema({
  event: {
    type: String,
    allowedValues: Events.allIds,
  },
  name: String,
  trigger: {
    type: String,
    allowedValues: [
      'CHECKPOINT_FOUND',
      'CHECKPOINT_GROUP_COMPLETE',
      'CHECKPOINT_LOCATION_COMPLETE',
      'MISSION_COMPLETE',

      'SLOT_WIN_NORMAL',
      'SLOT_WIN_HACKER',
      'SLOT_SPIN_ALL',

      'EMOJIS_IN_TEXT',
      'GUESS_COMPLETE',
      'JOINED',
      'MISSION',
      'N_MISSION',
      'N_PICTURES_SENT',
      'N_TEXTS_SENT',
      'PICTURE_MULTI_FACES',
    ],
  },
  trigger_detail: {
    type: SimpleSchema.oneOf(String, SimpleSchema.Integer),
    optional: true,
  },
  money_award: {
    type: SimpleSchema.Integer,
    optional: true,
    defaultValue: 0,
  },
  reward_type: {
    type: String,
    optional: true,
    // TODO: Replace this list with a function that polls for quest types
    allowedValues: [
      'HACKER_RECRUIT',
      'HACKER_QUEST_SLOT',
      'HACKER_QUEST_ROULETTE',
      'HACKER_QUEST_HASHTAG',
    ],
  },
  reward_id: {
    type: String,
    optional: true,
  },
  player_text: {
    type: String,
    optional: true,
  },
  hide_from_screen: {
    type: Boolean,
    defaultValue: false,
  },
  earned: {
    type: SimpleSchema.Integer,
    defaultValue: 0,
  },
});

interface Achievement {
  _id?: string;
  event: string;
  name: string;
  number: number;
  trigger: string;
  trigger_detail?: string | number;
  money_award: number;
  reward_type?: string;
  reward_id?: string;
  player_text?: string;
  hide_from_screen: boolean;
  earned: number;
}

export default AchievementSchema;
export { Achievement, AchievementSchema };
