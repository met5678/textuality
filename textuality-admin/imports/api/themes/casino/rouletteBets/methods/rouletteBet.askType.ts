import { sendAutoText } from '/imports/api/autoTexts/methods/autoTexts.send';
import { PlayerWithHelpers } from '/imports/api/players/players';
import { RouletteBetWithHelpers } from '../rouletteBets';

type RouletteBetAskTypeArgs = {
  player: PlayerWithHelpers;
  rouletteBet: RouletteBetWithHelpers;
};

const getBetTypeOptions = (rouletteBet: RouletteBetWithHelpers) => {
  return [
    {
      label: 'Number',
      value: `rouletteBet/${rouletteBet._id}/${rouletteBet.step}/number`,
    },
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

export const rouletteBetAskType = async ({
  player,
  rouletteBet,
}: RouletteBetAskTypeArgs) => {
  sendAutoText({
    trigger: 'ROULETTE_BET_ASK_TYPE',
    playerId: player._id,
    interactivePayload: {
      type: 'list',
      options: getBetTypeOptions(rouletteBet),
    },
  });
};
