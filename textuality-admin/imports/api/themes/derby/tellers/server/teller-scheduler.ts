import { Meteor } from 'meteor/meteor';

import Events from '/imports/api/events';
import { racesGetCurrent } from '../../race/methods/races.getCurrent';
import Tellers from '../tellers';
import {
  TELLER_FORTUNE_STATUSES,
  TELLER_OPEN_STATUSES,
  TELLER_TRANSITION_STATUS_TO_RESTING_STATUS,
  TELLER_VIDEO_LENGTHS,
} from '/imports/schemas/derby/teller-status/teller-status';
import { tellerClose } from '../teller-flow/teller-close';
import { tellerOpen } from '../teller-flow/teller-open';
import Races from '../../race';
import { DateTime } from 'luxon';
import { tellerSitDown } from '../teller-flow/teller-sitdown';
import { tellerStandup } from '../teller-flow/teller-standup';
import { fortuneTellerOpen } from '../fortune-teller-flow/teller.fortune.openTeller';
import { fortuneTellerClose } from '../fortune-teller-flow/teller.fortune.closeTeller';

const TELLER_MAX_OPEN_BETS_DELAY_SECONDS = 5;
const TELLER_MAX_CLOSE_BETS_DELAY_SECONDS = 3;

/* Before the bets open, the tellers need to sit down.
 * They will respect the video length, but this is to give
 * extra time so that their sitdowns are staggered.
 */
const TELLER_MAX_SITDOWN_PREDELAY_SECONDS = 10;

const TELLER_MAX_ANTICS_DELAY_SECONDS = 5;

const SEATED_TELLER_STANDUP_PROBABILITY = 0.2;
const STANDING_TELLER_SITDOWN_PROBABILITY = 0.1;

const ANTICS_INTERVAL_SECONDS = 10;

const FORTUNE_INTERVAL_SECONDS = 30;
const FORTUNE_TELLER_APPEAR_PROBABILITY = 1 / 2;
const FORTUNE_TELLER_VANISH_PROBABILITY = 1 / 6;

const openTellers = async () => {
  const tellers = await Tellers.find({
    event: Events.currentIdOrThrow(),
    unscheduled: false,
  }).fetch();

  for (const teller of tellers) {
    if (!TELLER_OPEN_STATUSES.includes(teller.status)) {
      const delay = Math.random() * TELLER_MAX_OPEN_BETS_DELAY_SECONDS;
      Meteor.setTimeout(() => {
        tellerOpen(teller._id);
      }, delay * 1000);
    }
  }
};

const closeTellers = async () => {
  const tellers = await Tellers.find({
    event: Events.currentIdOrThrow(),
    unscheduled: false,
  }).fetch();

  for (const teller of tellers) {
    if (TELLER_OPEN_STATUSES.includes(teller.status)) {
      const delay = Math.random() * TELLER_MAX_CLOSE_BETS_DELAY_SECONDS;
      Meteor.setTimeout(() => {
        tellerClose(teller._id);
      }, delay * 1000);
    }
  }
};

const sitDownTellers = async () => {
  const tellers = await Tellers.find({
    event: Events.currentIdOrThrow(),
    status: { $in: ['empty', 'standup'] },
    unscheduled: false,
  }).fetch();

  for (const teller of tellers) {
    const delay = Math.random() * TELLER_MAX_SITDOWN_PREDELAY_SECONDS;
    Meteor.setTimeout(() => {
      tellerSitDown(teller._id);
    }, delay * 1000);
  }
};

const closeFortuneTellers = async () => {
  const tellers = await Tellers.find({
    event: Events.currentIdOrThrow(),
    status: { $in: TELLER_FORTUNE_STATUSES },
  }).fetch();

  for (const teller of tellers) {
    fortuneTellerClose(teller._id);
  }
};

let setupOpenCloseTellersSubscription: Meteor.LiveQueryHandle | undefined;
const setupOpenCloseTellers = () => {
  if (setupOpenCloseTellersSubscription) {
    setupOpenCloseTellersSubscription.stop();
  }

  setupOpenCloseTellersSubscription = Races.find(
    {
      status: 'bets-open',
    },
    {
      fields: {
        status: 1,
      },
    },
  ).observe({
    added: () => {
      openTellers();
    },
    removed() {
      closeTellers();
    },
  });
};

let setupBreakAnticsInterval: number | undefined;
const setupBreakAntics = () => {
  if (setupBreakAnticsInterval) {
    Meteor.clearInterval(setupBreakAnticsInterval);
  }

  setupBreakAnticsInterval = Meteor.setInterval(async () => {
    const race = await racesGetCurrent({
      status: 1,
      scheduled: 1,
      time_bets_start_at: 1,
    });

    if (!race) {
      console.log('break antics: no race found');
      return;
    }

    const returnByTime = DateTime.fromJSDate(race?.time_bets_start_at!)
      .minus({
        seconds:
          (TELLER_VIDEO_LENGTHS.sitdown ?? 5) +
          TELLER_MAX_SITDOWN_PREDELAY_SECONDS +
          ANTICS_INTERVAL_SECONDS,
      })
      .toJSDate();

    if (race.status !== 'pre-bets') return;

    if (race.scheduled && Date.now() > returnByTime.getTime()) {
      console.log('returning tellers');
      sitDownTellers();
      return;
    }

    console.log('teller antics');

    const seatedTellers = await Tellers.find({
      event: Events.currentIdOrThrow(),
      status: 'break',
      unscheduled: false,
    }).fetch();

    for (const teller of seatedTellers) {
      if (Math.random() < SEATED_TELLER_STANDUP_PROBABILITY) {
        const delay = Math.random() * TELLER_MAX_ANTICS_DELAY_SECONDS;
        Meteor.setTimeout(() => {
          console.log('standing up teller', teller.url);
          tellerStandup(teller._id);
        }, delay * 1000);
      }
    }

    const standingTellers = await Tellers.find({
      event: Events.currentIdOrThrow(),
      status: 'empty',
      unscheduled: false,
    }).fetch();

    for (const teller of standingTellers) {
      if (Math.random() < STANDING_TELLER_SITDOWN_PROBABILITY) {
        const delay = Math.random() * TELLER_MAX_ANTICS_DELAY_SECONDS;
        Meteor.setTimeout(() => {
          console.log('sitting down teller', teller.url);
          tellerSitDown(teller._id);
        }, delay * 1000);
      }
    }
  }, ANTICS_INTERVAL_SECONDS * 1000);
};

let setupFortuneTellerInterval: number | undefined;
const setupFortuneTeller = () => {
  if (setupFortuneTellerInterval) {
    Meteor.clearInterval(setupFortuneTellerInterval);
  }

  setupFortuneTellerInterval = Meteor.setInterval(async () => {
    const race = await racesGetCurrent({
      status: 1,
      scheduled: 1,
      time_bets_start_at: 1,
      fortune_teller_available: 1,
    });

    if (!race) {
      console.log('fortune teller: no race found');
      return;
    }

    const fortuneTellerVanishBy = DateTime.fromJSDate(race?.time_bets_start_at!)
      .minus({
        seconds:
          (TELLER_VIDEO_LENGTHS.sitdown ?? 5) +
          TELLER_MAX_SITDOWN_PREDELAY_SECONDS +
          ANTICS_INTERVAL_SECONDS +
          (TELLER_VIDEO_LENGTHS['fortune-closing'] ?? 5) +
          FORTUNE_INTERVAL_SECONDS,
      })
      .toJSDate();

    if (race.status !== 'pre-bets') return;
    if (!race.fortune_teller_available) {
      console.log('fortune teller not available for this race');
      return;
    }

    if (race.scheduled && Date.now() > fortuneTellerVanishBy.getTime()) {
      console.log('closing fortune tellers');
      closeFortuneTellers();
      return;
    }

    console.log('checking for fortune tellers');

    const currentFortuneTellers = await Tellers.find({
      event: Events.currentIdOrThrow(),
      status: { $in: TELLER_FORTUNE_STATUSES },
    }).fetch();

    // If no fortune tellers and probability is met, open one
    if (currentFortuneTellers.length === 0) {
      if (Math.random() < FORTUNE_TELLER_APPEAR_PROBABILITY) {
        const emptyTellers = await Tellers.find({
          event: Events.currentIdOrThrow(),
          status: 'empty',
          unscheduled: false,
        }).fetch();

        if (emptyTellers.length > 0) {
          const teller =
            emptyTellers[Math.floor(Math.random() * emptyTellers.length)];
          console.log('opening fortune teller', teller.url);
          fortuneTellerOpen(teller._id);
        }
      }
    } else {
      if (Math.random() < FORTUNE_TELLER_VANISH_PROBABILITY) {
        const idleTellers = await Tellers.find({
          event: Events.currentIdOrThrow(),
          status: 'fortune-open',
        }).fetch();

        if (idleTellers.length > 0) {
          const teller =
            idleTellers[Math.floor(Math.random() * idleTellers.length)];
          console.log('closing fortune teller', teller.url);
          fortuneTellerClose(teller._id);
        }
      }
    }
  }, ANTICS_INTERVAL_SECONDS * 1000);
};

const resetStuckTellers = () => {
  const tellers = Tellers.find({
    event: Events.currentIdOrThrow(),
    unscheduled: false,
  }).fetch();

  for (const teller of tellers) {
    const restingStatus =
      TELLER_TRANSITION_STATUS_TO_RESTING_STATUS[teller.status];
    if (restingStatus !== teller.status) {
      Tellers.update(teller._id, {
        $set: { status: restingStatus },
      });
    }
  }
};

if (Meteor.isServer && Meteor.isProduction) {
  Meteor.startup(() => {
    if (!Events.current() || Events.current()?.theme !== 'derby') {
      return;
    }

    resetStuckTellers();
    setupOpenCloseTellers();
    setupBreakAntics();
    setupFortuneTeller();
  });
}
