import { Meteor } from 'meteor/meteor';

export default {
  test: ({ inText }) => !inText.purpose,
  action: ({ inText, player, media }) => {
    inText = { ...inText };
    player = { ...player };

    if (inText.body) {
      if (inText.body.toLowerCase().includes('nigger')) {
        inText.purpose = 'ignore';
      } else {
        inText.purpose = 'feed';
      }
    }

    return {
      inText,
      player,
      media
    };
  }
};
