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
      label: 'Special',
      value: `rouletteBet/${rouletteBet._id}/${rouletteBet.step}/special`,
    },
    {
      label: 'Cancel',
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
      type: 'buttons',
      options: getBetTypeOptions(rouletteBet),
    },
  });
};
