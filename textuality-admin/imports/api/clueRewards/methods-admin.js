import { Meteor } from 'meteor/meteor';

import ClueRewards from './clueRewards';
import Events from 'api/events';

Meteor.methods({
  'clueRewards.update': (clueReward) => {
    ClueRewards.update(clueReward._id, {
      $set: clueReward,
    });
  },

  'clueRewards.delete': (clueRewardId) => {
    if (Array.isArray(clueRewardId)) {
      ClueRewards.remove({ _id: { $in: clueRewardId } });
    } else {
      ClueRewards.remove(clueRewardId);
    }
  },

  'clueRewards.resetEvent': () => {
    ClueRewards.remove({ event: Events.currentId() });
  },
});
