import { Meteor } from 'meteor/meteor';

import Events from 'api/events';
import Players from 'api/players';
import Rounds from './rounds';

function getEligiblePlayers() {
  return Players.find({ event: Events.currentId(), status: 'active' }).fetch();
}

let currentTimeout = null;

const waitForSeconds = (seconds) => {
  return new Promise((resolve) =>
    Meteor.setTimeout(() => resolve(), seconds * 1000)
  );
};

Meteor.methods({
  'rounds.start': ({ roundId }) => {
    Rounds.find({ _id: { $ne: roundId } }).forEach((round) =>
      Meteor.call('rounds.abort', { roundId: round._id })
    );
    Rounds.update(roundId, {
      $set: { active: true, status: 'active', timeStart: new Date() },
      $unset: { timeEnd: 1 },
    });

    const eligiblePlayers = getEligiblePlayers();

    eligiblePlayers.forEach((player) => {
      Meteor.call('autoTexts.send', {
        trigger: 'ROUND_BEGIN',
        playerId: player._id,
      });
    });
  },

  'rounds.startCountdown': ({ roundId, duration = 5 * 60 }) => {
    Rounds.update(roundId, {
      $set: {
        status: 'countdown',
        timeEnd: new Date(Date.now() + 1000 * duration),
      },
    });

    const eligiblePlayers = getEligiblePlayers();

    eligiblePlayers.forEach((player) => {
      Meteor.call('autoTexts.send', {
        trigger: 'ROUND_COUNTDOWN',
        playerId: player._id,
        templateVars: {
          mins: Math.floor(duration / 60),
          secs: Math.floor(duration % 60),
        },
      });
    });

    if (currentTimeout) Meteor.clearTimeout(currentTimeout);
    currentTimeout = Meteor.setTimeout(
      () => Meteor.call('rounds.startRevealSequence', { roundId }),
      duration * 1000
    );
  },

  'rounds.startRevealSequence': async ({ roundId }) => {
    const players = getEligiblePlayers();

    players.forEach((player) => {
      Meteor.call('autoTexts.send', {
        trigger: 'ROUND_REVEAL_START',
        playerId: player._id,
      });
    });

    await waitForSeconds(5);

    players.forEach((player) =>
      Meteor.call('autoTexts.sendCustom', {
        playerText: 'Waited 5 seconds',
        playerId: player._id,
      })
    );

    // Cycle through all rooms with votes
    // Reveal Room
    // Cycle through all murderers with votes
    // Reveal murderer
    // Cycle through all weapons with votes
    // Reveal weapon
    // Send ROUND_REVEAL_RESULT_N_CLUES autoText
    // Show top players

    // Set round to complete and inactive
    Rounds.update(roundId, { $set: { active: false, status: 'completed' } });
  },

  'rounds.abort': ({ roundId }) => {
    if (currentTimeout) Meteor.clearTimeout(currentTimeout);
    Rounds.update(roundId, { $set: { active: false, status: 'aborted' } });
  },
});
