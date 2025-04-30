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
        emojiColorSquare: 1,
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
      const betHorses =
        raceBet.horses?.map((horseId) => {
          return horses.find((horse) => horse._id === horseId);
        }) ?? [];

      sendAutoText({
        trigger: 'TELLER_BET_HORSE2_TRIFECTA',
        playerId: player._id,
        templateVars: {
          teller_name: raceBet.teller_text_code,
          horse1_number: betHorses[0]?.number,
          horse1_name: betHorses[0]?.name,
          horse1_emoji: betHorses[0]?.emojiColorSquare,
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
      const betHorses =
        raceBet.horses?.map((horseId) => {
          return horses.find((horse) => horse._id === horseId);
        }) ?? [];

      sendAutoText({
        trigger: 'TELLER_BET_HORSE3_TRIFECTA',
        playerId: player._id,
        templateVars: {
          teller_name: raceBet.teller_text_code,
          horse1_number: betHorses[0]?.number,
          horse1_name: betHorses[0]?.name,
          horse1_emoji: betHorses[0]?.emojiColorSquare,
          horse2_number: betHorses[1]?.number,
          horse2_name: betHorses[1]?.name,
          horse2_emoji: betHorses[1]?.emojiColorSquare,
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
