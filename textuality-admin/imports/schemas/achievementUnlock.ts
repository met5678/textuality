import SimpleSchema from 'simpl-schema';

import Events from '/imports/api/events';

const AchievementUnlockSchema = new SimpleSchema({
  event: {
    type: String,
    allowedValues: Events.allIds,
  },
  achievement: String,
  name: String,
  time: Date,
  player: String,
  alias: String,
  avatar: String,
  numAchievements: SimpleSchema.Integer,
  hideFromScreen: {
    type: Boolean,
    defaultValue: false,
  },
});

interface AchievementUnlock {
  _id?: string;
  event: string;
  achievement: string;
  name: string;
  time: Date;
  player: string;
  alias: string;
  avatar: string;
  numAchievements: number;
  hideFromScreen?: boolean;
}

export default AchievementUnlockSchema;
export { AchievementUnlock, AchievementUnlockSchema };
