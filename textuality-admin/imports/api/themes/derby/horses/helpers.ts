import Horses from './horses';
import {
  HORSE_STATS,
  HorseStat,
  HorseStats,
} from '/imports/schemas/derby/horse';

Horses.helpers({
  stats(): HorseStats {
    // Return the sum of base stats and powerup stats
    const baseStats = this.base_stats || {};
    const powerupStats = this.powerup_stats || {};
    const combinedStats: HorseStats = {} as HorseStats;
    HORSE_STATS.forEach((stat) => {
      combinedStats[stat] = (baseStats[stat] || 0) + (powerupStats[stat] || 0);
    });
    return combinedStats;
  },

  formattedName() {
    return `${this.emojiColorSquare} ${this.name}`;
  },
});
