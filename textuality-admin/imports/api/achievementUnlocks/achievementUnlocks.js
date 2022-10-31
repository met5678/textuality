import { Mongo } from 'meteor/mongo';

import AchievementUnlockSchema from 'schemas/achievementUnlock';

const AchievementUnlocks = new Mongo.Collection('achievementUnlocks');

AchievementUnlocks.attachSchema(AchievementUnlockSchema);

export default AchievementUnlocks;
