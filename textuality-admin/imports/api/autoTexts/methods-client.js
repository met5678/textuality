import { Meteor } from 'meteor/meteor';

import AutoTexts from './autoTexts';
import Events from 'api/events';
import Players from 'api/players';

Meteor.methods({
  'autoTexts.send': ({ trigger, trigger_num, playerId }) => {
    const autoTextQuery = { event: Events.currentId(), trigger };
    if (trigger_num) autoTextQuery.trigger_num = trigger_num;

    const matchingAutoTexts = AutoTexts.find(autoTextQuery).fetch();
    if (matchingAutoTexts.length === 0) {
      console.log('No matching autoTexts', { trigger, trigger_num });
      return;
    }

    const autoText =
      matchingAutoTexts[Math.floor(Math.random() * matchingAutoTexts.length)];

    Meteor.call('autoTexts.sendCustom', {
      ...autoText,
      playerId,
      source: 'auto'
    });
  },

  'autoTexts.sendCustom': ({
    playerText,
    screenText,
    playerId,
    source = 'unknown'
  }) => {
    const player = Players.findOne(playerId);

    if (playerText) {
      const body = playerText.replace('[alias]', player.alias);
      Meteor.call('outTexts.send', {
        players: [player],
        body,
        source: 'auto'
      });
    }

    // if (screenText) {
    //   const body = screenText.replace('[alias]', player.alias);
    //   Meteor.call('inTexts.sendSystemText', { body, player });
    // }
  }
});
