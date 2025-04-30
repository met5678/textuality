import { RaceBetWithHelpers } from '../raceBets';

import { RaceWithHelpers } from '../../race/races';
import { sendAutoText } from '/imports/api/autoTexts/methods/autoTexts.send';
import { PlayerWithHelpers } from '/imports/api/players/players';
import { TellerWithHelpers } from '../../tellers/tellers';

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
    label: "Cancel this bet",
    value: `raceBet/${raceBet._id}/cancel`,
  };

  return [...standardOptions, letItRideOption, cancelOption];
};

export const raceBetAskWager = async ({
  player,
  raceBet,
  teller,
}: RaceBetAskTypeArgs) => {
  sendAutoText({
    trigger: 'TELLER_BET_WAGER',
    playerId: player._id,
    templateVars: {
      teller_name: teller.text_code,
      bet_base: teller.min_wager,
      player_money: player.money,
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
