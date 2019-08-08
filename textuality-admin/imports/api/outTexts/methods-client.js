import { Meteor } from 'meteor/meteor';

import Events from 'api/events';
import OutTexts from './outTexts';

import { send } from 'services/twilio';

Meteor.methods({
  'outTexts.send': ({ body, mediaUrl, players, source }) => {
    const event = Events.current();

    if (!source) {
      source = 'unknown';
    }

    const outText = {
      event: event._id,
      body,
      players: players.map(player => player._id),
      time: new Date(),
      source
    };

    OutTexts.insert(outText);

    players.forEach(player => {
      const message = {
        to: player.phoneNumber,
        from: event.phoneNumber
      };

      if (body) message.body = body;
      if (mediaUrl) message.mediaUrl = mediaUrl;

      send(message);
    });
  }
});
