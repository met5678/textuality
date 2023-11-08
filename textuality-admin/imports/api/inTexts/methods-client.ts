import { Meteor } from 'meteor/meteor';

import InTexts from './inTexts';
import Events from '/imports/api/events';

import getPurpose from './get-purpose/get-purpose';
import processInitialText from './process-purpose/process-initial-text';
import processSystemText from './process-purpose/process-system-text';
import processHashtagText from './process-purpose/process-hashtag-text';
import { InText } from '/imports/schemas/inText';
import { IncomingMessageData } from '/imports/services/whatsapp';
import processPercentText from './process-purpose/process-percent.text';

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
    // inText = receive({ inText, player, media });

    inText.purpose === 'initial' && processInitialText(inText);
    inText.purpose === 'system' && processSystemText(inText);
    inText.purpose === 'hashtag' && processHashtagText(inText);
    inText.purpose === 'percent' && processPercentText(inText);
    // inText.purpose === 'mission' && processMissionText(inText);

    Meteor.call('achievements.checkAfterInText', inText);
  },
});
