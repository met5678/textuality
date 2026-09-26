import { DateTime } from 'luxon';
import { sendAutoText } from '/imports/api/autoTexts/methods/autoTexts.send';
import { PlayerWithHelpers } from '/imports/api/players/players';
import RouletteBets from '/imports/api/themes/casino/rouletteBets';
import { rouletteBetAskType } from '/imports/api/themes/casino/rouletteBets/methods/rouletteBet.askType';
import { getPendingRouletteBet } from '/imports/api/themes/casino/rouletteBets/methods/rouletteBet.getPendingBet';
import { rouletteBetStartBet } from '/imports/api/themes/casino/rouletteBets/methods/rouletteBet.startBet';
import { roulettesFindCurrent } from '/imports/api/themes/casino/roulettes/methods/roulettes.findCurrent';
import { roulettesFindNext } from '/imports/api/themes/casino/roulettes/methods/roulettes.findNext';

export const processRouletteText = async (player: PlayerWithHelpers) => {
  const curRoulette = await roulettesFindCurrent();
  if (!curRoulette) {
    const nextRoulette = await roulettesFindNext();
    if (nextRoulette && nextRoulette.bets_start_at) {
      sendAutoText({
        trigger: 'ROULETTE_NOT_YET_ACCEPTING',
        playerId: player._id,
        templateVars: {
          bets_start_at: DateTime.fromJSDate(
            nextRoulette.bets_start_at,
          ).toLocaleString(DateTime.TIME_SIMPLE),
          spin_starts_at: DateTime.fromJSDate(
            nextRoulette.spin_starts_at!,
          ).toLocaleString(DateTime.TIME_SIMPLE),
        },
      });
    } else {
      sendAutoText({
        trigger: 'ROULETTE_NO_MORE',
        playerId: player._id,
      });
    }
    return;
  }
  if (!curRoulette?.bets_open) {
    sendAutoText({
      trigger: 'ROULETTE_BET_TOO_LATE',
      playerId: player._id,
    });
    return;
  }
  if (player.money <= 0) {
    sendAutoText({
      trigger: 'ROULETTE_BET_TOO_POOR',
      playerId: player._id,
    });
    return;
  }

  const pendingBet = await getPendingRouletteBet({
    player,
    rouletteId: curRoulette._id,
  });
  if (pendingBet) {
    console.log("Found pending bet, resetting step to 'type'");
    await RouletteBets.updateAsync(pendingBet._id, {
      $set: {
        step: 'type',
        time: new Date(),
      },
      $unset: {
        bet_slot: '',
        wager: '',
        placed_at: '',
      },
    });
    const rouletteBet = await RouletteBets.findOneAsync(pendingBet._id);
    rouletteBetAskType({
      player,
      rouletteBet: rouletteBet!,
    }); // Start a roulette betting session for the player
  } else {
    const rouletteBetId = await rouletteBetStartBet({
      player_id: player._id,
      roulette_id: curRoulette._id,
    });
    const rouletteBet = await RouletteBets.findOneAsync(rouletteBetId);
    if (!rouletteBet) {
      throw new Error('Failed to start roulette bet');
    }

    rouletteBetAskType({ player, rouletteBet }); // Start a roulette betting session for the player
  }
};
