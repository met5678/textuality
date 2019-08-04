import { Meteor } from 'meteor/meteor';

export default {
  test: ({ inText }) => inText.body && inText.body.startsWith('/'),
  action: ({ inText, player, media }) => {
    const firstSpace =
      inText.body.indexOf(' ') > 0
        ? inText.body.indexOf(' ')
        : inText.body.length;
    const command = inText.body
      .substring(1, firstSpace)
      .trim()
      .toLowerCase();
    const args = inText.body.substring(firstSpace);

    if (command === 'alias') {
      player = Meteor.call('player.changeAlias');
      Meteor.call('autoTexts.send', { player, trigger: 'CHANGE_ALIAS' });
    } else if (command === 'leave') {
      player = Meteor.call('player.leave');
      Meteor.call('autoTexts.send', { player, trigger: 'SIGN_OFF' });
    } else if (command === 'avatar') {
    } else if (command === 'status') {
      Meteor.call('autoTexts.sendStatus', { player });
    } else {
      Meteor.call('autoTexts.send', { player, trigger: 'INVALID_COMMAND' });
    }

    return { inText, player, media };
  }
};
