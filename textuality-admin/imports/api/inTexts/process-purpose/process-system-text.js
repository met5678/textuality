import { Meteor } from 'meteor/meteor';

import Players from 'api/players';

export default function (inText) {
  const player = Players.findOne(inText.player);
  const playerId = player._id;

  const firstSpace =
    inText.body.indexOf(' ') > 0
      ? inText.body.indexOf(' ')
      : inText.body.length;
  const command = inText.body.substring(1, firstSpace).trim().toLowerCase();
  const rest = inText.body.substring(firstSpace);

  // Change alias
  // if (command === 'alias') {
  //   const oldAliases = [player.alias, ...player.oldAliases];
  //   const newAlias = Meteor.call('aliases.checkout', oldAliases);
  //   Meteor.call('players.setAlias', { playerId, alias: newAlias });
  //   Meteor.call('autoTexts.send', { playerId, trigger: 'ALIAS_CHANGED' });
  // }

  if (['suspect', 'room', 'weapon'].includes(command)) {
    Meteor.call('guesses.tryMakeGuess', {
      playerId,
      type: command,
      shortName: rest.trim(),
    });
  }

  // Leave party
  else if (command === 'leave') {
    Meteor.call('players.setStatus', { playerId, status: 'quit' });
    Meteor.call('autoTexts.send', { playerId, trigger: 'SIGN_OFF' });
  }

  // Send status text
  else if (command === 'casefile') {
    Meteor.call('autoTexts.sendStatus', { playerId });
  }

  // Invalid command
  else {
    Meteor.call('autoTexts.send', { playerId, trigger: 'INVALID_COMMAND' });
  }

  inText.purpose = 'system';
}
