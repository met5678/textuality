import { Meteor } from 'meteor/meteor';

import Events from '/imports/api/events';
import OutTexts from './outTexts';

import { send as twilioSend } from '/imports/services/twilio';
import { send as whatsappSend } from '/imports/services/whatsapp';
import { Player } from '/imports/schemas/player';

interface OutTextSendArgs {
  body: string;
  mediaUrl: string;
  players: Player[];
  source: string;
}

Meteor.methods({
  'outTexts.send': ({ body, mediaUrl, players, source }: OutTextSendArgs) => {
    const event = Events.current();
    if (!event) return;

    if (!source) {
      source = 'unknown';
    }

    const outText = {
      event: event._id,
      body,
      players: players.map((player) => player._id!),
      time: new Date(),
      source,
    };

    OutTexts.insert(outText);

    players.forEach((player) => {
      whatsappSend({
        to: player.phoneNumber,
        from: event.phoneNumber,
        text: body,
      });

      // send(message);
    });
  },
});
