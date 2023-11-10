import SimpleSchema from 'simpl-schema';

import Events from '/imports/api/events';

const SlotQuestSequenceItemSchema = new SimpleSchema({
  slot_id: String,
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
    minCount: 2,
  },
  'slot_sequence.$': String,
  win_amount: SimpleSchema.Integer,
  // 'slot_sequence.$': SlotQuestSequenceItemSchema,
});

const TaskQuestSchema = new SimpleSchema({
  name: String,
  start_text: String,
  start_text_image: String,
  hashtag: String,
});

const QuestSchema = new SimpleSchema({
  event: {
    type: String,
    allowedValues: Events.allIds,
  },
  type: {
    type: String,
    allowedValues: ['HACKER_TASK', 'HACKER_SLOT'],
  },

  slot_quest: {
    type: SlotQuestSchema,
    optional: true,
  },

  task_quest: {
    type: TaskQuestSchema,
    optional: true,
  },
});

interface SlotQuest {
  start_text: string;
  start_text_image: string;
  complete_text: string;
  complete_text_image: string;
  slot_sequence: string[];
}

interface TaskQuest {
  start_text: string;
  start_text_image: string;
  hashtag: string;
}

interface Quest {
  _id?: string;
  event: string;
  type: string;

  slot_quest?: SlotQuest;
  task_quest?: TaskQuest;
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
};
