import { Meteor } from 'meteor/meteor';

import Players from 'api/players';
import Media from 'api/media';

export default function(inText) {
  const player = Players.findOne(inText.player);
  const playerId = player._id;

  const prefix = player.status === 'new' ? 'WELCOME' : 'TENTATIVE';

  Meteor.call('players.setStatus', { playerId, status: 'tentative' });

  if (!inText.media) {
    Meteor.call('autoTexts.send', { playerId, trigger: `${prefix}_NO_IMAGE` });
  } else {
    const media = Media.findOne(inText.media);

    if (media.faces.length === 0) {
      Meteor.call('autoTexts.send', { playerId, trigger: `${prefix}_NO_FACE` });
    } else if (media.faces.length > 2) {
      Meteor.call('autoTexts.send', {
        playerId,
        trigger: `${prefix}_MULTI_FACES`
      });
    } else {
      Meteor.call('players.setAvatar', {
        playerId,
        avatar: media._id
      });
      Meteor.call('players.setStatus', {
        playerId,
        status: 'active'
      });
      if (prefix === 'WELCOME')
        Meteor.call('autoTexts.send', { playerId, trigger: 'WELCOME' });
      else
        Meteor.call('autoTexts.send', {
          playerId,
          trigger: 'TENTATIVE_WELCOME'
        });
    }
  }
}
