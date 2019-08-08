import Players from './players';
import Events from 'api/events';
import AchievementUnlocks from 'api/achievementUnlocks';

Players.helpers({
  numAchievements() {
    return AchievementUnlocks.find({
      event: Events.currentId(),
      player: this._id
    }).count();
  }
});
