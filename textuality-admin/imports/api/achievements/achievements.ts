import { Mongo } from 'meteor/mongo';

import { Achievement, AchievementSchema } from '/imports/schemas/achievement';

const Achievements = new Mongo.Collection<Achievement>('achievements');

Achievements.attachSchema(AchievementSchema);

export default Achievements;
