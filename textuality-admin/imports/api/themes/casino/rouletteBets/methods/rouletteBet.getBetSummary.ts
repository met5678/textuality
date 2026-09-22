import commaNumber from 'comma-number';
import { RouletteWithHelpers } from '../../roulettes/roulettes';
import RouletteBets from '../rouletteBets';
import { PlayerWithHelpers } from '/imports/api/players/players';
import { isRouletteBetSlotSpecial } from '/imports/schemas/rouletteBet';

type GetRouletteBetSummaryArgs = {
  player: PlayerWithHelpers;
  roulette: RouletteWithHelpers;
};

export const getRouletteBetSummary = async ({
  player,
  roulette,
}: GetRouletteBetSummaryArgs) => {
  const placedBets = await RouletteBets.find({
    'player.id': player._id,
    roulette_id: roulette._id,
    status: 'placed',
  }).fetchAsync();

  const numberBets = placedBets.filter(
    (bet) => typeof bet.bet_slot === 'number',
  );
  const specialBets = placedBets.filter(
    (bet) =>
      typeof bet.bet_slot === 'string' &&
      isRouletteBetSlotSpecial(bet.bet_slot),
  );

  const lines = [];

  for (const bet of numberBets) {
    if (bet.wager) {
      lines.push(`${commaNumber(bet.wager)} BB on ${bet.bet_slot}`);
    }
  }
  for (const bet of specialBets) {
    if (
      bet.wager &&
      typeof bet.bet_slot === 'string' &&
      isRouletteBetSlotSpecial(bet.bet_slot)
    ) {
      lines.push(
        `${commaNumber(bet.wager)} BB on ${bet.bet_slot.toUpperCase()}`,
      );
    }
  }

  return lines.join('\n');
};
