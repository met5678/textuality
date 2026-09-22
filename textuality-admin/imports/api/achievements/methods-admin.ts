import { Meteor } from 'meteor/meteor';

import Achievements from './achievements';
import { Achievement, AchievementId } from '/imports/schemas/achievement';
import { OptionalId, UpdateRequiredId } from '/imports/utils/optional-id';
import { EventId } from '/imports/schemas/event';

Meteor.methods({
  'achievements.new': async (achievement: OptionalId<Achievement>) => {
    const id = await Achievements.insertAsync(achievement);
    return id;
  },

  'achievements.update': async (achievement: UpdateRequiredId<Achievement>) => {
    await Achievements.updateAsync(achievement._id, { $set: achievement });
    return await Achievements.findOneAsync(achievement._id);
  },

  'achievements.upsert': async (achievement: OptionalId<Achievement>) => {
    if (!achievement._id) {
      const id = await Achievements.insertAsync(achievement);
      const insertedAchievement = await Achievements.findOneAsync(id);
      return insertedAchievement;
    } else {
      const id = achievement._id;
      delete achievement._id;
      await Achievements.updateAsync(id, { $set: achievement });
      const updatedAchievement = await Achievements.findOneAsync(id);
      return updatedAchievement;
    }
  },

  'achievements.delete': async (
    achievementId: AchievementId | AchievementId[],
  ) => {
    if (Array.isArray(achievementId)) {
      await Achievements.removeAsync({ _id: { $in: achievementId } });
    } else {
      await Achievements.removeAsync(achievementId);
    }
  },

  'achievements.resetEvent': async (event_id: EventId) => {
    await Achievements.updateAsync(
      { event: event_id },
      { $set: { earned: 0 } },
      { multi: true },
    );
  },

  'achievements.copyFrom': async (
    destinationEventId: EventId,
    sourceEventId: EventId,
  ) => {
    // First, delete existing achievements in the destination event
    await Achievements.removeAsync({ event: destinationEventId });

    const sourceAchievements = await Achievements.find({
      event: sourceEventId,
    }).fetchAsync();
    for (const sourceAchievement of sourceAchievements) {
      const destinationAchievement: OptionalId<Achievement> = {
        ...sourceAchievement,
        event: destinationEventId,
      };
      delete destinationAchievement._id;
      await Achievements.insertAsync(destinationAchievement);
    }
  },
});
