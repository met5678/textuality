import { RaceBetWithHelpers } from '../raceBets';

import Horses, { HorseWithHelpers } from '../../horses/horses';
import { RaceWithHelpers } from '../../race/races';
import { sendAutoText } from '/imports/api/autoTexts/methods/autoTexts.send';
import { PlayerWithHelpers } from '/imports/api/players/players';

type RaceBetAskHorseArgs = {
  player: PlayerWithHelpers;
  raceBet: RaceBetWithHelpers;
  race: RaceWithHelpers;
  horseNum?: number;
};

const getHorseOptions = (
  raceBet: RaceBetWithHelpers,
  horses: HorseWithHelpers[],
  horseNum: number,
) => {
  return horses.map((horse) => ({
    label: `#${horse.number} - ${horse.name}`,
    value: `raceBet/${raceBet._id}/horse${horseNum}/${horse._id}`,
  }));
};

export const raceBetAskHorse = async ({
  player,
  raceBet,
  race,
  horseNum = 1,
}: RaceBetAskHorseArgs) => {
  const horses = await Horses.find(
    {
      _id: { $in: race.horses },
    },
    {
      fields: {
        name: 1,
        number: 1,
        color: 1,
      },
      sort: {
        number: 1,
      },
    },
  ).fetchAsync();

  if (raceBet.type === 'win') {
    sendAutoText({
      trigger: 'TELLER_BET_HORSE_WIN',
      playerId: player._id,
      interactivePayload: {
        type: 'list',
        options: getHorseOptions(raceBet, horses, 1),
        list_button_label: 'Pick your horse',
      },
    });
  }

  if (raceBet.type === 'trifecta') {
    if (horseNum === 1) {
      sendAutoText({
        trigger: 'TELLER_BET_HORSE1_TRIFECTA',
        playerId: player._id,
        interactivePayload: {
          type: 'list',
          options: getHorseOptions(raceBet, horses, 1),
          list_button_label: 'Pick 1st Place horse',
        },
      });
      return;
    }

    if (horseNum === 2) {
      sendAutoText({
        trigger: 'TELLER_BET_HORSE2_TRIFECTA',
        playerId: player._id,
        interactivePayload: {
          type: 'list',
          options: getHorseOptions(raceBet, horses, 2),
          list_button_label: 'Pick 2nd Place horse',
        },
      });
      return;
    }

    if (horseNum === 3) {
      sendAutoText({
        trigger: 'TELLER_BET_HORSE3_TRIFECTA',
        playerId: player._id,
        interactivePayload: {
          type: 'list',
          options: getHorseOptions(raceBet, horses, 3),
          list_button_label: 'Pick 3rd Place horse',
        },
      });
      return;
    }
  }
};
