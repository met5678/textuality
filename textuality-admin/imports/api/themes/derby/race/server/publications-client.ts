import { Meteor } from 'meteor/meteor';

import Races from '../races';
import Events from '/imports/api/events';
import reactiveDate from '/imports/utils/reactive-date';

Meteor.publish('races.currentOrNext', function () {
  this.autorun(() => {
    const now = reactiveDate.get();
    return Races.find(
      {
        event: Events.currentId()!,
        $or: [
          { status: { $ne: 'future' } },
          { scheduled: true, time_bets_start_at: { $gt: now } },
        ],
      },
      {
        sort: { time_bets_start_at: 1 },
        limit: 1,
        fields: {
          event: 1,
          horses: 1,
          scheduled: 1,
          time_bets_start_at: 1,
          time_race_intro_starts_at: 1,
          time_race_starts_at: 1,
          status: 1,
          timeline: 1,
          furlong_length: 1,
          weather: 1,
          linked_mission: 1,
        },
      },
    );
  });
});

Meteor.publish('races.upcoming', function () {
  this.autorun(() => {
    const now = reactiveDate.get();
    return Races.find(
      {
        event: Events.currentId()!,
        status: 'future',
        scheduled: true,
        time_bets_start_at: { $gt: now },
      },
      {
        sort: { time_bets_start_at: 1 },
        fields: {
          event: 1,
          horses: 1,
          time_bets_start_at: 1,
          status: 1,
          track_condition: 1,
        },
      },
    );
  });
});
