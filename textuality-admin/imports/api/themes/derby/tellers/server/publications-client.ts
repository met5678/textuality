import { Meteor } from 'meteor/meteor';

import Tellers from '../tellers';
import Events from '/imports/api/events';

Meteor.publish('derby.tellers.forUrl', function (url: string) {
  this.autorun(() => Tellers.find({ event: Events.currentId(), url }));
});
