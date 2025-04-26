import { Meteor } from 'meteor/meteor';

import InTexts from './inTexts';
import Events from '/imports/api/events';

import getPurpose from './get-purpose/get-purpose';
import processInitialText from './process-purpose/process-initial-text';
import processSystemText from './process-purpose/process-system-text';
import processHashtagText from './process-purpose/process-hashtag-text';
import { InText } from '/imports/schemas/inText';
import { IncomingMessageData } from '/imports/services/whatsapp';
import processBetText from './process-purpose/process-bet-text';
import processFeedText from './process-purpose/process-feed-text';
import OutTexts from '../outTexts';

Meteor.methods({
  'inTexts.receive': async (message: IncomingMessageData) => {
    const eventId = Events.currentIdOrThrow();

    const player = await Meteor.callAsync('players.findOrJoin', message.from);
    const purpose = getPurpose({ message, player });

    const inTextRaw: Omit<InText, '_id'> = {
      event: eventId,
      player: player._id,
      body: message.text,
      time: new Date(),
      purpose,
      alias: player.alias,
      avatar: player.avatar,
      numAchievements: player.numAchievements,
    };

    if (message.media) {
      inTextRaw.media = Meteor.call('media.receive', {
        purpose,
        message,
        player,
      });
    }

    const id = await InTexts.insertAsync(inTextRaw);
    const inText: InText = { ...inTextRaw, _id: id };

    Meteor.call('players.updateAfterInText', inText);

    inText.purpose === 'initial' && processInitialText(inText, player);
    inText.purpose === 'system' && processSystemText(inText, player);
    inText.purpose === 'hashtag' && processHashtagText(inText, player);
    inText.purpose === 'bet' && processBetText(inText, player);
    inText.purpose === 'feed' && processFeedText(inText, player);
    inText.purpose === 'mediaOnly' && processFeedText(inText, player);

    Meteor.call('achievements.checkAfterInText', inText);
  },
});
