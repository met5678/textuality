import Horses, { HorseWithHelpers } from '../../horses/horses';

import Events from '/imports/api/events';

import Fortunes, { FortuneWithHelpers } from '../fortunes';
import { PlayerWithHelpers } from '/imports/api/players/players';
import { sendAutoText } from '/imports/api/autoTexts/methods/autoTexts.send';
import { HORSE_STATS, HorseStat } from '/imports/schemas/derby/horse';
import { AutoTextTrigger } from '/imports/schemas/autoText';
import { fortuneTellerClose } from '../../tellers/fortune-teller-flow/teller.fortune.closeTeller';
import { cancelAndDeleteTimeout } from '../../tellers/teller-flow/_teller-timeouts';
const getHorsesRankedByStat = (horses: HorseWithHelpers[], stat: HorseStat) => {
  return horses.sort((a, b) => b.stats()[stat] - a.stats()[stat]);
};

const getAutoTextTrigger = (
  stat: HorseStat,
  isTop: boolean,
): AutoTextTrigger => {
  return `FORTUNE_TELLER_STAT_${stat.toUpperCase()}_${
    isTop ? 'TOP' : 'BOTTOM'
  }` as AutoTextTrigger;
};

export const fortuneGiveStatFortune = async ({
  player,
  fortune,
  isTop,
}: {
  player: PlayerWithHelpers;
  fortune: FortuneWithHelpers;
  isTop: boolean;
}) => {
  const stat: HorseStat =
    HORSE_STATS[Math.floor(Math.random() * HORSE_STATS.length)];

  const horses = await Horses.find({
    event: Events.currentIdOrThrow(),
  }).fetchAsync();

  const horsesRankedByStat = getHorsesRankedByStat(horses, stat);

  const horsesGiven = isTop
    ? horsesRankedByStat.slice(0, 3)
    : horsesRankedByStat.slice(-3).reverse();
  const horsesGivenFormatted = horsesGiven
    .map((horse) => {
      return horse.formattedName();
    })
    .join('\n');

  Fortunes.updateAsync(fortune._id, {
    $set: {
      type: isTop ? 'stat-top' : 'stat-bottom',
      stat,
      status: 'given',
      given_at: new Date(),
    },
  });

  sendAutoText({
    trigger: getAutoTextTrigger(stat, isTop),
    playerId: player._id,
    templateVars: {
      horses_ranked: horsesGivenFormatted,
    },
  });

  fortuneTellerClose(fortune.teller);
};
