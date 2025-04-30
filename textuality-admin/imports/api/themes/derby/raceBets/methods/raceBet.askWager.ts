import { RaceBetWithHelpers } from '../raceBets';

import { RaceWithHelpers } from '../../race/races';
import { sendAutoText } from '/imports/api/autoTexts/methods/autoTexts.send';
import { PlayerWithHelpers } from '/imports/api/players/players';
import { TellerWithHelpers } from '../../tellers/tellers';
import Horses from '../../horses/horses';

type RaceBetAskTypeArgs = {
  player: PlayerWithHelpers;
  raceBet: RaceBetWithHelpers;
  race: RaceWithHelpers;
  teller: TellerWithHelpers;
};

const STANDARD_MULTIPLES = [1, 2, 3, 5, 10, 20, 50, 100];

const getBetWagerOptions = ({
  raceBet,
  minBet,
  playerMoney,
}: {
  raceBet: RaceBetWithHelpers;
  minBet: number;
  playerMoney: number;
}) => {
  const standardOptions = STANDARD_MULTIPLES.filter((multiple) => {
    const wagerCost = minBet * multiple;
    return wagerCost <= playerMoney;
  }).map((multiple) => {
    const wagerCost = minBet * multiple;
    return {
      label: `${multiple}x ${minBet}DD = ${wagerCost}DD`,
      value: `raceBet/${raceBet._id}/ticket/${multiple}x${minBet}`,
    };
  });

  const letItRideOption = {
    label: `Let it Ride! $${playerMoney}`,
    value: `raceBet/${raceBet._id}/ticket/let-it-ride`,
  };

  const cancelOption = {
    label: 'Cancel this bet',
    value: `raceBet/${raceBet._id}/cancel`,
  };

  return [...standardOptions, letItRideOption, cancelOption];
};

export const raceBetAskWager = async ({
  player,
  raceBet,
  teller,
  race,
}: RaceBetAskTypeArgs) => {
  const horses = await Horses.find(
    {
      _id: { $in: race.horses },
    },
    {
      fields: {
        name: 1,
        number: 1,
        emojiColorSquare: 1,
        color: 1,
      },
      sort: {
        number: 1,
      },
    },
  ).fetchAsync();

  const betHorses =
    raceBet.horses?.map((horseId) => {
      return horses.find((horse) => horse._id === horseId);
    }) ?? [];

  if (raceBet.type === 'trifecta') {
    sendAutoText({
      trigger: 'TELLER_BET_WAGER_TRIFECTA',
      playerId: player._id,
      templateVars: {
        teller_name: raceBet.teller_text_code,
        bet_base: teller.min_wager,
        horse1_name: betHorses[0]?.name,
        horse1_number: betHorses[0]?.number,
        horse1_emoji: betHorses[0]?.emojiColorSquare,
        horse2_name: betHorses[1]?.name,
        horse2_number: betHorses[1]?.number,
        horse2_emoji: betHorses[1]?.emojiColorSquare,
        horse3_name: betHorses[2]?.name,
        horse3_number: betHorses[2]?.number,
        horse3_emoji: betHorses[2]?.emojiColorSquare,
      },
      interactivePayload: {
        type: 'list',
        list_button_label: 'Pick a bet',
        options: getBetWagerOptions({
          raceBet,
          minBet: teller.min_wager,
          playerMoney: player.money,
        }),
      },
    });
    return;
  }
  sendAutoText({
    trigger: 'TELLER_BET_WAGER',
    playerId: player._id,
    templateVars: {
      teller_name: raceBet.teller_text_code,
      bet_base: teller.min_wager,
      horse_name: betHorses[0]?.name,
      horse_number: betHorses[0]?.number,
      horse_emoji: betHorses[0]?.emojiColorSquare,
    },
    interactivePayload: {
      type: 'list',
      list_button_label: 'Pick a bet',
      options: getBetWagerOptions({
        raceBet,
        minBet: teller.min_wager,
        playerMoney: player.money,
      }),
    },
  });
};
