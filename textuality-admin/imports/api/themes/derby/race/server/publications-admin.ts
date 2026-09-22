import { Meteor } from 'meteor/meteor';

import Races from '../races';
import Events from '/imports/api/events';

Meteor.publish('derby.races.all', function () {
  this.autorun(() => Races.find({ event: Events.currentId() }));
});

Meteor.publish('derby.races.basic', function () {
  this.autorun(() =>
    Races.find(
      { event: Events.currentId() },
      { fields: { event: 1, number: 1, status: 1, name: 1 } },
    ),
  );
});
