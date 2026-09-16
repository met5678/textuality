import SlotMachines from '../slotMachines';
import Events from '/imports/api/events';
import { getWrappedServerMethod } from '/imports/utils/get-wrapped-server-method';

export const getSlotMachineForShort = async (short: string) => {
  short = short.toLowerCase();
  const slotMachine = await SlotMachines.findOneAsync({
    event: await Events.currentIdOrThrowAsync(),
    short,
  });
  if (!slotMachine) return;
  return slotMachine;
};

export const getSlotMachineForShortMethod = getWrappedServerMethod(
  'slotMachines.getForShort',
  getSlotMachineForShort,
);
