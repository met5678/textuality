import { Meteor } from 'meteor/meteor';
import reactiveDate from '/imports/utils/reactive-date';
import { Tracker } from 'meteor/tracker';
import Events from '/imports/api/events';
import Roulettes, { RouletteWithHelpers } from '../roulettes';
import { DateTime } from 'luxon';
import { RouletteStatus } from '/imports/schemas/roulette';
import { rouletteOpenBets } from '../methods/roulettes.openBets';
import { rouletteStartSpin } from '../methods/roulettes.startSpin';
import { rouletteFinishSpin } from '../methods/roulettes.finishSpin';
import { rouletteRevealWinners } from '../methods/roulettes.revealWinners';
import { rouletteDeactivate } from '../methods/roulettes.deactivateRoulette';
import { rouletteCloseBets } from '../methods/roulettes.closeBets';

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

if (
  Meteor.isServer &&
  // Prevent running the scheduler when we're doing local dev on prod data
  // since the prod server will be trying to run it simultaneously
  (process.env.DB_ENV === 'local' || Meteor.isProduction)
) {
  Meteor.startup(() => {
    Tracker.autorun(() => {
      const now = reactiveDate.get();

      const eventRoulettes = Roulettes.find({
        event: Events.currentId()!,
        scheduled: true,
      }).fetch();

      eventRoulettes.forEach(async (roulette) => {
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
            await rouletteOpenBets(roulette._id);
          }

          if (expectedStatus === 'spinning') {
            await rouletteStartSpin(roulette._id);
          }

          if (expectedStatus === 'end-spin') {
            await rouletteFinishSpin(roulette._id);
          }

          if (expectedStatus === 'winners-board') {
            await rouletteRevealWinners(roulette._id);
          }

          if (expectedStatus === 'inactive') {
            await rouletteDeactivate(roulette._id);
          }
        }

        if (roulette.bets_open && !expectedBetsOpen) {
          console.log(`Closing bets for ${roulette._id}`);
          await rouletteCloseBets(roulette._id);
        }
      });
    });
  });
}

export { SPIN_END_DWELL_SECONDS, WINNERBOARD_DWELL_SECONDS };
