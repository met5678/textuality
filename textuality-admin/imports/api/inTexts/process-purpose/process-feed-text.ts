import { Meteor } from 'meteor/meteor';

import Media from '/imports/api/media';
import { InText } from '/imports/schemas/inText';
import { PlayerWithHelpers } from '../../players/players';

export default function (inText: InText, player: PlayerWithHelpers) {
  const playerId = player._id;

  if (inText.purpose === 'feed') {
    Meteor.call('autoTexts.send', {
      trigger: 'INVALID_REGULAR_TEXT',
      playerId,
    });
  }

  if (inText.purpose === 'mediaOnly') {
    Meteor.call('autoTexts.send', {
      trigger: 'INVALID_MEDIA_ONLY_TEXT',
      playerId,
    });
  }
}
