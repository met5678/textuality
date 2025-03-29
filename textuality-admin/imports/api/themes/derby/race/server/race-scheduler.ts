import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { DateTime } from 'luxon';

import Races, { RaceWithHelpers } from '../races';
import Events from '/imports/api/events';
import reactiveDate from '/imports/utils/reactive-date';
import { RaceStatus } from '/imports/schemas/derby/race';

const INTRO_DWELL_SECONDS = 30;
const RACE_DWELL_SECONDS = 60;
const PHOTO_FINISH_DWELL_SECONDS = 10;
const RESULTS_DWELL_SECONDS = 20;
const BET_WINNERS_DWELL_SECONDS = 30;

const getExpectedStatus = (race: RaceWithHelpers, now: Date): RaceStatus => {
  if (now <= race.time_bets_start_at!) return 'future';
  if (now <= race.time_race_intro_starts_at!) return 'bets-open';
  if (now <= race.time_race_starts_at!) return 'race-intro';

  const raceStartTime = DateTime.fromJSDate(race.time_race_starts_at!);

  if (now <= raceStartTime.plus({ seconds: RACE_DWELL_SECONDS }).toJSDate())
    return 'race-in-progress';

  if (
    now <=
    raceStartTime
      .plus({ seconds: RACE_DWELL_SECONDS + PHOTO_FINISH_DWELL_SECONDS })
      .toJSDate()
  )
    return 'race-photo-finish';

  if (
    now <=
    raceStartTime
      .plus({
        seconds:
          RACE_DWELL_SECONDS +
          PHOTO_FINISH_DWELL_SECONDS +
          RESULTS_DWELL_SECONDS,
      })
      .toJSDate()
  )
    return 'race-results';

  if (
    now <=
    raceStartTime
      .plus({
        seconds:
          RACE_DWELL_SECONDS +
          PHOTO_FINISH_DWELL_SECONDS +
          RESULTS_DWELL_SECONDS +
          BET_WINNERS_DWELL_SECONDS,
      })
      .toJSDate()
  )
    return 'race-bet-winners';

  return 'future';
};

if (Meteor.isServer && Meteor.isProduction) {
  Meteor.startup(() => {
    Tracker.autorun(() => {
      const now = reactiveDate.get();

      const eventRaces = Races.find({
        event: Events.currentId()!,
        scheduled: true,
      }).fetch();

      eventRaces.forEach((race) => {
        const expectedStatus = getExpectedStatus(race, now);

        if (race.status !== expectedStatus) {
          console.log(
            `Updating race ${race._id} from ${race.status} to ${expectedStatus}`,
          );

          if (expectedStatus === 'bets-open') {
            Meteor.call('races.openBets', race._id);
          }

          if (expectedStatus === 'race-intro') {
            Meteor.call('races.startIntro', race._id);
          }

          if (expectedStatus === 'race-in-progress') {
            Meteor.call('races.startRace', race._id);
          }

          if (expectedStatus === 'race-photo-finish') {
            Meteor.call('races.showPhotoFinish', race._id);
          }

          if (expectedStatus === 'race-results') {
            Meteor.call('races.showResults', race._id);
          }

          if (expectedStatus === 'race-bet-winners') {
            Meteor.call('races.showBetWinners', race._id);
          }

          if (expectedStatus === 'future') {
            Meteor.call('races.reset', race._id);
          }
        }
      });
    });
  });
}

export {
  INTRO_DWELL_SECONDS,
  RACE_DWELL_SECONDS,
  PHOTO_FINISH_DWELL_SECONDS,
  RESULTS_DWELL_SECONDS,
  BET_WINNERS_DWELL_SECONDS,
};
