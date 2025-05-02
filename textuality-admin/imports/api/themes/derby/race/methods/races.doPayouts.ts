import { RaceHorseResult, RaceId } from '/imports/schemas/derby/race';
import Races from '../races';
import RaceBets from '../../raceBets';
import { HorseId } from '/imports/schemas/derby/horse';
import Events from '/imports/api/events';
import Players from '/imports/api/players';
import { RaceHorseOdds } from '/imports/schemas/derby/race';
import {
  RaceBet,
  RaceBetComplete,
  RaceBetCompleteWithHelpers,
  RaceBetType,
} from '/imports/schemas/derby/raceBet';
import { sendAutoText } from '/imports/api/autoTexts/methods/autoTexts.send';
import Horses, { HorseWithHelpers } from '../../horses/horses';
import commaNumber from 'comma-number';
import ordinal from 'ordinal';

const getWinBetPayout = (
  bet: RaceBetCompleteWithHelpers,
  odds: RaceHorseOdds[],
): number => {
  const horse = odds.find((o) => o.horse === bet.horses[0]);
  if (!horse) {
    return 0;
  }
  return bet.totalWager() * horse.odds;
};

const getTrifectaBetPayout = (
  bet: RaceBetCompleteWithHelpers,
  odds: RaceHorseOdds[],
): number => {
  const horses = odds.filter((o) => bet.horses.includes(o.horse));
  if (horses.length !== 3) {
    return 0;
  }
  return Math.round(
    bet.totalWager() *
      horses[0].odds *
      (horses[1].odds / 2) *
      (horses[2].odds / 3),
  );
};

type PlayerPayouts = {
  totalWagered: number;
  grossPayout: number;
  net: number;
  wonBets: {
    payout: number;
    bet: RaceBetCompleteWithHelpers;
  }[];
  trifectaWonBets: {
    payout: number;
    bet: RaceBetCompleteWithHelpers;
  }[];
  lostBets: {
    wager: number;
    bet: RaceBetCompleteWithHelpers;
  }[];
};

const getPayoutsForPlayer = (
  playerBets: RaceBet[],
  odds: RaceHorseOdds[],
  results: RaceHorseResult[],
): PlayerPayouts => {
  const payouts: PlayerPayouts = {
    totalWagered: 0,
    grossPayout: 0,
    net: 0,
    wonBets: [],
    trifectaWonBets: [],
    lostBets: [],
  };
  for (const bet of playerBets as RaceBetCompleteWithHelpers[]) {
    payouts.totalWagered += bet.totalWager();

    if (bet.type === 'win') {
      if (bet.horses[0] === results[0].horse) {
        const payout = getWinBetPayout(bet, odds);
        payouts.grossPayout += payout;

        payouts.wonBets.push({
          payout,
          bet,
        });
      } else {
        payouts.lostBets.push({
          wager: bet.totalWager(),
          bet,
        });
      }
    } else if (bet.type === 'trifecta') {
      if (
        bet.horses[0] === results[0].horse &&
        bet.horses[1] === results[1].horse &&
        bet.horses[2] === results[2].horse
      ) {
        const payout = getTrifectaBetPayout(bet, odds);
        payouts.grossPayout += payout;
        payouts.trifectaWonBets.push({
          payout,
          bet,
        });
      } else {
        payouts.lostBets.push({
          wager: bet.totalWager(),
          bet,
        });
      }
    }
  }

  // Sort the bets by payout
  payouts.wonBets.sort((a, b) => b.payout - a.payout);
  payouts.trifectaWonBets.sort((a, b) => b.payout - a.payout);
  payouts.lostBets.sort((a, b) => b.wager - a.wager);
  payouts.net = payouts.grossPayout - payouts.totalWagered;

  return payouts;
};

const getHorseName = (horseId: HorseId, horses: HorseWithHelpers[]) => {
  const horse = horses.find((h) => h._id === horseId);
  if (!horse) {
    return '';
  }
  return horse.name;
};

const getHorseEmoji = (horseId: HorseId, horses: HorseWithHelpers[]) => {
  const horse = horses.find((h) => h._id === horseId);
  if (!horse) {
    return '';
  }
  return horse.emojiColorSquare;
};

const getPayoutSummary = (
  payouts: PlayerPayouts,
  horses: HorseWithHelpers[],
) => {
  let summary = '';

  if (payouts.trifectaWonBets.length) {
    summary += '🎯 Trifecta Bets:\n';

    for (const { bet, payout } of payouts.trifectaWonBets) {
      summary += `${commaNumber(bet.totalWager())} DD on ${bet.horses
        .map((h) => getHorseEmoji(h, horses))
        .join(' ')} → ${commaNumber(payout)} DD\n`;
    }
    summary += '\n';
  }

  if (payouts.wonBets.length) {
    summary += '🥇 Win Bets:\n';

    const payoutsByHorse = payouts.wonBets.reduce(
      (acc, { bet, payout }) => {
        acc[bet.horses[0]] ??= {
          wager: 0,
          payout: 0,
        };
        acc[bet.horses[0]].wager += bet.totalWager();
        acc[bet.horses[0]].payout += payout;
        return acc;
      },
      {} as Record<HorseId, { wager: number; payout: number }>,
    );

    const sortedPayoutsByHorse = Object.entries(payoutsByHorse).sort(
      ([, { payout }], [, { payout: payout2 }]) => payout2 - payout,
    );

    for (const [horseId, { wager, payout }] of sortedPayoutsByHorse) {
      summary += `${commaNumber(wager)} DD on ${getHorseEmoji(
        horseId,
        horses,
      )} → ${commaNumber(payout)} DD\n`;
    }
    summary += '\n';
  }

  if (payouts.lostBets.length) {
    summary += '💸 Lost Bets:\n';

    const trifectaLostBets = payouts.lostBets.filter(
      ({ bet }) => bet.type === 'trifecta',
    );
    for (const { bet, wager } of trifectaLostBets) {
      summary += `${commaNumber(wager)} DD on ${bet.horses
        .map((h) => getHorseEmoji(h, horses))
        .join(' ')}\n`;
    }

    const winLostBets = payouts.lostBets.filter(
      ({ bet }) => bet.type === 'win',
    );

    const wagersByHorse = winLostBets.reduce(
      (acc, { bet, wager }) => {
        acc[bet.horses[0]] ??= 0;
        acc[bet.horses[0]] += wager;
        return acc;
      },
      {} as Record<HorseId, number>,
    );

    const sortedWagersByHorse = Object.entries(wagersByHorse).sort(
      ([, wager], [, wager2]) => wager2 - wager,
    );

    for (const [horseId, wager] of sortedWagersByHorse) {
      summary += `${commaNumber(wager)} DD on ${getHorseEmoji(
        horseId,
        horses,
      )}\n`;
    }
    summary += '\n';
  }

  return summary;
};

const getResultsSummary = (
  results: RaceHorseResult[],
  horses: HorseWithHelpers[],
) => {
  return results
    .map((result) => {
      return `${ordinal(result.placement)}: ${getHorseEmoji(
        result.horse,
        horses,
      )} ${getHorseName(result.horse, horses)}`;
    })
    .slice(0, 3)
    .join('\n');
};

export const raceDoPayouts = async (raceId: RaceId) => {
  const race = await Races.findOneAsync(raceId);
  if (!race) {
    throw new Error('raceDoPayouts: Race not found');
  }

  const players = await Players.find({
    event: Events.currentIdOrThrow(),
  }).fetchAsync();

  const raceBets = await RaceBets.find({
    race: raceId,
    status: 'placed',
  }).fetchAsync();

  const horses = await Horses.find({
    _id: { $in: race.horses },
  }).fetchAsync();

  for (const player of players) {
    const playerBets = raceBets.filter((bet) => bet.player === player._id);
    if (playerBets.length) {
      const playerPayouts = getPayoutsForPlayer(
        playerBets,
        race.odds,
        race.results,
      );

      // Update the player's bets
      for (const bet of playerPayouts.wonBets) {
        RaceBets.updateAsync(bet.bet._id, {
          $set: { payout: bet.payout, status: 'won' },
        });
      }
      for (const bet of playerPayouts.trifectaWonBets) {
        RaceBets.updateAsync(bet.bet._id, {
          $set: { payout: bet.payout, status: 'won' },
        });
      }
      for (const bet of playerPayouts.lostBets) {
        RaceBets.updateAsync(bet.bet._id, { $set: { status: 'lost' } });
      }

      // Update the player's balance
      await Players.updateAsync(player._id, {
        $inc: { money: playerPayouts.grossPayout },
      });

      if (playerPayouts.trifectaWonBets.length) {
        sendAutoText({
          trigger: 'RACEBET_RESULT_TRIFECTA',
          playerId: player._id,
          templateVars: {
            total_wagered: playerPayouts.totalWagered,
            gross_payout: playerPayouts.grossPayout,
            result_summary: getResultsSummary(race.results, horses),
            payout_summary: getPayoutSummary(playerPayouts, horses),
          },
        });
      } else if (playerPayouts.grossPayout / playerPayouts.totalWagered > 8) {
        sendAutoText({
          trigger: 'RACEBET_RESULT_WIN_BIG',
          playerId: player._id,
          templateVars: {
            total_wagered: playerPayouts.totalWagered,
            gross_payout: playerPayouts.grossPayout,
            net: playerPayouts.net,
            result_summary: getResultsSummary(race.results, horses),

            payout_summary: getPayoutSummary(playerPayouts, horses),
          },
        });
      } else if (playerPayouts.wonBets.length) {
        sendAutoText({
          trigger: 'RACEBET_RESULT_WIN',
          playerId: player._id,
          templateVars: {
            total_wagered: playerPayouts.totalWagered,
            gross_payout: playerPayouts.grossPayout,
            net: playerPayouts.net,
            result_summary: getResultsSummary(race.results, horses),

            payout_summary: getPayoutSummary(playerPayouts, horses),
          },
        });
      } else if (playerPayouts.lostBets.length) {
        sendAutoText({
          trigger: 'RACEBET_RESULT_LOSE',
          playerId: player._id,
          templateVars: {
            total_wagered: playerPayouts.totalWagered,
            gross_payout: playerPayouts.grossPayout,
            net: playerPayouts.net,
            result_summary: getResultsSummary(race.results, horses),

            payout_summary: getPayoutSummary(playerPayouts, horses),
          },
        });
      }
    }
  }
};
