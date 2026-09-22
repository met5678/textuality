import { RaceWithHelpers } from '../../race/races';
import RaceBets, { RaceBetWithHelpers } from '../raceBets';
import { raceBetAskHorse } from './raceBet.askHorse';
import { PlayerWithHelpers } from '/imports/api/players/players';

type ProcessBetTypeArgs = {
  player: PlayerWithHelpers;
  raceBet: RaceBetWithHelpers;
  race: RaceWithHelpers;
  value: string;
};

export const raceBetProcessBetType = async ({
  player,
  raceBet,
  race,
  value,
}: ProcessBetTypeArgs) => {
  if (value === 'win') {
    await RaceBets.updateAsync(raceBet._id, {
      $set: {
        type: 'win',
        step: 'horse1',
      },
    });
    raceBet.type = 'win';
    raceBet.step = 'horse1';

    raceBetAskHorse({
      player,
      raceBet,
      race,
    });
  }

  if (value === 'trifecta') {
    await RaceBets.updateAsync(raceBet._id, {
      $set: {
        type: 'trifecta',
        step: 'horse1',
      },
    });

    raceBet.type = 'trifecta';
    raceBet.step = 'horse1';

    raceBetAskHorse({
      player,
      raceBet,
      race,
    });
  }
};
