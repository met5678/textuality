import { Mongo } from 'meteor/mongo';

import { Achievement, AchievementSchema } from '/imports/schemas/achievement';

export interface AchievementWithHelpers extends Achievement {}

const Achievements = new Mongo.Collection<Achievement, AchievementWithHelpers>(
  'achievements',
);

Achievements.attachSchema(AchievementSchema);

export default Achievements;
