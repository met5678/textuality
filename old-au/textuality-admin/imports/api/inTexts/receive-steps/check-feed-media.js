import { Meteor } from 'meteor/meteor';

export default {
  test: ({ inText, media }) => media && inText.purpose !== 'system',
  action: ({ inText, player, media }) => {
    inText = { ...inText };
    media = { ...media };

    if (!inText.body) {
      inText.purpose = 'mediaOnly';
    }

    media.purpose = 'feed';
    Meteor.call('media.update', media);

    return {
      handled: inText.purpose === 'mediaOnly',
      inText,
      player,
      media
    };
  }
};
