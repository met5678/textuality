import { Meteor } from 'meteor/meteor';

import SlotMachines from './slotMachines';

Meteor.methods({
  'slotMachines.new': (slotMachine) => {
    const id = SlotMachines.insert(slotMachine);
    return id;
  },

  'slotMachines.update': (slotMachine) => {
    SlotMachines.update(slotMachine._id, { $set: slotMachine });
  },

  'slotMachines.duplicate': (slotMachineId) => {
    const slotToDuplicate = SlotMachines.findOne(slotMachineId);
    if (!slotToDuplicate) return;
    const duplicatedSlot = { ...slotToDuplicate };
    delete duplicatedSlot._id;
    SlotMachines.insert(duplicatedSlot);
  },

  'slotMachines.delete': (slotMachineId) => {
    if (Array.isArray(slotMachineId)) {
      SlotMachines.remove({ _id: { $in: slotMachineId } });
    } else {
      SlotMachines.remove(slotMachineId);
    }
  },
});
