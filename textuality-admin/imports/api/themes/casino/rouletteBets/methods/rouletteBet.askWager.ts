import { sendAutoText } from '/imports/api/autoTexts/methods/autoTexts.send';
import { PlayerWithHelpers } from '/imports/api/players/players';
import { RouletteBetWithHelpers } from '../rouletteBets';

type RouletteBetAskWagerArgs = {
  player: PlayerWithHelpers;
  rouletteBet: RouletteBetWithHelpers;
};

const getBetWagerOptions = (rouletteBet: RouletteBetWithHelpers) => {
  const options = [
    {
      label: `💸 Bet it all! 💸`,
      value: `rouletteBet/${rouletteBet._id}/${rouletteBet.step}/all`,
    },
    {
      label: 'Cancel',
      value: `rouletteBet/${rouletteBet._id}/cancel`,
    },
  ];

  return options;
};

export const rouletteBetAskWager = async ({
  player,
  rouletteBet,
}: RouletteBetAskWagerArgs) => {
  sendAutoText({
    trigger: 'ROULETTE_BET_ASK_WAGER',
    playerId: player._id,
    interactivePayload: {
      type: 'buttons',
      options: getBetWagerOptions(rouletteBet),
    },
  });
};
