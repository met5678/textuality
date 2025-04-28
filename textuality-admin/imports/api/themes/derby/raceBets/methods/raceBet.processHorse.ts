import Horses from '../../horses/horses';
import { RaceWithHelpers } from '../../race/races';
import RaceBets, { RaceBetWithHelpers } from '../raceBets';
import { raceBetAskHorse } from './raceBet.askHorse';
import { PlayerWithHelpers } from '/imports/api/players/players';
import { RaceBetStep } from '/imports/schemas/derby/raceBet';

type ProcessHorseArgs = {
  player: PlayerWithHelpers;
  raceBet: RaceBetWithHelpers;
  race: RaceWithHelpers;
  horseNum: number;
  value: string;
};

const getNextStep = (
  raceBet: RaceBetWithHelpers,
  horseNum: number,
): RaceBetStep => {
  if (raceBet.type === 'win') {
    return 'wager';
  }

  if (raceBet.type === 'trifecta') {
    if (horseNum === 1) {
      return 'horse2';
    }

    if (horseNum === 2) {
      return 'horse3';
    }
  }
  return 'wager';
};

export const raceBetProcessHorse = async ({
  player,
  raceBet,
  race,
  horseNum,
  value,
}: ProcessHorseArgs) => {
  const horses = await Horses.find(
    {
      _id: { $in: race.horses },
    },
    {
      fields: {
        name: 1,
        number: 1,
      },
    },
  ).fetchAsync();

  if (!horses.find((horse) => horse._id === value)) {
    throw new Error('raceBetProcessHorse: Horse not found');
  }

  const nextStep = getNextStep(raceBet, horseNum);
  const newHorses = [...(raceBet.horses || [])];
  newHorses[horseNum - 1] = value;

  await RaceBets.updateAsync(raceBet._id, {
    $set: {
      step: nextStep,
      horses: newHorses,
    },
  });

  if (nextStep === 'wager') {
    // TODO: Ask for wager
  } else {
    raceBetAskHorse({
      player,
      raceBet,
      race,
      horseNum: horseNum + 1,
    });
  }
};
