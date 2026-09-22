import { Meteor } from 'meteor/meteor';

import Races from '../races';
import Events from '/imports/api/events';
import { RaceId } from '/imports/schemas/derby/race';

Meteor.publish('races.currentOrNext', function () {
  this.autorun(() => {
    return Races.find(
      {
        event: Events.currentId()!,
        status: { $nin: ['future', 'inactive'] },
      },
      {
        sort: { time_bets_start_at: 1 },
        fields: {
          event: 1,
          number: 1,
          name: 1,
          horses: 1,
          scheduled: 1,
          time_bets_start_at: 1,
          time_race_starts_at: 1,
          status: 1,
          timeline: 1,
          furlong_length: 1,
          weather: 1,
          linked_mission: 1,
          odds: 1,
          results: 1,
        },
      },
    );
  });
});

// Just lacking the timeline
Meteor.publish('races.currentOrNextLite', function (raceId: RaceId) {
  this.autorun(() => {
    return Races.find(
      {
        event: Events.currentId()!,
        status: { $nin: ['future', 'inactive'] },
      },
      {
        sort: { time_bets_start_at: 1 },
        fields: {
          event: 1,
          number: 1,
          name: 1,
          horses: 1,
          scheduled: 1,
          time_bets_start_at: 1,
          time_race_starts_at: 1,
          status: 1,
          furlong_length: 1,
          weather: 1,
          linked_mission: 1,
          odds: 1,
          results: 1,
        },
      },
    );
  });
});
