import { Meteor } from 'meteor/meteor';
import { InText } from '/imports/schemas/inText';
import { PlayerWithHelpers } from '../../../players/players';
import { sendAutoText } from '/imports/api/autoTexts/methods/autoTexts.send';
import { getSlotMachineForShortCode } from '/imports/api/themes/casino/slotMachines/methods/slotMachines.getForShort';
import { processSlotSpinRequest } from '/imports/api/themes/casino/slotMachines/methods/slotMachines.processSpinRequest';

export const processSlotText = async (
  inText: InText,
  player: PlayerWithHelpers,
) => {
  const playerId = player._id;

  const firstSpace =
    inText.body.indexOf(' ') > 0
      ? inText.body.indexOf(' ')
      : inText.body.length;
  const betCode = inText.body.substring(1, firstSpace).trim().toLowerCase();
  const rest = inText.body.substring(firstSpace);

  const slotMachine = Meteor.call('slotMachines.getForShort', betCode);
  getSlotMachineForShortCode(betCode);
  if (slotMachine) {
    await processSlotSpinRequest({
      inText_id: inText._id,
      player_id: playerId,
      slot_id: slotMachine._id,
    });
    return;
  }

  sendAutoText({
    playerId,
    trigger: 'INVALID_BET',
    templateVars: {
      betCode,
    },
  });
};
