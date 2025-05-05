import Events from '../../events';
import Players from '../../players/players';
import {
  AutoTextSendCustomArgs,
  sendCustomAutoText,
} from './autoTexts.sendCustom';

export type AutoTextSendBroadcastArgs = Omit<
  AutoTextSendCustomArgs,
  'playerId'
>;

export const sendBroadcastCustomAutoText = async ({
  playerText,
  mediaUrl,
  templateVars,
  interactivePayload,
  source,
}: AutoTextSendBroadcastArgs) => {
  const players = await Players.find({
    event: Events.currentIdOrThrow(),
  }).fetchAsync();
  if (!players.length) return;

  for (const player of players) {
    await sendCustomAutoText({
      playerText,
      playerId: player._id,
      templateVars,
      mediaUrl,
      interactivePayload,
      source,
    });
  }
};
