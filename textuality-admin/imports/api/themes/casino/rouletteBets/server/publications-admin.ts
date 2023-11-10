import { Meteor } from 'meteor/meteor';

import RouletteBets from '..';
import Events from '/imports/api/events';

Meteor.publish('missionPairings.all', function () {
  this.autorun(() => RouletteBets.find({ event: Events.currentId()! }));
});

Meteor.publish('missionPairings.forRoulette', function (roulette_id) {
  this.autorun(() =>
    RouletteBets.find({ event: Events.currentId()!, roulette_id }),
  );
});
