import { Meteor } from 'meteor/meteor';

export default {
  test: ({ player }) => player.status === 'new',
  action: ({ inText, player, media }) => {
    player = { ...player };
    inText = { ...inText };

    inText.purpose = 'initial';
    player.status = 'tentative';

    if (!media) {
      Meteor.call('autoTexts.send', { player, trigger: 'WELCOME_NO_IMAGE' });
    } else if (media.faces.length === 0) {
      Meteor.call('autoTexts.send', { player, trigger: 'WELCOME_NO_FACE' });
    } else if (media.faces.length > 2) {
      Meteor.call('autoTexts.send', {
        player,
        trigger: 'WELCOME_MULTI_FACES'
      });
    } else {
      inText.avatar = media._id;
      player.avatar = media._id;
      player.status = 'active';
      Meteor.call('autoTexts.send', { player, trigger: 'WELCOME' });
    }

    Meteor.call('players.update', player);

    return {
      inText,
      player,
      media,
      handled: true
    };
  }
};
