import { Meteor } from 'meteor/meteor';

export default {
  test: ({ inText }) => !inText.purpose,
  action: ({ inText, player, media }) => {
    inText = { ...inText };

    inText.purpose = 'feed';

    return {
      inText,
      player,
      media
    };
  }
};
