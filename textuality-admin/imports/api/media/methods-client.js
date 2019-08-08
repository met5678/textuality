import { Meteor } from 'meteor/meteor';

import Events from 'api/events';
import Media from './media';

import uploadImage from 'services/upload-image';

Meteor.methods({
  'media.receive': ({ url, contentType, player }) => {
    const { cloudinaryId, faces, width, height } = uploadImage(url);

    Media.insert({
      _id: cloudinaryId,
      event: Events.currentId(),
      purpose: 'none',
      faces,
      width,
      height,
      type: 'image',
      time: new Date(),
      player: player._id
    });

    return Media.findOne(cloudinaryId);
  },

  'media.update': media => {
    Media.update(media._id, { $set: media });
  }
});
