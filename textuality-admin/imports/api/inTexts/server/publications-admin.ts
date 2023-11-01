import { Meteor } from 'meteor/meteor';

import InTexts from '..';
import Events from '/imports/api/events';
import getPaginatedCursor from '../../_utils/publish-paginated';

Meteor.publish('inTexts.all', function () {
  this.autorun(() => InTexts.find({ event: Events.currentId()! }));
});

Meteor.publish('inTexts.paged', getPaginatedCursor(InTexts));
