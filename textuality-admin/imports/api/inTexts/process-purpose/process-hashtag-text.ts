import { Meteor } from 'meteor/meteor';

import { InText } from '/imports/schemas/inText';
import { PlayerWithHelpers } from '../../players/players';

export default function (inText: InText, player: PlayerWithHelpers) {
  const playerId = player._id;

  const firstSpace =
    inText.body.indexOf(' ') > 0
      ? inText.body.indexOf(' ')
      : inText.body.length;
  const hashtag = inText.body.substring(1, firstSpace).trim().toLowerCase();
  const rest = inText.body.substring(firstSpace);

  if (Meteor.call('missions.processHashtag', { playerId, hashtag })) return;
  if (Meteor.call('quests.processHashtag', { playerId, hashtag })) return;

  const checkpoint = Meteor.call('checkpoints.getForHashtag', hashtag);
  if (checkpoint) {
    if (
      player.checkpoints.some(
        (pCheckpoint) => pCheckpoint.id === checkpoint._id,
      )
    ) {
      if (checkpoint.suppress_autotext) {
        Meteor.call('autoTexts.send', {
          playerId,
          trigger: 'CHECKPOINT_ALREADY_FOUND_HIDDEN',
        });
      } else {
        Meteor.call('autoTexts.send', {
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
    Meteor.call('autoTexts.send', { playerId, trigger: 'INVALID_HASHTAG' });
  }
}
