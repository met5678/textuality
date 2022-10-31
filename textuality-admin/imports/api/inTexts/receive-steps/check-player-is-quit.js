import { Meteor } from 'meteor/meteor';

export default {
  test: ({ player }) => player.status === 'quit',
  action: ({ inText, player, media }) => {
    player = { ...player };

    player.status = 'active';
    Meteor.call('players.update', player);
    Meteor.call('autoTexts.send', { player, trigger: 'SIGN_BACK_ON' });

    return {
      inText,
      player,
      media
    };
  }
};
