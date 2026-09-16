import { Meteor } from 'meteor/meteor';

import { InText } from '/imports/schemas/inText';
import { PlayerWithHelpers } from '../../players/players';
import { sendAutoText } from '../../autoTexts/methods/autoTexts.send';
import { missionProcessHashtag } from '../../missions/methods/missions.processHashtag';

export default async function (inText: InText, player: PlayerWithHelpers) {
  const playerId = player._id;

  const firstSpace =
    inText.body.indexOf(' ') > 0
      ? inText.body.indexOf(' ')
      : inText.body.length;
  const hashtag = inText.body.substring(1, firstSpace).trim().toLowerCase();
  const rest = inText.body.substring(firstSpace);

  if (await missionProcessHashtag({ hashtag, playerId })) return;
  if (Meteor.call('quests.processHashtag', { playerId, hashtag })) return;

  const checkpoint = Meteor.call('checkpoints.getForHashtag', hashtag);
  if (checkpoint) {
    if (
      player.checkpoints.some(
        (pCheckpoint) => pCheckpoint.id === checkpoint._id,
      )
    ) {
      if (checkpoint.suppress_autotext) {
        sendAutoText({
          playerId,
          trigger: 'CHECKPOINT_ALREADY_FOUND_HIDDEN',
        });
      } else {
        sendAutoText({
          playerId,
          trigger: 'CHECKPOINT_ALREADY_FOUND',
        });
      }
    } else {
      Meteor.call('checkpoints.awardToPlayer', {
        playerId,
        checkpointId: checkpoint._id,
      });
    }
  } else {
    sendAutoText({ playerId, trigger: 'INVALID_HASHTAG' });
  }
}
