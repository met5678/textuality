import { Meteor } from 'meteor/meteor';

import SlotMachines from '../slotMachines';
import Events from '/imports/api/events';

Meteor.publish('slotMachines.all', function () {
  this.autorun(() => SlotMachines.find({ event: Events.currentId()! }));
});
