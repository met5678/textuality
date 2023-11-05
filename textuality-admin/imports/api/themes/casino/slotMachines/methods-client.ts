import { Meteor } from 'meteor/meteor';

import SlotMachines from './slotMachines';

// Once a spin starts, it'll need to go through a process:
//

Meteor.methods({
  'slotMachines.spinRequest': (playerId: string, inTextId: string) => {
    // First, see if the message matches a slot machine name
    // If not, send a SLOT_NAME_INVALID message
  },
});
