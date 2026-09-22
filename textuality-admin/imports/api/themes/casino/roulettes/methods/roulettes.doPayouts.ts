import commaNumber from 'comma-number';
import Roulettes from '../../roulettes';
import { RouletteWithHelpers } from '../../roulettes/roulettes';
import Events from '/imports/api/events';
import { RouletteId } from '/imports/schemas/roulette';
import { RouletteBetSlot } from '/imports/schemas/rouletteBet';
import { getWrappedServerMethod } from '/imports/utils/get-wrapped-server-method';
import { playerGiveMoney } from '/imports/api/players/methods/players.giveMoney';
import { PlayerId } from '/imports/schemas/player';
import { sendAutoText } from '/imports/api/autoTexts/methods/autoTexts.send';
import RouletteBets from '../../rouletteBets';
import { RouletteBetWithHelpers } from '../../rouletteBets/rouletteBets';
import { getWinningSpecialBets } from './roulettes.getWinningSpecialBets';

const CURRENCY = 'BB';

const processBetsForPlayer = (
  playerId: string,
  playerBets: RouletteBetWithHelpers[],
  specialSlots: RouletteBetSlot[],
  roulette: RouletteWithHelpers,
) => {
  const playerWinningBets = playerBets.filter((bet) => {
    if (String(bet.bet_slot) === String(roulette.result)) return true;
    if (specialSlots.includes(bet.bet_slot!)) return true;
    return false;
  });

  if (!playerWinningBets.length) {
    const totalSpent = playerBets.reduce((total, bet) => total + bet.wager!, 0);
    sendAutoText({
      playerId,
      trigger: 'ROULETTE_LOSE',
      templateVars: {
        number: roulette.result,
        money_lost: totalSpent,
      },
    });
    RouletteBets.updateAsync(
      {
        _id: { $in: playerBets.map((bet) => bet._id) },
      },
      {
        $set: {
          status: 'lost',
          win_payout: 0,
        },
      },
      { multi: true },
    );
    return;
  }

  const playerLosingBets = playerBets.filter(
    (bet) => !playerWinningBets.includes(bet),
  );
  RouletteBets.updateAsync(
    {
      _id: { $in: playerLosingBets.map((bet) => bet._id) },
    },
    {
      $set: {
        status: 'lost',
        win_payout: 0,
      },
    },
    { multi: true },
  );

  const hasNumberWin = playerWinningBets.some((bet) => bet.isNumberBet());

  playerWinningBets.forEach((bet) => {
    if (bet.isNumberBet()) {
      bet.win_payout = Math.round(
        bet.wager! * roulette.number_payout_multiplier,
      );
      RouletteBets.updateAsync(bet._id, {
        $set: { status: 'won', win_payout: bet.win_payout },
      });
    } else {
      bet.win_payout = Math.round(
        bet.wager! * roulette.special_payout_multiplier,
      );
      RouletteBets.updateAsync(bet._id, {
        $set: { status: 'won', win_payout: bet.win_payout },
      });
    }
  });

  const totalPayout = playerWinningBets.reduce(
    (total, bet) => total + bet.win_payout,
    0,
  );

  const payoutDetailText = playerWinningBets.map((bet) => {
    if (bet.isSpecialBet())
      return `${commaNumber(bet.wager!)} ${CURRENCY} on ${bet.bet_slot} (x${
        roulette.special_payout_multiplier
      }) nets ${commaNumber(bet.win_payout)} ${CURRENCY}`;
    return `${commaNumber(bet.wager!)} ${CURRENCY} on ${bet.bet_slot} (x${
      roulette.number_payout_multiplier
    }) nets ${commaNumber(bet.win_payout)} ${CURRENCY}`;
  });

  playerGiveMoney({
    playerId,
    money: totalPayout,
  });
  if (hasNumberWin) {
    sendAutoText({
      playerId,
      trigger: 'ROULETTE_WIN_NUMBER',
      templateVars: {
        money_won: totalPayout,
        number: roulette.result,
        payout_detail: payoutDetailText.join('\n'),
      },
    });
  } else {
    sendAutoText({
      playerId,
      trigger: 'ROULETTE_WIN_SMALL',
      templateVars: {
        money_won: totalPayout,
        number: roulette.result,
        payout_detail: payoutDetailText.join('\n'),
      },
    });
  }
};

export const rouletteDoPayouts = async (roulette_id: RouletteId) => {
  const roulette = await Roulettes.findOneAsync(roulette_id);
  if (!roulette || typeof roulette.result === 'undefined') return;

  const placedBets = await RouletteBets.find({
    roulette_id,
    status: 'placed',
    event: await Events.currentIdOrThrowAsync(),
  }).fetchAsync();

  const playersDict: Record<PlayerId, RouletteBetWithHelpers[]> = {};

  placedBets.forEach((bet) => {
    if (!playersDict[bet.player.id]) playersDict[bet.player.id] = [];
    playersDict[bet.player.id].push(bet);
  });

  const winningSpecialBetSlots = getWinningSpecialBets(roulette.result);

  Object.entries(playersDict).forEach(([playerId, playerBets]) => {
    processBetsForPlayer(
      playerId,
      playerBets,
      winningSpecialBetSlots,
      roulette,
    );
  });
};

export const doRoulettePayoutsMethod = getWrappedServerMethod(
  'roulettes.doPayouts',
  rouletteDoPayouts,
);
