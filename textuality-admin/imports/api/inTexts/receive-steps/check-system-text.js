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

    // Change alias
    if (command === 'alias') {
      const oldAliases = [player.alias, ...player.oldAliases];
      const newAlias = Meteor.call('aliases.checkout', oldAliases);
      player.oldAliases = oldAliases;
      player.alias = newAlias;
      inText.alias = newAlias;

      Meteor.call('players.update', player);
      Meteor.call('autoTexts.send', { player, trigger: 'ALIAS_CHANGED' });
    }

    // Leave party
    else if (command === 'leave') {
      player.status = 'quit';

      Meteor.call('players.update', player);
      Meteor.call('autoTexts.send', { player, trigger: 'SIGN_OFF' });
    }

    // Send status text
    else if (command === 'status') {
      Meteor.call('autoTexts.sendStatus', { player });
    }

    // Invalid command
    else {
      Meteor.call('autoTexts.send', { player, trigger: 'INVALID_COMMAND' });
    }

    inText.purpose = 'system';

    return { handled: true, inText, player, media };
  }
};
