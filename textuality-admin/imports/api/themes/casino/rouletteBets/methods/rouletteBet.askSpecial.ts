import { sendAutoText } from '/imports/api/autoTexts/methods/autoTexts.send';
import { PlayerWithHelpers } from '/imports/api/players/players';
import { RouletteBetWithHelpers } from '../rouletteBets';

type RouletteBetAskSpecialArgs = {
  player: PlayerWithHelpers;
  rouletteBet: RouletteBetWithHelpers;
};

const getSpecialOptions = (rouletteBet: RouletteBetWithHelpers) => {
  return [
    {
      label: 'Odd',
      value: `rouletteBet/${rouletteBet._id}/${rouletteBet.step}/odd`,
    },
    {
      label: 'Even',
      value: `rouletteBet/${rouletteBet._id}/${rouletteBet.step}/even`,
    },
    {
      label: 'Red',
      value: `rouletteBet/${rouletteBet._id}/${rouletteBet.step}/red`,
    },
    {
      label: 'Black',
      value: `rouletteBet/${rouletteBet._id}/${rouletteBet.step}/black`,
    },
    {
      label: 'Cancel Bet',
      value: `rouletteBet/${rouletteBet._id}/cancel`,
    },
  ];
};

export const rouletteBetAskSpecial = async ({
  player,
  rouletteBet,
}: RouletteBetAskSpecialArgs) => {
  sendAutoText({
    trigger: 'ROULETTE_BET_ASK_SPECIAL',
    playerId: player._id,
    interactivePayload: {
      type: 'list',
      options: getSpecialOptions(rouletteBet),
    },
  });
};
