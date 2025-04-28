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

const getBetTypeOptions = (raceBet: RaceBetWithHelpers) => {
  return [
    {
      label: 'Win',
      value: `raceBet/${raceBet._id}/bet-type/win`,
    },
    {
      label: 'Trifecta',
      value: `raceBet/${raceBet._id}/bet-type/trifecta`,
    },
    {
      label: 'Cancel',
      value: `raceBet/${raceBet._id}/cancel`,
    },
  ];
};

export const raceBetAskType = async ({
  player,
  raceBet,
  teller,
}: RaceBetAskTypeArgs) => {
  sendAutoText({
    trigger: 'TELLER_BET_TYPE',
    playerId: player._id,
    templateVars: {
      teller_name: teller.text_code,
    },
    interactivePayload: {
      type: 'buttons',
      options: getBetTypeOptions(raceBet),
    },
  });
};
