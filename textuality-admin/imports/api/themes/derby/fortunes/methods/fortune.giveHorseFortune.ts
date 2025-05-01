import Horses, { HorseWithHelpers } from '../../horses/horses';

import Events from '/imports/api/events';

import Fortunes, { FortuneWithHelpers } from '../fortunes';
import { PlayerWithHelpers } from '/imports/api/players/players';
import { sendAutoText } from '/imports/api/autoTexts/methods/autoTexts.send';
import { HorseStat } from '/imports/schemas/derby/horse';
import { STAT_FANCY_NAME } from '/imports/schemas/derby/horse';
import { fortuneTellerClose } from '../../tellers/fortune-teller-flow/teller.fortune.closeTeller';

const getRankedStatsForHorse = (horse: HorseWithHelpers) => {
  const stats = horse.stats();
  const rankedStats = Object.entries(stats).sort((a, b) => b[1] - a[1]);

  return rankedStats.map(
    ([stat, value], idx) => `${idx + 1}. ${STAT_FANCY_NAME[stat as HorseStat]}`,
  );
};

export const fortuneGiveHorseFortune = async ({
  player,
  fortune,
}: {
  player: PlayerWithHelpers;
  fortune: FortuneWithHelpers;
}) => {
  const horses = await Horses.find({
    event: Events.currentIdOrThrow(),
  }).fetchAsync();

  if (!horses.length) {
    return;
  }

  const horse = horses[Math.floor(Math.random() * horses.length)];

  const rankedStats = getRankedStatsForHorse(horse);

  Fortunes.updateAsync(fortune._id, {
    $set: {
      type: 'horse',
      horse: horse._id,
      status: 'given',
      given_at: new Date(),
    },
  });

  sendAutoText({
    trigger: 'FORTUNE_TELLER_HORSE_RANKING',
    playerId: player._id,
    templateVars: {
      horse_name: horse.name,
      horse_number: horse.number,
      horse_emoji: horse.emojiColorSquare,

      horse_ranked_stats: rankedStats.join('\n'),
    },
  });

  fortuneTellerClose(fortune.teller);
};
