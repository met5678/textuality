import { Mongo } from 'meteor/mongo';

import {
  AchievementUnlock,
  AchievementUnlockSchema,
} from '/imports/schemas/achievementUnlock';

interface AchievementUnlockWithHelpers extends AchievementUnlock {
  getAvatarUrl(dimension?: number): string;
}

const AchievementUnlocks = new Mongo.Collection<
  AchievementUnlock,
  AchievementUnlockWithHelpers
>('achievementUnlocks');

AchievementUnlocks.attachSchema(AchievementUnlockSchema);

export default AchievementUnlocks;
export { AchievementUnlockWithHelpers };
