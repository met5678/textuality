import { Meteor } from 'meteor/meteor';
import Powerups from '../powerups';
import Events from '/imports/api/events';
import getPaginatedCursor from '/imports/api/_utils/publish-paginated';

Meteor.publish('derby.powerups.all', function () {
  this.autorun(() => Powerups.find({ event: Events.currentId() }));
});

Meteor.publish(
  'derby.powerups.paged',
  getPaginatedCursor(Powerups, {
    getServerQuery: () => ({
      event: Events.currentId(),
    }),
  }),
);
