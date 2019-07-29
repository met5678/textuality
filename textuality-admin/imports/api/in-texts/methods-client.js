import { Meteor } from 'meteor/meteor';

import InTexts from './in-texts';
import Events from 'api/events';

Meteor.methods({
  'inTexts.receive': message => {
    const player = Meteor.call('players.getForMessage', message);

    const inText = {
      event: Events.currentId(),
      body: message.body,
      player: player._id,
      alias: player.alias,
      avatar_url: player.avatar,
      num_achievements: player.achievements.length,
      purpose: 'feed',
      time: new Date()
    };

    InTexts.insert(inText);
  }
});
