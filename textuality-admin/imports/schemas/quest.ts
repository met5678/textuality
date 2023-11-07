import SimpleSchema from 'simpl-schema';

import Events from '/imports/api/events';
import { SlotMachineResult, resultSchemaFields } from './slotMachine';

const SlotQuestSequenceItemSchema = new SimpleSchema({
  slot_id: String,
  ...resultSchemaFields,
  win_amount: {
    type: SimpleSchema.Integer,
    optional: true,
  },
});

const SlotQuestSchema = new SimpleSchema({
  start_text: String,
  start_text_image: String,
  complete_text: String,
  complete_text_image: String,
  slot_sequence: {
    type: Array,
    minCount: 1,
  },
  'slot_sequence.$': SlotQuestSequenceItemSchema,
});

const TaskQuestSchema = new SimpleSchema({
  start_text: String,
  start_text_image: String,
  hashtag: String,
});

const RouletteQuestSchema = new SimpleSchema({
  roulette_id: String,
  player_texts: {
    type: Array,
    defaultValue: [],
  },
  'player_texts.$': String,
});

const QuestSchema = new SimpleSchema({
  event: {
    type: String,
    allowedValues: Events.allIds,
  },
  type: {
    type: String,
    allowedValues: ['HACKER_TASK', 'HACKER_SLOT', 'HACKER_ROULETTE'],
  },

  slot_quest: {
    type: SlotQuestSchema,
    optional: true,
  },

  task_quest: {
    type: TaskQuestSchema,
    optional: true,
  },

  roulette_quest: {
    type: RouletteQuestSchema,
    optional: true,
  },
});

interface SlotQuest {
  start_text: string;
  start_text_image: string;
  complete_text: string;
  complete_text_image: string;
  slot_sequence: SlotQuestSequenceItem[];
}

interface SlotQuestSequenceItem {
  slot_id: string;
  result: SlotMachineResult;
  win_amount?: number;
}

interface TaskQuest {
  start_text: string;
  start_text_image: string;
  hashtag: string;
}

interface RouletteQuest {
  roulette_id: string;
  player_texts: string[];
}

interface Quest {
  _id?: string;
  event: string;
  type: string;

  slot_quest?: SlotQuest;
  task_quest?: TaskQuest;
  roulette_quest?: RouletteQuest;
}

export default QuestSchema;
export {
  Quest,
  QuestSchema,
  SlotQuest,
  SlotQuestSchema,
  SlotQuestSequenceItem,
  SlotQuestSequenceItemSchema,
  TaskQuest,
  TaskQuestSchema,
  RouletteQuest,
  RouletteQuestSchema,
};
