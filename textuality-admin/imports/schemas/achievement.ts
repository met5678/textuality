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
      'CHECKPOINT_GROUP_FOUND_N',
      'CHECKPOINT_LOCATION_COMPLETE',
      'CHECKPOINT_LOCATION_FOUND_N',

      'SLOT_QUEST_COMPLETE',
      'HACKER_TASK_COMPLETE',
      'MISSION_COMPLETE',

      'SLOT_WIN_NORMAL',
      'SLOT_WIN_HACKER',
      'SLOT_SPIN_ALL',

      'EMOJIS_IN_TEXT',
      'GUESS_COMPLETE',
      'JOINED',
      'REJOINED',
      'MISSION',
      'N_MISSION',
      'N_PICTURES_SENT',
      'N_TEXTS_SENT',
      'PICTURE_MULTI_FACES',
    ],
  },
  trigger_detail_string: {
    type: String,
    optional: true,
  },
  trigger_detail_number: {
    type: SimpleSchema.Integer,
    optional: true,
  },
  money_award: {
    type: SimpleSchema.Integer,
    optional: true,
    defaultValue: 0,
  },
  quest_award_type: {
    type: String,
    optional: true,
    // TODO: Replace this list with a function that polls for quest types
    defaultValue: 'NONE',
    allowedValues: ['NONE', 'HACKER_TASK', 'HACKER_SLOT', 'HACKER_ROULETTE'],
  },
  player_text: {
    type: String,
    optional: true,
  },
  player_text_image: {
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
  trigger: string;
  trigger_detail_string?: string;
  trigger_detail_number?: number;
  money_award?: number;
  quest_award_type?: 'NONE' | 'HACKER_TASK' | 'HACKER_SLOT' | 'HACKER_ROULETTE';
  player_text?: string;
  player_text_image?: string;

  hide_from_screen: boolean;
  earned: number;
}

export default AchievementSchema;
export { Achievement, AchievementSchema };
