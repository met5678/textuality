import { Meteor } from 'meteor/meteor';

import Events from '/imports/api/events';
import OutTexts from './outTexts';

import { Player } from '/imports/schemas/player';
import { OutText } from '/imports/schemas/outText';

interface OutTextSendArgs {
  body: string;
  mediaUrl?: string;
  players: Player[];
  source: 'auto' | 'manual' | 'achievement' | 'mission' | 'unknown';
}

Meteor.methods({
  'outTexts.send': ({ body, mediaUrl, players, source }: OutTextSendArgs) => {
    const event = Events.current();
    if (!event) return;

    if (!source) {
      source = 'unknown';
    }

    players.forEach((player) => {
      const outText: OutText = {
        event: event._id,
        body,
        player_id: player._id!,
        player_number: player.phoneNumber,
        player_alias: player.alias,
        media_url: mediaUrl,
        time: new Date(),
        status: 'unsent',
        source: source,
      };

      OutTexts.insert(outText);
    });
  },
});
