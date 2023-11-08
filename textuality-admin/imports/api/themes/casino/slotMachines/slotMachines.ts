import { Mongo } from 'meteor/mongo';

import { SlotMachine, SlotMachineSchema } from '/imports/schemas/slotMachine';

interface SlotMachineWithHelpers extends SlotMachine {
  getExpectedReturn(): number;
  getWinPercent(): number;
}

const SlotMachines = new Mongo.Collection<SlotMachine, SlotMachineWithHelpers>(
  'slotMachines',
);

SlotMachines.attachSchema(SlotMachineSchema);

export default SlotMachines;
export { SlotMachineWithHelpers };
