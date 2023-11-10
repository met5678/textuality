import { Meteor } from 'meteor/meteor';

import Media from '/imports/api/media';
import { InText } from '/imports/schemas/inText';
import { PlayerWithHelpers } from '../../players/players';

export default function (inText: InText, player: PlayerWithHelpers) {
  const playerId = player._id;

  const prefix = player.status === 'new' ? 'WELCOME' : 'TENTATIVE';

  Meteor.call('players.setStatus', { playerId, status: 'tentative' });

  if (!inText.media) {
    Meteor.call('autoTexts.send', { playerId, trigger: `${prefix}_NO_IMAGE` });
  } else {
    const media = Media.findOne(inText.media);
    if (!media) return;

    if (media.faces.length === 0) {
      Meteor.call('autoTexts.send', { playerId, trigger: `${prefix}_NO_FACE` });
    } else if (media.faces.length >= 2) {
      Meteor.call('autoTexts.send', {
        playerId,
        trigger: `${prefix}_MULTI_FACES`,
      });
    } else {
      Meteor.call('players.setAvatar', {
        playerId,
        avatar: media._id,
      });
      Meteor.call('players.setStatus', {
        playerId,
        status: 'active',
      });
      if (prefix === 'WELCOME')
        Meteor.call('autoTexts.send', { playerId, trigger: 'WELCOME' });
      else
        Meteor.call('autoTexts.send', {
          playerId,
          trigger: 'TENTATIVE_WELCOME',
        });
    }
  }
}
