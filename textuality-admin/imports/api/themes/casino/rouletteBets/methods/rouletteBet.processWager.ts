import { RouletteWithHelpers } from '../../roulettes/roulettes';
import RouletteBets, { RouletteBetWithHelpers } from '../rouletteBets';
import { rouletteBetPlaceBet } from './rouletteBet.placeBet';
import { tryUnlockAchievement } from '/imports/api/achievements/methods-client/achievements.tryUnlock';
import { sendAutoText } from '/imports/api/autoTexts/methods/autoTexts.send';
import { PlayerWithHelpers } from '/imports/api/players/players';

type ProcessWagerArgs = {
  player: PlayerWithHelpers;
  rouletteBet: RouletteBetWithHelpers;
  roulette: RouletteWithHelpers;
  value: string;
};

export const rouletteBetProcessWager = async ({
  player,
  rouletteBet,
  roulette,
  value,
}: ProcessWagerArgs) => {
  let wager = -1;

  if (value === 'all') {
    wager = player.money;
  } else {
    wager = parseInt(value.trim());
    if (isNaN(wager)) {
      sendAutoText({
        playerId: player._id,
        trigger: 'ROULETTE_BET_ASK_WAGER_INVALID',
      });
      return;
    }

    if (wager === 0) {
      sendAutoText({
        playerId: player._id,
        trigger: 'ROULETTE_BET_ASK_WAGER_ZERO',
      });
      return;
    }

    if (wager > player.money) {
      sendAutoText({
        playerId: player._id,
        trigger: 'ROULETTE_BET_ASK_WAGER_TOO_POOR',
        templateVars: {
          bet_wager: wager,
        },
      });
      return;
    }

    // If somebody tries a negative wager, give them a reward
    // the first time. Subsequent times it's just a cute error.
    // In either case, it won't be accepted and they need to
    // do a valid one.
    if (wager < 0) {
      const firstTime = await tryUnlockAchievement({
        playerId: player._id,
        trigger: 'ROULETTE_NEGATIVE_WAGER',
      });
      if (!firstTime) {
        sendAutoText({
          playerId: player._id,
          trigger: 'ROULETTE_BET_ASK_WAGER_NEGATIVE',
        });
      }
      return;
    }
  }

  await RouletteBets.updateAsync(rouletteBet._id, {
    $set: {
      wager,
    },
  });
  rouletteBet.wager = wager;

  await rouletteBetPlaceBet({
    player,
    rouletteBet,
    roulette,
  });
};
