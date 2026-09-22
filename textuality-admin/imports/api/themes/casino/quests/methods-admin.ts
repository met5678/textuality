import { Meteor } from 'meteor/meteor';

import Quests from './quests';

Meteor.methods({
  'quests.new': (quest) => {
    const id = Quests.insert(quest);
    return id;
  },

  'quests.update': (quest) => {
    Quests.update(quest._id, { $set: quest });
  },

  'quests.delete': (questId) => {
    if (Array.isArray(questId)) {
      Quests.remove({ _id: { $in: questId } });
    } else {
      Quests.remove(questId);
    }
  },

  'quests.resetEvent': (event_id) => {
    Quests.update(
      { event: event_id },
      {
        $set: {
          num_assigned: 0,
          num_completed: 0,
        },
      },
      { multi: true },
    );
  },

  'quests.copyFrom': (destinationEventId: string, sourceEventId: string) => {
    // First, delete existing quests in the destination event
    Quests.remove({ event: destinationEventId, type: 'HACKER_TASK' });

    const sourceQuests = Quests.find({
      event: sourceEventId,
      type: 'HACKER_TASK',
    }).fetch();
    sourceQuests.forEach((sourceQuest) => {
      const destinationQuest = {
        ...sourceQuest,
        event: destinationEventId,
      };
      delete destinationQuest._id;
      Quests.insert(destinationQuest);
    });
  },
});
