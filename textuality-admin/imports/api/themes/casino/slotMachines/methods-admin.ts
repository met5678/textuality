import { Meteor } from 'meteor/meteor';

import SlotMachines from './slotMachines';
import Events from '/imports/api/events';

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

  'slotMachines.resetMachine': (slot_id) => {
    SlotMachines.update(slot_id, {
      $set: {
        status: 'available',
      },
      $unset: {
        player: 1,
        result: 1,
        win_amount: 1,
      },
    });
  },

  'slotMachines.resetEvent': (event_id) => {
    SlotMachines.update(
      { event: event_id },
      {
        $set: {
          status: 'available',
          stats: {
            profit: 0,
            spin_count: 0,
          },
        },
        $unset: {
          player: 1,
          result: 1,
          win_amount: 1,
        },
      },
      { multi: true },
    );
  },

  'slotMachines.copyOddsToAll': (odds) => {
    SlotMachines.update(
      { event: Events.currentId()! },
      {
        $set: {
          odds,
        },
      },
      { multi: true },
    );
  },
});
