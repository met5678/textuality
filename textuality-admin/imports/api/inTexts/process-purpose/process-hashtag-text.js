import { Meteor } from 'meteor/meteor';

import Players from 'api/players';

export default function(inText) {
  const player = Players.findOne(inText.player);
  const playerId = player._id;

  const firstSpace =
    inText.body.indexOf(' ') > 0
      ? inText.body.indexOf(' ')
      : inText.body.length;
  const hashtag = inText.body
    .substring(1, firstSpace)
    .trim()
    .toLowerCase();
  const rest = inText.body.substring(firstSpace);

  const checkpoint = Meteor.call('checkpoints.getForHashtag', hashtag);
  if (checkpoint) {
    if (
      player.checkpoints.some(
        pCheckpoint => pCheckpoint.checkpoint === checkpoint._id
      )
    ) {
      Meteor.call('autoTexts.send', {
        playerId,
        trigger: 'CHECKPOINT_ALREADY_FOUND'
      });
    } else {
      Meteor.call('checkpoints.awardToPlayer', {
        playerId,
        checkpointId: checkpoint._id
      });
    }
  } else {
    Meteor.call('autoTexts.send', { playerId, trigger: 'INVALID_HASHTAG' });
  }

  inText.purpose = 'hashtag';
}
