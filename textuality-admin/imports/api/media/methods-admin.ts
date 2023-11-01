import { Meteor } from 'meteor/meteor';

import Events from '/imports/api/events';
import Media from './media';

Meteor.methods({
  'media.update': (media) => {
    Media.update(media._id, { $set: media });
  },

  'media.delete': (media) => {
    if (Array.isArray(media)) {
      Media.remove({ _id: { $in: media } });
    } else {
      Media.remove(media);
    }
  },

  'media.resetEvent': () => {
    Media.remove({ event: Events.currentId()! });
  },
});
