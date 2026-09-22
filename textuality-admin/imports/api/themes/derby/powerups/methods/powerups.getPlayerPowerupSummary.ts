import { STAT_FANCY_NAME } from '/imports/schemas/derby/horse';
import { PlayerId } from '/imports/schemas/player';
import { Powerup } from '/imports/schemas/derby/powerup';
import Horses, { HorseWithHelpers } from '../../horses/horses';
import { HORSE_STATS, HorseId, HorseStats } from '/imports/schemas/derby/horse';
import { OptionalId } from '/imports/utils/optional-id';
import Powerups from '..';
import Players from '/imports/api/players/players';

const getHorse = (horseId: HorseId, horses: HorseWithHelpers[]) => {
  return horses.find((horse) => horse._id === horseId);
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

export const getPlayerPowerupSummary = async (playerId: PlayerId) => {
  const player = await Players.findOneAsync(playerId);
  const playerPowerups = await Powerups.find({ player: playerId }).fetchAsync();
  return getPowerupSummary(playerPowerups, Horses.find({}).fetch());
};
