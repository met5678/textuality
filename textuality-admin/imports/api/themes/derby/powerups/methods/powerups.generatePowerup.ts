import Powerups from '../powerups';
import { Powerup, PowerupId } from '/imports/schemas/derby/powerup';
import { PlayerId } from '/imports/schemas/player';
import Events from '/imports/api/events';
import Horses, {
  HorseWithHelpers,
} from '/imports/api/themes/derby/horses/horses';
import {
  HORSE_STATS,
  HorseStat,
  HorseStats,
  HorseId,
  STAT_FANCY_NAME,
} from '/imports/schemas/derby/horse';
import { OptionalId } from '/imports/utils/optional-id';
import { sendAutoText } from '/imports/api/autoTexts/methods/autoTexts.send';
import { AutoTextTrigger } from '/imports/schemas/autoText';
import shuffle from 'shuffle-array';

const getStatsSum = (stats: HorseStats) => {
  return Object.values(stats).reduce((sum, value) => sum + value, 0);
};

const getHorse = (horseId: HorseId, horses: HorseWithHelpers[]) => {
  return horses.find((horse) => horse._id === horseId);
};

const STAT_TO_AUTOTEXT: Record<HorseStat, AutoTextTrigger> = {
  speed: 'HORSE_POWERUP_SPEED',
  endurance: 'HORSE_POWERUP_ENDURANCE',
  water_resistance: 'HORSE_POWERUP_WATER_RESISTANCE',
  wind_resistance: 'HORSE_POWERUP_WIND_RESISTANCE',
  electric_resistance: 'HORSE_POWERUP_ELECTRIC_RESISTANCE',
};

export const powerupsGeneratePowerup = async (
  playerId: PlayerId,
): Promise<PowerupId> => {
  const horses = await Horses.find({ event: Events.currentId() }).fetchAsync();
  const shuffledHorses = shuffle(horses);

  const playerPowerups = await Powerups.find({
    event: Events.currentId(),
    player: playerId,
  }).fetchAsync();

  // Find the horse with the least powerups
  const horseToUpgrade = shuffledHorses.reduce((minHorse, horse) => {
    return getStatsSum(horse.powerup_stats) <
      getStatsSum(minHorse.powerup_stats)
      ? horse
      : minHorse;
  }, shuffledHorses[0]);

  const randomStat =
    HORSE_STATS[Math.floor(Math.random() * HORSE_STATS.length)];

  const newStatLevel = horseToUpgrade.powerup_stats[randomStat] + 1;

  const powerup: OptionalId<Powerup> = {
    player: playerId,
    event: Events.currentIdOrThrow(),
    horse: horseToUpgrade._id,
    given_at: new Date(),
    stat: randomStat,
    value: 1,
    level_at_award_time: newStatLevel,
  };

  const powerupId = await Powerups.insertAsync(powerup);

  await Horses.updateAsync(horseToUpgrade._id, {
    $set: {
      [`powerup_stats.${randomStat}`]: newStatLevel,
    },
  });

  const powerupSummary = getPowerupSummary(
    [...playerPowerups, powerup],
    horses,
  );

  sendAutoText({
    trigger: STAT_TO_AUTOTEXT[randomStat],
    playerId,
    templateVars: {
      horse_name: horseToUpgrade.name,
      horse_number: horseToUpgrade.number,
      horse_emoji: horseToUpgrade.emojiColorSquare,

      stat: STAT_FANCY_NAME[randomStat],
      total_player_powerups: playerPowerups.length + 1,

      powerup_summary: powerupSummary,
    },
  });

  return powerupId;
};

const getPowerupSummary = (
  playerPowerups: OptionalId<Powerup>[],
  horses: HorseWithHelpers[],
) => {
  const horsesWithPlayerPowerups: Record<HorseId, HorseStats> = {};

  // Initialize all horse stats to 0
  horses.forEach((horse) => {
    horsesWithPlayerPowerups[horse._id] = {
      speed: 0,
      endurance: 0,
      water_resistance: 0,
      wind_resistance: 0,
      electric_resistance: 0,
    };
  });

  playerPowerups.forEach((powerup) => {
    const ppHorse = horsesWithPlayerPowerups[powerup.horse];
    ppHorse[powerup.stat] += powerup.value;
  });

  const playerPowerupHorseSummaries = Object.entries(horsesWithPlayerPowerups)
    .filter(([_, horseStats]) => {
      // Only include horses that have at least one non-zero stat
      return Object.values(horseStats).some((value) => value > 0);
    })
    .map(([horseId, horseStats]) => {
      const horse = getHorse(horseId, horses);
      let horseSummary = `${horse?.emojiColorSquare} ${horse?.name}: `;
      let horseSummaryStats: string[] = [];
      HORSE_STATS.forEach((stat) => {
        if (horseStats[stat] > 0) {
          horseSummaryStats.push(
            `+${horseStats[stat]} ${STAT_FANCY_NAME[stat]}`,
          );
        }
      });
      return horseSummary + horseSummaryStats.join(', ');
    });

  return playerPowerupHorseSummaries.join('\n');
};
