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

Meteor.methods({
  'inTexts.receive': (message: IncomingMessageData) => {
    const player = Meteor.call('players.findOrJoin', message.from);
    const purpose = getPurpose({ message, player });

    const inText: InText = {
      event: Events.currentId()!,
      player: player._id,
      body: message.text,
      time: new Date(),
      purpose,
      alias: player.alias,
      avatar: player.avatar,
      numAchievements: player.numAchievements,
    };

    if (message.media) {
      inText.media = Meteor.call('media.receive', { purpose, message, player });
    }

    InTexts.insert(inText);
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
