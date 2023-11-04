import { Meteor } from 'meteor/meteor';

import Events from '/imports/api/events';
import Media from './media';

import { uploadImage } from '/imports/services/cloudinary/cloudinary-upload';
import { MediaPurpose } from '/imports/schemas/media';

const avatarTransformations = [
  { width: 100, height: 100, crop: 'thumb', gravity: 'face', zoom: 1.1 },
  { width: 400, height: 400, crop: 'thumb', gravity: 'face', zoom: 0.75 },
];
const feedTransformations = [
  { width: 800, height: 800, crop: 'lfill' },
  { width: 800, height: 800, crop: 'lfill', gravity: 'faces' },
];

Meteor.methods({
  'media.receive': async ({ purpose, message, player }) => {
    const { url, content_type, mime_type, external_id } = message.media;

    console.log('Receiving media', message.media);

    // If not one of these, ignore the image
    if (!['feed', 'mediaOnly', 'initial'].includes(purpose)) return null;

    // If not an accepted content type, ignore the image
    if (content_type.startsWith('video')) {
      Meteor.call('autoTexts.send', {
        playerId: player._id,
        trigger: 'SENT_VIDEO',
      });
      return null;
    } else if (!content_type.startsWith('image')) {
      Meteor.call('autoTexts.send', {
        playerId: player._id,
        trigger: 'INVALID_CONTENT_TYPE',
      });
      return null;
    }

    // let transformations = null;
    let imagePurpose: MediaPurpose = 'none';
    if (purpose === 'initial') {
      imagePurpose = 'avatar';
      // transformations = avatarTransformations;
    } else {
      imagePurpose = 'feed';
      // transformations = feedTransformations;
    }

    // const { cloudinaryId, faces, width, height } = await uploadImage(
    //   url,
    //   transformations,
    // );

    const { cloudinaryId, faces, width, height } = await uploadImage(url);

    console.log('Uploaded', { cloudinaryId, faces, width, height });

    return Media.insert({
      _id: cloudinaryId,
      event: Events.currentId()!,
      purpose: imagePurpose,
      faces,
      width,
      height,
      content_type: 'image',
      mime_type,
      external_id,
      time: new Date(),
      player: player._id,
    });
  },
});
