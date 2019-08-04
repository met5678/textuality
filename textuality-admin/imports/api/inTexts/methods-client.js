import { Meteor } from 'meteor/meteor';

import InTexts from './inTexts';
import Events from 'api/events';

import { uploadImage, getImageUrl } from 'services/cloudinary';

Meteor.methods({
  'inTexts.receive': message => {
    // if(playerIsNew) {
    //   // Create Player
    // }

    // else if(playerIsTentative) {

    // }

    // else if(isSystemText) {

    // }

    // else if(isHashtag) {

    // }

    // const inText = {
    //   event: Events.currentId(),
    //   body: message.body,
    //   time: new Date()
    // };

    const { player, isNew } = Meteor.call('players.getForMessage', message);

    const inText = {
      event: Events.currentId(),
      body: message.body,
      player: player._id,
      alias: player.alias,
      avatar_url: player.avatar,
      num_achievements: player.achievements.length,
      purpose: 'feed',
      time: new Date()
    };

    if (Array.isArray(message.media)) {
      message.media.forEach(media => {
        const imageObj = uploadImage(media.url, args => console.log(args));
        console.log(imageObj);
        console.log(
          (inText.avatar_url = getImageUrl(imageObj.cloudinaryId, {
            width: 300,
            height: 300,
            crop: 'thumb',
            gravity: 'face',
            zoom: 1.1
          }))
        );
      });
    }

    Meteor.call('autoTexts.send', { player, trigger: 'WELCOME' });

    InTexts.insert(inText);
  }
});
