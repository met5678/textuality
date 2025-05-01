import { FortuneWithHelpers } from '../fortunes';
import { fortuneGiveHorseFortune } from './fortune.giveHorseFortune';
import { fortuneGiveStatFortune } from './fortune.giveStatFortune';
import { PlayerWithHelpers } from '/imports/api/players/players';
import { FORTUNE_TYPES, FortuneType } from '/imports/schemas/derby/fortune';

type ProcessBetTypeArgs = {
  player: PlayerWithHelpers;
  fortune: FortuneWithHelpers;
  value: string;
};

export const fortuneProcessType = async ({
  player,
  fortune,
  value,
}: ProcessBetTypeArgs) => {
  if (!FORTUNE_TYPES.includes(value as FortuneType)) {
    return;
  }

  if (value === 'horse') {
    fortuneGiveHorseFortune({
      player,
      fortune,
    });
  }

  if (value === 'stat-top') {
    fortuneGiveStatFortune({
      player,
      fortune,
      isTop: true,
    });
  }

  if (value === 'stat-bottom') {
    fortuneGiveStatFortune({
      player,
      fortune,
      isTop: false,
    });
  }
};
