import { Meteor } from 'meteor/meteor';

import Events from 'api/events';
import OutTexts from './outTexts';

import { send } from 'services/twilio';

Meteor.methods({
  'outTexts.send': ({ body, media_url, players, source }) => {
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
        to: player.phone_number,
        from: event.phone_number
      };

      if (body) message.body = body;
      if (media_url) message.media_url = media_url;

      send(message);
    });
  }
});
