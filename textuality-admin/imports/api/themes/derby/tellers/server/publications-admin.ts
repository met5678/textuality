import { Meteor } from 'meteor/meteor';

import Tellers from '../tellers';
import Events from '/imports/api/events';

Meteor.publish('derby.tellers.all', function () {
  this.autorun(() => Tellers.find({ event: Events.currentId() }));
});

Meteor.publish('derby.tellers.basic', function () {
  this.autorun(() =>
    Tellers.find({ event: Events.currentId() }, { fields: { _id: 1, url: 1 } }),
  );
});
