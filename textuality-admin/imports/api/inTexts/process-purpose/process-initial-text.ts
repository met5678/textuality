import { Meteor } from 'meteor/meteor';

import Media from '/imports/api/media';
import { InText } from '/imports/schemas/inText';
import { PlayerWithHelpers } from '../../players/players';
import { sendAutoText } from '../../autoTexts/methods/autoTexts.send';

export default async function (inText: InText, player: PlayerWithHelpers) {
  const playerId = player._id;

  const prefix = player.status === 'new' ? 'WELCOME' : 'TENTATIVE';

  Meteor.call('players.setStatus', { playerId, status: 'tentative' });

  console.log('Got here');

  if (!inText.media) {
    console.log('Will send autotext');
    sendAutoText({
      playerId,
      trigger: `${prefix}_NO_IMAGE`,
    });
  } else {
    const media = await Media.findOneAsync(inText.media);
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
