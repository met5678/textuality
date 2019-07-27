import { Meteor } from 'meteor/meteor';

import Seasons from '../';

Meteor.publish('seasons.current', function() {
  this.autorun(() => {
    const curSeason = Seasons.current();

    console.log(curSeason);

    if (curSeason) {
      return Seasons.find(curSeason._id);
    } else {
      return this.ready();
    }
  });
});
