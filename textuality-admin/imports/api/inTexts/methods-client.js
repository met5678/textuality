import { Meteor } from 'meteor/meteor';

import InTexts from './inTexts';
import Events from 'api/events';

import receive from './receive-steps/receive';

Meteor.methods({
  'inTexts.receive': message => {
    let player = Meteor.call('players.findOrJoin', message.from);

    let media = message.media
      ? Meteor.call('media.receive', {
          url: message.media.url,
          contentType: message.media.contentType,
          player
        })
      : null;

    let inText = {
      event: Events.currentId(),
      player: player._id,
      alias: player.alias,
      avatar: player.avatar,
      media: media ? media._id : null,
      body: message.body,
      time: new Date()
    };

    inText = receive({ inText, player, media });

    inText.num_achievements = player.achievements.length;
    inText.num_checkpoints = player.checkpoints.length;

    InTexts.insert(inText);
  }
});
