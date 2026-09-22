import { InText } from '/imports/schemas/inText';
import { PlayerWithHelpers } from '../../players/players';
import { sendAutoText } from '../../autoTexts/methods/autoTexts.send';

export default function (inText: InText, player: PlayerWithHelpers) {
  const playerId = player._id;

  if (inText.purpose === 'feed') {
    sendAutoText({
      trigger: 'INVALID_REGULAR_TEXT',
      playerId,
    });
  }
}
