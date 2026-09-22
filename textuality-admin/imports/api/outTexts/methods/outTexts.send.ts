import Events from '../../events';
import OutTexts from '../outTexts';
import {
  OutTextInteractivePayload,
  OutTextSource,
  OutText,
} from '/imports/schemas/outText';
import { Player } from '/imports/schemas/player';
import { OptionalId } from '/imports/utils/optional-id';
import { getWrappedServerMethod } from '/imports/utils/get-wrapped-server-method';

type OutTextSendArgs = {
  body: string;
  mediaUrl?: string;
  interactivePayload?: OutTextInteractivePayload;
  player: Player;
  source?: OutTextSource;
};

export const sendOutText = async ({
  player,
  body,
  mediaUrl,
  source,
  interactivePayload,
}: OutTextSendArgs) => {
  const eventId = Events.currentIdOrThrow();
  if (!source) {
    source = 'unknown';
  }

  const outText: OptionalId<OutText> = {
    event: eventId,
    body,
    player_id: player._id,
    player_number: player.phoneNumber,
    player_alias: player.alias,
    media_url: mediaUrl,
    time: new Date(),
    status: 'unsent',
    source: source,
    interactive: interactivePayload,
  };

  await OutTexts.insertAsync(outText);
};

export const sendOutTextMethod = getWrappedServerMethod(
  'outTexts.send',
  sendOutText,
);
