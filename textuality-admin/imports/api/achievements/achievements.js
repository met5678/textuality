import { Mongo } from 'meteor/mongo';

import AchievementSchema from 'schemas/achievement';

const Achievements = new Mongo.Collection('achievements');

Achievements.attachSchema(AchievementSchema);

export default Achievements;
