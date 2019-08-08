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
    } else {
      if (media.faces.length === 0) {
        media.purpose = 'avatar-fail';

        Meteor.call('autoTexts.send', { player, trigger: 'WELCOME_NO_FACE' });
      } else if (media.faces.length > 2) {
        media.purpose = 'avatar-fail';

        Meteor.call('autoTexts.send', {
          player,
          trigger: 'WELCOME_MULTI_FACES'
        });
      } else {
        inText.avatar = media._id;
        player.avatar = media._id;
        player.status = 'active';
        media.purpose = 'avatar';

        Meteor.call('autoTexts.send', { player, trigger: 'WELCOME' });
        // Meteor.call('achievements.check', { player, trigger: 'JOINED' });
      }
      Meteor.call('media.update', media);
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
