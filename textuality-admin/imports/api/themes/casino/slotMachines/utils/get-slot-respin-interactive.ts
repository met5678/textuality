import { OutTextInteractivePayload } from '/imports/schemas/outText';
import { SlotMachineId } from '/imports/schemas/slotMachine';

export const getSlotRespinInteractive = (
  slotMachineId: SlotMachineId,
): OutTextInteractivePayload => {
  return {
    type: 'buttons',
    options: [
      {
        label: 'Spin Again',
        value: `slotMachine/${slotMachineId}`,
      },
    ],
  };
};
