import { Meteor } from 'meteor/meteor';

import Events from 'api/events';
import Media from './media';

import uploadImage from 'services/upload-image';

const acceptedContentTypes = [];
const avatarTransformations = [
  { width: 100, height: 100, crop: 'thumb', gravity: 'face', zoom: 1.1 },
  { width: 400, height: 400, crop: 'thumb', gravity: 'face', zoom: 0.75 }
];
const feedTransformations = [
  { width: 800, height: 800, crop: 'lfill' },
  { width: 800, height: 800, crop: 'lfill', gravity: 'faces' }
];

Meteor.methods({
  'media.receive': ({ purpose, message, player }) => {
    const { url, contentType } = message.media;

    // If not one of these, ignore the image
    if (!['feed', 'mediaOnly', 'initial'].includes(purpose)) return null;

    // If not an accepted content type, ignore the image
    if (contentType.startsWith('video/')) {
      Meteor.call('autoTexts.send', {
        playerId: player._id,
        trigger: 'SENT_VIDEO'
      });
      return null;
    } else if (!contentType.startsWith('image/')) {
      Meteor.call('autoTexts.send', {
        playerId: player._id,
        trigger: 'INVALID_CONTENT_TYPE'
      });
      return null;
    }

    let transformations = null;
    let imagePurpose = 'none';
    if (purpose === 'initial') {
      imagePurpose = 'avatar';
      transformations = avatarTransformations;
    } else {
      imagePurpose = 'feed';
      transformations = feedTransformations;
    }

    const { cloudinaryId, faces, width, height } = uploadImage(
      url,
      transformations
    );

    return Media.insert({
      _id: cloudinaryId,
      event: Events.currentId(),
      purpose: imagePurpose,
      faces,
      width,
      height,
      type: contentType === 'image/gif' ? 'anim-gif' : 'image',
      time: new Date(),
      player: player._id
    });
  }
});
