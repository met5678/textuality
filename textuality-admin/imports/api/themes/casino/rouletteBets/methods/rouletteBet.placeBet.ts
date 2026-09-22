import { PlayerWithHelpers } from '/imports/api/players/players';
import { sendAutoText } from '/imports/api/autoTexts/methods/autoTexts.send';
import RouletteBets, { RouletteBetWithHelpers } from '../rouletteBets';
import { RouletteWithHelpers } from '../../roulettes/roulettes';
import {
  isRouletteBetSlotSpecial,
  RouletteBet,
  RouletteBetComplete,
} from '/imports/schemas/rouletteBet';
import { playerTakeMoney } from '/imports/api/players/methods/players.takeMoney';
import { getRouletteBetSummary } from './rouletteBet.getBetSummary';

type PlaceRouletteBetArgs = {
  player: PlayerWithHelpers;
  rouletteBet: RouletteBetWithHelpers;
  roulette: RouletteWithHelpers;
};

const validateRouletteBet = (
  rouletteBet: RouletteBet,
): rouletteBet is RouletteBetComplete => {
  return (
    typeof rouletteBet.wager === 'number' &&
    typeof rouletteBet.bet_slot !== 'undefined' &&
    (typeof rouletteBet.bet_slot === 'number' ||
      isRouletteBetSlotSpecial(rouletteBet.bet_slot))
  );
};

export const rouletteBetPlaceBet = async ({
  player,
  rouletteBet,
  roulette,
}: PlaceRouletteBetArgs) => {
  await RouletteBets.updateAsync(rouletteBet._id, {
    $set: {
      status: 'placed',
      placed_at: new Date(),
      step: 'done',
    },
  });

  rouletteBet.status = 'placed';
  rouletteBet.placed_at = new Date();
  rouletteBet.step = 'done';

  if (!validateRouletteBet(rouletteBet)) {
    throw new Error('Invalid roulette bet');
  }

  playerTakeMoney({
    playerId: player._id,
    money: rouletteBet.wager,
  });

  sendAutoText({
    trigger: 'ROULETTE_BET_PLACED',
    playerId: player._id,
    interactivePayload: {
      type: 'buttons',
      options: [
        {
          label: 'Bet Again',
          value: `rouletteBet/${rouletteBet._id}/again`,
        },
      ],
    },
    templateVars: {
      bet_slot: rouletteBet.bet_slot,
      wager: rouletteBet.wager,
      bet_summary: await getRouletteBetSummary({
        player,
        roulette,
      }),
    },
  });
};
