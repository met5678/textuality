import { Meteor } from 'meteor/meteor';
import Players from '../../players';
import Events from '../events';
import RaceBets from '../../themes/derby/raceBets';
import { condenseRaceBets } from '../../themes/derby/raceBets/helpers';
import Fortunes from '../../themes/derby/fortunes';
import { cancelAndDeleteTimeout, TimeoutError } from './_finale-timeout';
import { throwIfCancelledTimeout } from './_finale-timeout';

const getEligiblePlayers = async () => {
  return Players.find({
    event: Events.currentId(),
    status: 'active',
  }).fetchAsync();
};

export const DERBY_FINALE_SLIDE_DURATION_SECONDS = 11;

Meteor.methods({
  'finale.derby.start': async (eventId) => {
    const event = Events.findOneAsync(eventId);
    if (!event) return;

    Events.updateAsync(eventId, {
      $set: { state: 'finale', 'finale_data.phase': 'finale-intro' },
    });

    try {
      await throwIfCancelledTimeout(
        eventId,
        DERBY_FINALE_SLIDE_DURATION_SECONDS,
      );
    } catch (error) {
      if (error === TimeoutError) return;
      throw error;
    }

    // Get the 3 players with the most money
    const playersWithMostMoney = await Players.find(
      { event: Events.currentId() },
      { sort: { money: -1 }, limit: 3 },
    ).fetchAsync();

    Events.updateAsync(eventId, {
      $set: {
        'finale_data.phase': 'biggest-wallets',
        'finale_data.players': playersWithMostMoney.map((player) => ({
          player: player._id,
          money: player.money,
        })),
      },
    });

    try {
      await throwIfCancelledTimeout(
        eventId,
        DERBY_FINALE_SLIDE_DURATION_SECONDS,
      );
    } catch (error) {
      if (error === TimeoutError) return;
      throw error;
    }

    // Get the 3 highest payouts from races
    const allWinBets = await RaceBets.find({
      event: Events.currentId(),
      status: 'won',
    }).fetchAsync();
    const condensedWinningBets = condenseRaceBets(allWinBets);
    const highestPayouts = condensedWinningBets
      .sort((a, b) => b.payout! - a.payout!)
      .slice(0, 3);

    Events.updateAsync(eventId, {
      $set: {
        'finale_data.phase': 'biggest-bet-winners',
        'finale_data.players': highestPayouts.map((payout) => ({
          player: payout.player,
          payout: payout.payout,
          horses: payout.horses,
          type: payout.type,
          wager: payout.totalWager(),
        })),
      },
    });

    try {
      await throwIfCancelledTimeout(
        eventId,
        DERBY_FINALE_SLIDE_DURATION_SECONDS,
      );
    } catch (error) {
      if (error === TimeoutError) return;
      throw error;
    }

    // Get the 3 biggest loses from races
    const allLoseBets = await RaceBets.find({
      event: Events.currentId(),
      status: 'lost',
    }).fetchAsync();
    const condensedLosingBets = condenseRaceBets(allLoseBets);
    const biggestLosses = condensedLosingBets
      .sort((a, b) => a.payout! - b.payout!)
      .slice(0, 3);

    Events.updateAsync(eventId, {
      $set: {
        'finale_data.phase': 'biggest-bet-losers',
        'finale_data.players': biggestLosses.map((loss) => ({
          player: loss.player,
          horses: loss.horses,
          type: loss.type,
          wager: loss.totalWager(),
        })),
      },
    });

    try {
      await throwIfCancelledTimeout(
        eventId,
        DERBY_FINALE_SLIDE_DURATION_SECONDS,
      );
    } catch (error) {
      if (error === TimeoutError) return;
      throw error;
    }

    // Get the 3 players with the most checkpoints
    const playersWithCheckpoints = await Players.find(
      { event: Events.currentId() },
      { fields: { checkpoints: 1, alias: 1, avatar: 1 } },
    ).fetchAsync();
    const playersWithMostCheckpoints = playersWithCheckpoints
      .sort((a, b) => b.checkpoints.length - a.checkpoints.length)
      .slice(0, 3);
    Events.updateAsync(eventId, {
      $set: {
        'finale_data.phase': 'most-hashtags',
        'finale_data.players': playersWithMostCheckpoints.map((player) => ({
          player: player._id,
          hashtags: player.checkpoints.length,
        })),
      },
    });

    try {
      await throwIfCancelledTimeout(
        eventId,
        DERBY_FINALE_SLIDE_DURATION_SECONDS,
      );
    } catch (error) {
      if (error === TimeoutError) return;
      throw error;
    }

    // Get the 3 players who got the most fortuned
    const allFortunes = await Fortunes.find(
      { event: Events.currentId(), status: 'given' },
      { fields: { player: 1 } },
    ).fetchAsync();
    const fortuneCountsByPlayer = allFortunes.reduce(
      (acc, fortune) => {
        acc[fortune.player] = (acc[fortune.player] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
    const playersWithMostFortunes = Object.entries(fortuneCountsByPlayer)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    Events.updateAsync(eventId, {
      $set: {
        'finale_data.phase': 'most-fortunes',
        'finale_data.players': playersWithMostFortunes.map((player) => ({
          player: player[0],
          fortunes: player[1],
        })),
      },
    });

    try {
      await throwIfCancelledTimeout(
        eventId,
        DERBY_FINALE_SLIDE_DURATION_SECONDS,
      );
    } catch (error) {
      if (error === TimeoutError) return;
      throw error;
    }

    Events.updateAsync(eventId, { $set: { 'finale_data.phase': 'horses' } });
  },

  'finale.derby.cancel': async (eventId) => {
    Events.updateAsync(eventId, { $set: { state: 'normal' } });
    cancelAndDeleteTimeout(eventId);
  },
});
