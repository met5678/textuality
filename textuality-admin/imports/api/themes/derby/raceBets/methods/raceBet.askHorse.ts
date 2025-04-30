import { RaceBetWithHelpers } from '../raceBets';

import Horses, { HorseWithHelpers } from '../../horses/horses';
import { RaceWithHelpers } from '../../race/races';
import { sendAutoText } from '/imports/api/autoTexts/methods/autoTexts.send';
import { PlayerWithHelpers } from '/imports/api/players/players';
import { HorseId } from '/imports/schemas/derby/horse';

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
  excludeHorseIds?: HorseId[],
) => {
  const horseOptions = horses
    .filter((horse) => !excludeHorseIds?.includes(horse._id))
    .map((horse) => ({
      label: `#${horse.number} - ${horse.emojiColorSquare} ${horse.name}`,
      value: `raceBet/${raceBet._id}/horse${horseNum}/${horse._id}`,
    }));

  return [
    ...horseOptions,
    {
      label: 'Cancel this bet',
      value: `raceBet/${raceBet._id}/cancel`,
    },
  ];
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
        templateVars: {
          horse_number: horses[0].number,
          horse_name: horses[0].name,
        },
        interactivePayload: {
          type: 'list',
          options: getHorseOptions(raceBet, horses, 2, raceBet.horses),
          list_button_label: 'Pick 2nd Place horse',
        },
      });
      return;
    }

    if (horseNum === 3) {
      sendAutoText({
        trigger: 'TELLER_BET_HORSE3_TRIFECTA',
        playerId: player._id,
        templateVars: {
          horse_number: horses[1].number,
          horse_name: horses[1].name,
        },
        interactivePayload: {
          type: 'list',
          options: getHorseOptions(raceBet, horses, 3, raceBet.horses),
          list_button_label: 'Pick 3rd Place horse',
        },
      });
      return;
    }
  }
};
