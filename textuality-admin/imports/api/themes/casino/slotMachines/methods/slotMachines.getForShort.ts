import SlotMachines from '../slotMachines';
import Events from '/imports/api/events';

export const getSlotMachineForShortCode = async (short: string) => {
  short = short.toLowerCase();
  const slotMachine = await SlotMachines.findOneAsync({
    event: Events.currentId()!,
    short,
  });
  if (!slotMachine) return;
  return slotMachine;
};
