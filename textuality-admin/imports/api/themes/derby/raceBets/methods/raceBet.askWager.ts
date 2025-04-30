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

  if (raceBet.type === 'trifecta') {
    sendAutoText({
      trigger: 'TELLER_BET_WAGER_TRIFECTA',
      playerId: player._id,
      templateVars: {
        teller_name: raceBet.teller_text_code,
        bet_base: teller.min_wager,
        horse1_name: horses[0].name,
        horse1_number: horses[0].number,
        horse1_emoji: horses[0].emojiColorSquare,
        horse2_name: horses[1].name,
        horse2_number: horses[1].number,
        horse2_emoji: horses[1].emojiColorSquare,
        horse3_name: horses[2].name,
        horse3_number: horses[2].number,
        horse3_emoji: horses[2].emojiColorSquare,
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
      horse_name: horses[0].name,
      horse_number: horses[0].number,
      horse_emoji: horses[0].emojiColorSquare,
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
