import { Meteor } from 'meteor/meteor';

export default {
  test: ({ inText }) => inText.body && inText.body.startsWith('/'),
  action: ({ inText, player, media }) => {
    inText = { ...inText };
    player = { ...player };

    const firstSpace =
      inText.body.indexOf(' ') > 0
        ? inText.body.indexOf(' ')
        : inText.body.length;
    const command = inText.body
      .substring(1, firstSpace)
      .trim()
      .toLowerCase();
    const rest = inText.body.substring(firstSpace);

    if (command === 'alias') {
      player = Meteor.call('player.changeAlias');
      Meteor.call('autoTexts.send', { player, trigger: 'CHANGE_ALIAS' });
    } else if (command === 'leave') {
      const oldAliases = [player.alias, ...player.old_aliases];
      const newAlias = Meteor.call('aliases.checkout', oldAliases);
      player.old_aliases = oldAliases;
      player.alias = newAlias;
      inText.alias = newAlias;

      Meteor.call('players.update', player);
      Meteor.call('autoTexts.send', { player, trigger: 'SIGN_OFF' });
    } else if (command === 'avatar') {
      // We might not do this one
    } else if (command === 'status') {
      Meteor.call('autoTexts.sendStatus', { player });
    } else {
      Meteor.call('autoTexts.send', { player, trigger: 'INVALID_COMMAND' });
    }

    return { inText, player, media };
  }
};
