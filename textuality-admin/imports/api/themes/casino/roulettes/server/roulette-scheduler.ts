import { Meteor } from 'meteor/meteor';
import reactiveDate from '/imports/utils/reactive-date';
import { Tracker } from 'meteor/tracker';
import Events from '/imports/api/events';
import Roulettes, { RouletteWithHelpers } from '../roulettes';
import { DateTime } from 'luxon';
import { RouletteStatus } from '/imports/schemas/roulette';

const SPIN_END_DWELL_SECONDS = 5;
const WINNERBOARD_DWELL_SECONDS = 36;

const getExpectedStatus = (
  roulette: RouletteWithHelpers,
  now: Date,
): RouletteStatus => {
  if (now <= roulette.bets_start_at!) return 'inactive';
  if (now <= roulette.spin_starts_at!) return 'pre-spin';
  if (
    now <=
    DateTime.fromJSDate(roulette.spin_starts_at!)
      .plus({ seconds: roulette.spin_seconds })
      .toJSDate()
  )
    return 'spinning';
  if (
    now <=
    DateTime.fromJSDate(roulette.spin_starts_at!)
      .plus({ seconds: roulette.spin_seconds + SPIN_END_DWELL_SECONDS })
      .toJSDate()
  )
    return 'end-spin';
  if (
    now <=
    DateTime.fromJSDate(roulette.spin_starts_at!)
      .plus({
        seconds:
          roulette.spin_seconds +
          SPIN_END_DWELL_SECONDS +
          WINNERBOARD_DWELL_SECONDS,
      })
      .toJSDate()
  )
    return 'winners-board';
  return 'inactive';
};

const getExpectedBetsOpen = (
  roulette: RouletteWithHelpers,
  now: Date,
  status: RouletteStatus,
): boolean => {
  if (status === 'pre-spin') return true;
  if (
    status === 'spinning' &&
    now <
      DateTime.fromJSDate(roulette.spin_starts_at!)
        .plus({ seconds: roulette.spin_seconds - roulette.bets_cutoff_seconds })
        .toJSDate()
  )
    return true;

  return false;
};

if (Meteor.isServer && Meteor.isProduction) {
  Meteor.startup(() => {
    Tracker.autorun(() => {
      const now = reactiveDate.get();

      const eventRoulettes = Roulettes.find({
        event: Events.currentId()!,
        scheduled: true,
      }).fetch();

      eventRoulettes.forEach((roulette) => {
        const expectedStatus = getExpectedStatus(roulette, now);
        const expectedBetsOpen = getExpectedBetsOpen(
          roulette,
          now,
          expectedStatus,
        );

        if (roulette.status !== expectedStatus) {
          console.log(
            `Updating roulette ${roulette._id} from ${roulette.status} to ${expectedStatus}`,
          );

          if (expectedStatus === 'pre-spin') {
            Meteor.call('roulettes.openBets', roulette._id);
          }

          if (expectedStatus === 'spinning') {
            Meteor.call('roulettes.startSpin', roulette._id);
          }

          if (expectedStatus === 'end-spin') {
            Meteor.call('roulettes.finishSpin', roulette._id);
          }

          if (expectedStatus === 'winners-board') {
            Meteor.call('roulettes.revealWinners', roulette._id);
          }

          if (expectedStatus === 'inactive') {
            Meteor.call('roulettes.deactivateRoulette', roulette._id);
          }
        }

        if (roulette.bets_open && !expectedBetsOpen) {
          console.log(`Closing bets for ${roulette._id}`);
          Meteor.call('roulettes.closeBets', roulette._id);
        }
      });
    });
  });
}

export { SPIN_END_DWELL_SECONDS, WINNERBOARD_DWELL_SECONDS };
