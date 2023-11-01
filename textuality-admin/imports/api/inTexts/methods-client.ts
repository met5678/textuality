import { Meteor } from 'meteor/meteor';

import InTexts from './inTexts';
import Events from '/imports/api/events';

import getPurpose from './get-purpose/get-purpose';
import processInitialText from './process-purpose/process-initial-text';
import processSystemText from './process-purpose/process-system-text';
import processHashtagText from './process-purpose/process-hashtag-text';
import { InText } from '/imports/schemas/inText';

Meteor.methods({
  'inTexts.receive': (message) => {
    const player = Meteor.call('players.findOrJoin', message.from);
    const purpose = getPurpose({ message, player });

    // console.log({ message, purpose });

    const inText: InText = {
      event: Events.currentId()!,
      player: player._id,
      body: message.body,
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
    // inText.purpose === 'mission' && processMissionText(inText);

    Meteor.call('achievements.checkAfterInText', inText);
  },
});
