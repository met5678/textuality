import { Meteor } from 'meteor/meteor';

import Checkpoints from './checkpoints';
import Events from 'api/events';

Meteor.methods({
  'checkpoints.getForHashtag': hashtag => {
    const checkpointQuery = { event: Events.currentId(), hashtag };

    const checkpoint = Checkpoints.findOne(checkpointQuery);
    if (!checkpoint) {
      return null;
    }

    return checkpoint;
  }
});
