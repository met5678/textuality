import SimpleSchema from 'simpl-schema';

import Events from '/imports/api/events';
import { EventId } from './event';

export const SlotQuestSchema = new SimpleSchema({
  slot_sequence: [String],
  win_amount: SimpleSchema.Integer,
});

export const TaskQuestSchema = new SimpleSchema({
  hashtag: String,
});

export const QuestSchema = new SimpleSchema({
  event: {
    type: String,
    allowedValues: Events.allIds,
  },
  name: String,
  type: {
    type: String,
    allowedValues: ['HACKER_TASK', 'HACKER_SLOT'],
  },
  start_text: String,
  start_text_image: {
    type: String,
    optional: true,
  },

  slot_quest: {
    type: SlotQuestSchema,
    optional: true,
  },
  task_quest: {
    type: TaskQuestSchema,
    optional: true,
  },

  num_assigned: {
    type: SimpleSchema.Integer,
    defaultValue: 0,
  },
  num_completed: {
    type: SimpleSchema.Integer,
    defaultValue: 0,
  },
});

export type SlotQuest = {
  slot_sequence: string[];
  win_amount: number;
}

export type TaskQuest = {
  hashtag: string;
}

export type QuestType = 'HACKER_TASK' | 'HACKER_SLOT';

export type QuestId = string;

export type Quest = {
  _id: QuestId;
  event: EventId;
  name: string;
  type: QuestType;
  start_text: string;
  start_text_image?: string;

  slot_quest?: SlotQuest;
  task_quest?: TaskQuest;

  num_assigned: number;
  num_competed: number;
}

export default QuestSchema;
