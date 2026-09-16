import { sendAutoText } from '/imports/api/autoTexts/methods/autoTexts.send';
import { PlayerWithHelpers } from '/imports/api/players/players';
import { RouletteBetWithHelpers } from '../rouletteBets';

type RouletteBetAskNumberArgs = {
  player: PlayerWithHelpers;
  rouletteBet: RouletteBetWithHelpers;
};

const getCancelOption = (rouletteBet: RouletteBetWithHelpers) => {
  return [
    {
      label: 'Cancel',
      value: `rouletteBet/${rouletteBet._id}/cancel`,
    },
  ];
};

export const rouletteBetAskNumber = async ({
  player,
  rouletteBet,
}: RouletteBetAskNumberArgs) => {
  sendAutoText({
    trigger: 'ROULETTE_BET_ASK_NUMBER',
    playerId: player._id,
    interactivePayload: {
      type: 'buttons',
      options: getCancelOption(rouletteBet),
    },
  });
};
