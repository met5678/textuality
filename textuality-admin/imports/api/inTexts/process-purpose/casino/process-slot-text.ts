import { InText } from '/imports/schemas/inText';
import { PlayerWithHelpers } from '../../../players/players';
import { sendAutoText } from '/imports/api/autoTexts/methods/autoTexts.send';
import { getSlotMachineForShort } from '/imports/api/themes/casino/slotMachines/methods/slotMachines.getForShort';
import { processSlotSpinRequest } from '/imports/api/themes/casino/slotMachines/methods/slotMachines.processSpinRequest';
import SlotMachines from '/imports/api/themes/casino/slotMachines';
import Events from '/imports/api/events';

const getSlotMachine = async (inText: InText) => {
  if (inText.interactive) {
    console.log(inText.interactive.value);
    const [, slotId] = inText.interactive.value.split('/');
    return await SlotMachines.findOneAsync({
      _id: slotId,
      event: await Events.currentIdOrThrowAsync(),
    });
  } else {
    const firstSpace =
      inText.body.indexOf(' ') > 0
        ? inText.body.indexOf(' ')
        : inText.body.length;
    const betCode = inText.body.substring(1, firstSpace).trim().toLowerCase();

    return await getSlotMachineForShort(betCode);
  }
};

export const processSlotText = async (
  inText: InText,
  player: PlayerWithHelpers,
) => {
  const playerId = player._id;

  const slotMachine = await getSlotMachine(inText);

  if (slotMachine) {
    await processSlotSpinRequest({
      player_id: playerId,
      slot_id: slotMachine._id,
    });
    return;
  }

  sendAutoText({
    playerId,
    trigger: 'INVALID_BET',
  });
};
