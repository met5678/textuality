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
});
