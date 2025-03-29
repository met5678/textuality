import { Meteor } from 'meteor/meteor';
import { DateTime } from 'luxon';

import Races from './races';
import Events from '/imports/api/events';
import Players from '/imports/api/players';
import { RaceId } from '/imports/schemas/derby/race';

Meteor.methods({
  'races.findCurrent': () => {
    return Races.findOne({
      event: Events.currentId()!,
      status: { $ne: 'future' },
    });
  },

  'races.findNext': () => {
    return Races.findOne(
      {
        event: Events.currentId()!,
        time_bets_start_at: { $gt: new Date() },
      },
      {
        sort: { time_bets_start_at: 1 },
        limit: 1,
      },
    );
  },

  'races.openBets': (raceId: RaceId) => {
    const race = Races.findOne(raceId);
    if (!race) return;

    Meteor.call('raceBets.clearBets', raceId);

    if (!race.scheduled) {
      const now = DateTime.local();
      Races.update(raceId, {
        $set: {
          status: 'bets-open',
          time_bets_start_at: now.toJSDate(),
          time_race_intro_starts_at: now.plus({ minutes: 5 }).toJSDate(),
          time_race_starts_at: now.plus({ minutes: 5, seconds: 30 }).toJSDate(),
        },
      });
    } else {
      Races.update(raceId, {
        $set: {
          status: 'bets-open',
        },
      });
    }

    if (race?.linked_mission && race?.linked_mission !== 'none') {
      Meteor.call('missions.start', { missionId: race.linked_mission });
    }
  },

  'races.startIntro': (raceId: RaceId) => {
    const race = Races.findOne(raceId);
    if (!race) return;

    Races.update(raceId, {
      $set: {
        status: 'race-intro',
      },
    });
  },

  'races.startRace': (raceId: RaceId) => {
    const race = Races.findOne(raceId);
    if (!race) return;

    Races.update(raceId, {
      $set: {
        status: 'race-in-progress',
      },
    });
  },

  'races.showPhotoFinish': (raceId: RaceId) => {
    const race = Races.findOne(raceId);
    if (!race) return;

    Races.update(raceId, {
      $set: {
        status: 'race-photo-finish',
      },
    });
  },

  'races.showResults': (raceId: RaceId) => {
    const race = Races.findOne(raceId);
    if (!race) return;

    Races.update(raceId, {
      $set: {
        status: 'race-results',
      },
    });

    Meteor.call('raceBets.doPayouts', raceId);
  },

  'races.showBetWinners': (raceId: RaceId) => {
    const race = Races.findOne(raceId);
    if (!race) return;

    Races.update(raceId, {
      $set: {
        status: 'race-bet-winners',
      },
    });
  },

  'races.reset': (raceId: RaceId) => {
    const race = Races.findOne(raceId);
    if (!race) return;

    Races.update(raceId, {
      $set: {
        status: 'future',
        timeline: {
          horses: {},
          events: {},
          current_frame: 0,
        },
      },
    });
  },
});
