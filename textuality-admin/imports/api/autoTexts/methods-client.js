import { Meteor } from 'meteor/meteor';

import AutoTexts from './autoTexts';
import Events from 'api/events';

Meteor.methods({
  'autoTexts.send': ({ trigger, trigger_num, player }) => {
    const autoTextQuery = { event: Events.currentId(), trigger };
    if (trigger_num) autoTextQuery.trigger_num = trigger_num;

    const matchingAutoTexts = AutoTexts.find(autoTextQuery).fetch();
    if (matchingAutoTexts.length === 0) {
      console.log('No matching autoTexts', { trigger, trigger_num });
      return;
    }

    const autoText =
      matchingAutoTexts[Math.floor(Math.random() * matchingAutoTexts.length)];

    if (autoText.playerText) {
      const body = autoText.playerText.replace('[alias]', player.alias);
      Meteor.call('outTexts.send', {
        players: [player],
        body,
        source: 'auto'
      });
    }

    // if (autoText.screenText) {
    //   const body = autoText.screenText.replace('[alias]', player.alias);
    //   Meteor.call('inTexts.sendSystemText', { body, player });
    // }
  }
});
