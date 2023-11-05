import { Mongo } from 'meteor/mongo';

import { SlotMachine, SlotMachineSchema } from '/imports/schemas/slotMachine';

const SlotMachines = new Mongo.Collection<SlotMachine>('slotMachines');

SlotMachines.attachSchema(SlotMachineSchema);

export default SlotMachines;
