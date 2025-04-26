import { Meteor } from 'meteor/meteor';

import Events from '/imports/api/events';
import OutTexts from './outTexts';

import { Player } from '/imports/schemas/player';
import {
  OUT_TEXT_STATUS,
  OutText,
  OutTextId,
  OutTextSource,
  OutTextStatus,
} from '/imports/schemas/outText';
import { OptionalId } from '/imports/utils/optional-id';

interface OutTextSendArgs {
  body: string;
  mediaUrl?: string;
  players: Player[];
  source?: OutTextSource;
}

Meteor.methods({
  'outTexts.send': async ({
    body,
    mediaUrl,
    players,
    source,
  }: OutTextSendArgs) => {
    const event = Events.current();
    if (!event) return;

    if (!source) {
      source = 'unknown';
    }

    await Promise.all(
      players.map(async (player) => {
        const outText: OptionalId<OutText> = {
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

        await OutTexts.insertAsync(outText);
      }),
    );
  },

  'outTexts.updateStatus': async (
    message_id: OutTextId,
    status: OutTextStatus,
  ) => {
    const outText = await OutTexts.findOneAsync(message_id);
    if (!outText) {
      console.warn('Trying to update status for nonexistent id', {
        message_id,
      });
      return;
    }
    if (
      OUT_TEXT_STATUS.indexOf(status) > OUT_TEXT_STATUS.indexOf(outText.status)
    ) {
      await OutTexts.updateAsync(outText._id, { $set: { status } });
    }
  },

  'outTexts.updateStatusByExternalId': async (
    external_id: string,
    status: OutTextStatus,
  ) => {
    const outText = await OutTexts.findOneAsync({ external_id });
    if (outText)
      await Meteor.callAsync('outTexts.updateStatus', outText._id, status);
    else {
      console.warn('Trying to update status for nonexistent id', {
        external_id,
        status,
      });
    }
  },

  'outTexts.setExternalId': async (message_id: string, external_id: string) => {
    await OutTexts.updateAsync(message_id, { $set: { external_id } });
  },
});
